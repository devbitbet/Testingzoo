// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;
pragma experimental ABIEncoderV2;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Counters } from "@openzeppelin/contracts/utils/Counters.sol";
import { SafeMath } from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IZoo } from "./interfaces/IZoo.sol";
import { IDrop } from "./interfaces/IDrop.sol";
import { IMarket } from "./interfaces/IMarket.sol";
import { IMedia } from "./interfaces/IMedia.sol";


contract ZooKeeper is Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private dropIDs;

    // Declare an Event
    event AddDrop(address indexed dropAddress, string title, uint256 eggSupply);
    event BuyEgg(address indexed from, uint256 indexed eggID);
    event Hatch(address indexed from, uint256 indexed eggID);
    event Breed(address indexed from, uint256 indexed eggID);
    event Mint(address indexed from, uint256 indexed tokenID);
    event Burn(address indexed from, uint256 indexed tokenID);
    event Free(address indexed from, uint256 indexed tokenID, uint256 indexed yield);

    // Mapping of ID to Drop
    mapping(uint256 => IDrop) public drops;

    // Mapping of ID to NFT
    mapping(uint256 => IZoo.Token) public tokens;

    // Price to set name of Token
    uint256 public namePrice;

    // External contracts
    IMarket public market;
    IMedia public media;
    IERC20 public zoo;

    struct Pair {
        uint256 tokenA;
        uint256 tokenB;
    }

    constructor(address _market, address _media, address _zoo) {
        market = IMarket(_market);
        media = IMedia(_media);
        zoo = IERC20(_zoo);
    }

    function setDrop(address dropAddress) public returns (uint256) {
        IDrop drop = IDrop(dropAddress);
        dropIDs.increment();
        uint256 dropID = dropIDs.current();
        drops[dropID] = drop;
        emit AddDrop(dropAddress, drop.title(), drop.eggSupply());
        return dropID;
    }

    // Issue a new token to owner
    function mint(address owner, IZoo.Token memory token) private {
        media.mintToken(owner, token);
        market.setBidShares(token.id, token.bidShares);
        tokens[token.id] = token;
        emit Mint(owner, token.id);
    }

    // Burn token owned by owner
    function burn(address owner, uint256 tokenID) private {
        media.burnToken(owner, tokenID);
        delete tokens[tokenID];
        emit Burn(msg.sender, tokenID);
    }

    // Accept ZOO and return Egg NFT
    function buyEgg(uint256 dropID) public {
        IDrop drop = IDrop(drops[dropID]);
        require(zoo.balanceOf(msg.sender) >= drop.eggPrice(), "ZK: Not Enough ZOO to purchase Egg");
        require(drop.eggSupply() > 0, "ZK: There are no Eggs that can be purchased");

        {
            // Transfer funds
            zoo.transferFrom(msg.sender, address(this), drop.eggPrice());

            // Instantiate a new token for Egg
            IZoo.Token memory egg = drop.newEgg();

            // Mint Egg Token
            mint(msg.sender, egg);
            emit BuyEgg(msg.sender, egg.id);
        }
    }

    function getAnimal(uint256 dropID, uint256 eggID) private view returns (IZoo.Token memory) {
        // Get Egg
        IZoo.Token memory egg = tokens[eggID];

        // Get random animal or hybrid from Drop
        if (egg.kind == IZoo.Type.BASE_EGG) {
            return IDrop(drops[dropID]).getRandomAnimal(unsafeRandom());
        } else {
            return IDrop(drops[dropID]).getRandomHybrid(unsafeRandom(), egg.parents);
        }
    }

    // Burn egg and randomly return an animal NFT
    function hatchEgg(uint256 dropID, uint256 eggID) public {
        // Get animal for given Egg
        IZoo.Token memory animal = getAnimal(dropID, eggID);

        // ...it's hatching!
        burn(msg.sender, eggID);

        // Mint new token
        mint(msg.sender, animal);

        emit Hatch(msg.sender, animal.id);
    }

    modifier canBreed(uint256 parentA, uint256 parentB) {
        require(media.tokenExists(parentA) && media.tokenExists(parentB), "ZK: nonexistent token");
        require(keccak256(abi.encode(parentA)) != keccak256(abi.encode(parentB)));
        require(breedReady(parentA), "ZK: Wait for cooldown to finish.");
        require(breedReady(parentB), "ZK: Wait for cooldown to finish.");

        // Require non hybrids
        // require(
        //     (parents.tokenA.kind == Type.BASE_ANIMAL) && (parents.tokenB.kind == Type.BASE_ANIMAL),
        //     "Hybrid animals cannot breed."
        // );

        _;
    }

    // Breed two animals and create a hybrid egg
    function breedAnimals(uint256 dropID, uint256 tokenA, uint256 tokenB) public canBreed(tokenA, tokenB) returns (uint256) {
        IZoo.Token memory egg = IDrop(drops[dropID]).newHybridEgg(
            IZoo.Parents({
                animalA: tokens[tokenA].name,
                animalB: tokens[tokenB].name,
                tokenA: tokenA,
                tokenB: tokenB
            })
        );

        // Update breeding delay for each parent
        updateBreedDelays(tokenA, tokenB);

        mint(msg.sender, egg);
        emit Breed(msg.sender, egg.id);
        return egg.id;
    }

    // Freeing an animal burns the animal NFT and returns the ZOO to the owner
    function freeAnimal(uint256 tokenID) public returns (uint256 yield) {
        IZoo.Token memory token = tokens[tokenID];

        // Burn the token
        burn(msg.sender, tokenID);

        // How long did we HODL?
        uint256 blockAge = block.number - token.birthday;
        uint256 daysOld = blockAge.div(28800);

        // Calculate yield
        yield = daysOld.mul(token.rarity.yield);

        // Transfer yield
        zoo.transfer(msg.sender, yield);
        emit Free(msg.sender, tokenID, yield);
    }

    // Set price for buying a name
    function setNamePrice(uint256 price) public onlyOwner {
        namePrice = price;
    }

    // Buy a custom name for your NFT
    function buyName(uint256 tokenID, string memory customName) public {
        require(
            zoo.balanceOf(msg.sender) < namePrice,
            "ZK: Not enough ZOO to purchase Name"
        );

        zoo.transferFrom(msg.sender, address(this), namePrice);

        IZoo.Token memory token = tokens[tokenID];
        token.customName = customName;
        tokens[tokenID] = token;
    }

    // Temporary random function
    function unsafeRandom() private view returns (uint256) {
        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(block.number, msg.sender, block.timestamp)
            )
        ) % 1000;
        return randomNumber;
    }

    // Update breed delays
    function updateBreedDelays(uint256 parentA, uint256 parentB) private {
        tokens[parentA].breed.count++;
        tokens[parentB].breed.count++;
        tokens[parentA].breed.timestamp = block.timestamp;
        tokens[parentB].breed.timestamp = block.timestamp;
    }

    // Get next timestamp token can be bred
    function breedNext(uint256 tokenID) public view returns (uint256) {
        IZoo.Token memory token = tokens[tokenID];
        return token.breed.timestamp + (token.breed.count * 1 days);
    }

    // Check whether token is ready to breed again
    function breedReady(uint256 tokenID) public view returns (bool) {
        // Never bred? Lets go
        if (tokens[tokenID].breed.count == 0) {
            return true;
        }

        // If current timestamp is greater than the next breed time, lets go
        if (block.timestamp > breedNext(tokenID)) {
            return true;
        }

        // Not ready
        return false;
    }
}


// import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
// import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
// import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import {ZooDrop} from "./ZooDrop.sol";
// import {ZooMedia} from "./ZooMedia.sol";
// import {ZooMarket} from "./ZooMarket.sol";
// import {ZooToken} from "./ZooToken.sol";
// import {IMarket} from "./interfaces/IMarket.sol";
// import {Decimal} from "./Decimal.sol";

// import "./console.sol";

// contract ZooKeeper {
//     using SafeMath for uint256;
//     using Counters for Counters.Counter;

//     uint256 avgBlocksDaily = 28800;

//     uint256 public hybridHatchTime = 36 hours;

//     uint256[] public coolDowns = [4 hours, 1 days, 3 days, 7 days, 30 days];

//     enum TokenType {
//         BASE_EGG,
//         BASE_ANIMAL,
//         HYBRID_EGG,
//         HYBRID_ANIMAL
//     }

//     Counters.Counter private _dropIDs;

//     // Declare an Event
//     event AddDrop(uint256 indexed _dropID, address indexed _dropAddress);
//     event BuyEgg(address indexed _from, uint256 indexed _tokenID);
//     event Hatch(address indexed _from, uint256 indexed _tokenID);
//     event Burn(address indexed _from, uint256 indexed _tokenID);
//     event FreeAnimal(
//         address indexed _from,
//         uint256 indexed _tokenID,
//         uint256 indexed _yield
//     );
//     event Breed(
//         address indexed _from,
//         uint256 _animalTokenId1,
//         uint256 _animalTokenId2,
//         uint256 _eggTokenId
//     );

//     struct Egg {
//         string parent1;
//         string parent2;
//         uint256 eggCreationTime;
//     }

//     // Mapping of breed count for each address
//     mapping(address => uint256) public breedCount;

//     // Mapping of token ID to NFT type
//     mapping(uint256 => TokenType) public types;

//     // Mapping of token ID to Egg
//     mapping(uint256 => Egg) public eggs;

//     // Mapping of token ID to Animal
//     mapping(uint256 => ZooDrop.Animal) public animals;

//     // Mapping of token ID to Hybrids
//     mapping(uint256 => ZooDrop.Hybrid) public hybrids;

//     // Mapping of token ID to Hybrid Eggs
//     // mapping (uint256 => HybridEgg) public hybridEggs;

//     // Mapping of drop id to ZooDrop address
//     mapping(uint256 => address) public drops;

//     // Mapping of token id to names
//     mapping(uint256 => string) public names;

//     // mapping of all hatched animals DOB (as blocknumbers)
//     mapping(uint256 => uint256) public animalDOB;

//     mapping(address => uint256) public lastTimeBred;

//     uint256 public namePrice;
//     ZooMarket public market;
//     ZooMedia public media;
//     IERC20 public token;
//     address public owner;

//     modifier onlyOwner() {
//         require(msg.sender == owner, "Only owner has access");
//         _;
//     }

//     modifier onlyExistingToken(uint256 tokenId) {
//         require(media.tokenExists(tokenId), "ZooKeeper: nonexistent token");
//         _;
//     }

//     constructor(
//         address _market,
//         address _media,
//         address _token
//     ) {
//         owner = msg.sender;
//         market = ZooMarket(_market);
//         media = ZooMedia(_media);
//         token = IERC20(_token);
//     }

//     function addDrop(
//         string memory _name,
//         uint256 _totalSupply,
//         uint256 _eggPrice,
//         address _address
//     ) public returns (uint256, address) {
//         _dropIDs.increment();
//         uint256 id = _dropIDs.current();

//         address dropAddress;

//         // Use address if passed in otherwise instantiate a new drop contract
//         if (_address == address(0)) {
//             ZooDrop drop = new ZooDrop(_name, _totalSupply, _eggPrice);
//             dropAddress = address(drop);
//         } else {
//             dropAddress = _address;
//         }

//         drops[id] = dropAddress;
//         emit AddDrop(id, dropAddress);
//         return (id, dropAddress);
//     }

//     // Helper to add Animals
//     function addAnimal(
//         uint256 _dropID,
//         string memory _animal,
//         uint256 _yield,
//         string memory _rarityName,
//         uint256 _rarity,
//         string memory _tokenURI,
//         string memory _metadataURI
//     ) public onlyOwner {
//         ZooDrop drop = ZooDrop(drops[_dropID]);
//         drop.addAnimal(
//             _animal,
//             _yield,
//             _rarityName,
//             _rarity,
//             _tokenURI,
//             _metadataURI
//         );
//     }

//     // Helper to add Hybrids
//     function addHybrid(
//         uint256 dropID,
//         string memory _animal,
//         string memory _base,
//         string memory _secondary,
//         uint256 yield,
//         string memory _tokenURI,
//         string memory _metadataURI
//     ) public onlyOwner {
//         ZooDrop drop = ZooDrop(drops[dropID]);
//         drop.addHybrid(
//             _animal,
//             _base,
//             _secondary,
//             yield,
//             _tokenURI,
//             _metadataURI
//         );
//     }

//     function setTokenURI(
//         uint256 _dropID,
//         string memory _name,
//         string memory _URI
//     ) public onlyOwner {
//         ZooDrop drop = ZooDrop(drops[_dropID]);
//         drop.setTokenURI(_name, _URI);
//     }

//     function setMetadataURI(
//         uint256 _dropID,
//         string memory _name,
//         string memory _URI
//     ) public onlyOwner {
//         ZooDrop drop = ZooDrop(drops[_dropID]);
//         drop.setMetadataURI(_name, _URI);
//     }

//     // Accept ZOO and return Egg NFT
//     function buyEgg(uint256 _dropID) public returns (uint256) {
//         ZooDrop drop = ZooDrop(drops[_dropID]);

//         require(
//             token.balanceOf(msg.sender) >= drop.eggPrice(),
//             "Not Enough ZOO Tokens to purchase Egg"
//         );

//         require(
//             drop.currentSupply() > 0,
//             "There are no more Eggs that can be purchased"
//         );

//         token.transferFrom(msg.sender, address(this), drop.eggPrice());

//         (string memory _tokenURI, string memory _metadataURI) = drop.buyEgg();
//         ZooMedia.MediaData memory data;

//         // Token metadata
//         data.tokenURI = _tokenURI;
//         data.metadataURI = _metadataURI;
//         data.contentHash = keccak256(
//             abi.encodePacked(_tokenURI, block.number, msg.sender)
//         );
//         data.metadataHash = keccak256(
//             abi.encodePacked(_metadataURI, block.number, msg.sender)
//         );

//         // Bid Shares for profit sharing
//         IMarket.BidShares memory bidShares;
//         bidShares.prevOwner = Decimal.D256(0);
//         bidShares.creator = Decimal.D256(10 * (10**18));
//         bidShares.owner = Decimal.D256(90 * (10**18));

//         // Mint token
//         media.mintFor(msg.sender, data, bidShares);

//         uint256 _tokenID = media.getRecentToken(msg.sender);

//         // Update bidshares
//         market.setBidShares(_tokenID, bidShares);

//         // Save egg state
//         Egg memory egg;
//         egg.eggCreationTime = block.timestamp;
//         eggs[_tokenID] = egg;
//         types[_tokenID] = TokenType.BASE_EGG;

//         emit BuyEgg(msg.sender, _tokenID);
//         return _tokenID;
//     }

//     function setName(uint256 _tokenID, string memory _name) public onlyOwner {
//         names[_tokenID] = _name;
//     }

//     function setNamePrice(uint256 _price) public onlyOwner {
//         namePrice = _price;
//     }

//     // Add a name for given NFT
//     function buyName(uint256 _tokenID, string memory _name) public {
//         require(
//             token.balanceOf(msg.sender) >= namePrice,
//             "Not Enough ZOO Tokens to purchase Name"
//         );

//         token.transferFrom(msg.sender, address(this), namePrice);
//         names[_tokenID] = _name;
//     }

//     // Burn egg and randomly return an animal NFT
//     function hatchEgg(uint256 dropId, uint256 tokenID)
//         public
//         returns (uint256)
//     {
//         ZooDrop drop = ZooDrop(drops[dropId]);

//         // need to check the hatch time delay

//         //  grab egg struct
//         Egg memory egg = eggs[tokenID];
//         TokenType eggType = types[tokenID];

//         media.burn(tokenID);

//         //  burn the eggToken(it's hatching)
//         emit Burn(msg.sender, tokenID);

//         // get the rarity for an animal
//         uint256 rarity = unsafeRandom();

//         ZooMedia.MediaData memory data;
//         ZooDrop.Animal memory _animal;
//         ZooDrop.Hybrid memory _hybrid;
//         ZooDrop.Rarity memory _rarity;

//         string memory hatchedAnimal;
//         string memory name1;
//         uint256 yield1;

//         // if not hybrid
//         if (uint256(TokenType.BASE_EGG) == uint256(eggType)) {
//             hatchedAnimal = pickAnimal(rarity);
//             (_animal.name, _animal.yield, _rarity) = drop.animals(
//                 hatchedAnimal
//             );
//             // _animal.rarity = ZooDrop.Rarity(_rarityName, _rarity);
//         } else if (uint256(TokenType.HYBRID_EGG) == uint256(eggType)) {
//             // if hybrid
//             // require(egg.eggCreationTime > egg.eggCreationTime.add(4 hours), "Must wait 4 hours for hybrid eggs to hatch.");
//             // pick array index 0 or 1 depending on the rarity
//             (name1, yield1) = drop.hybrids(
//                 concatAnimalIds(egg.parent1, egg.parent2)
//             );
//             (string memory name2, uint256 yield2) = drop.hybrids(
//                 concatAnimalIds(egg.parent2, egg.parent1)
//             );

//             ZooDrop.Hybrid[2] memory possibleHybrids = [
//                 ZooDrop.Hybrid(name1, yield1),
//                 ZooDrop.Hybrid(name2, yield2)
//             ];
//             hatchedAnimal = possibleHybrids[rarity % 2].name;
//             (name1, yield1) = drop.hybrids(hatchedAnimal);
//             _hybrid.name = name1;
//             _hybrid.yield = yield1;
//         }

//         if (uint256(TokenType.HYBRID_EGG) == uint256(eggType)) {
//             // data.tokenURI = drop.tokenURI(hatchedAnimal);
//             // data.metadataURI = drop.metadataURI(hatchedAnimal);
//         }

//         data.tokenURI = drop.tokenURI(hatchedAnimal);
//         data.metadataURI = drop.metadataURI(hatchedAnimal);
//         data.contentHash = keccak256(
//             abi.encodePacked(
//                 drop.tokenURI(hatchedAnimal),
//                 block.number,
//                 msg.sender
//             )
//         );
//         data.metadataHash = keccak256(
//             abi.encodePacked(
//                 drop.metadataURI(hatchedAnimal),
//                 block.number,
//                 msg.sender
//             )
//         );

//         IMarket.BidShares memory bidShares;
//         bidShares.prevOwner = Decimal.D256(0);
//         bidShares.creator = Decimal.D256(10 * (10**18));
//         bidShares.owner = Decimal.D256(90 * (10**18));

//         media.mintFor(msg.sender, data, bidShares); // this time not an egg but an animal

//         uint256 _tokenID = media.getRecentToken(msg.sender);

//         market.setBidShares(_tokenID, bidShares);

//         if (bytes(_animal.name).length > 0) {
//             _animal.rarity = _rarity;
//             animals[_tokenID] = _animal;
//             types[_tokenID] = TokenType.BASE_ANIMAL;
//         } else {
//             hybrids[_tokenID] = _hybrid;
//             types[_tokenID] = TokenType.HYBRID_ANIMAL;
//         }

//         // animal DOB
//         animalDOB[_tokenID] = block.number;

//         // type of NFT
//         emit Hatch(msg.sender, _tokenID);
//         return _tokenID;
//     }

//     // Breed two animals and create a hybrid egg
//     function breedAnimal(
//         uint256 dropId,
//         uint256 _tokenIDA,
//         uint256 _tokenIDB
//     ) public onlyExistingToken(_tokenIDA) returns (uint256) {
//         require(_tokenIDA != _tokenIDB);
//         uint256 delay = getBreedingDelay();

//         require(
//             block.timestamp - lastTimeBred[msg.sender] > delay,
//             "Must wait for cooldown to finish."
//         );

//         ZooDrop drop = ZooDrop(drops[dropId]);

//         // require non hybrids
//         TokenType animalTypeA = types[_tokenIDA];
//         TokenType animalTypeB = types[_tokenIDB];
//         require(
//             uint256(animalTypeA) == 1 && uint256(animalTypeB) == 1,
//             "Hybrid animals cannot breed."
//         );

//         // need to figure out the delay
//         // require(now.sub(checkBreedDelay()) <= 0)

//         (string memory _tokenURI, string memory _metadataURI) = drop
//             .getHybridEgg();
//         ZooMedia.MediaData memory data;
//         data.tokenURI = _tokenURI;
//         data.metadataURI = _metadataURI;
//         data.contentHash = keccak256(
//             abi.encodePacked(_tokenURI, block.number, msg.sender)
//         );
//         data.metadataHash = keccak256(
//             abi.encodePacked(_metadataURI, block.number, msg.sender)
//         );

//         IMarket.BidShares memory bidShare;

//         // Get confirmation
//         bidShare.prevOwner = Decimal.D256(0);
//         bidShare.creator = Decimal.D256(10 * (10**18));
//         bidShare.owner = Decimal.D256(90 * (10**18));
//         media.mintFor(msg.sender, data, bidShare);
//         uint256 eggTokenID = media.getRecentToken(msg.sender);

//         Egg memory hybridEgg;
//         hybridEgg.parent1 = animals[_tokenIDA].name;
//         hybridEgg.parent2 = animals[_tokenIDB].name;
//         hybridEgg.eggCreationTime = block.timestamp;

//         eggs[eggTokenID] = hybridEgg;

//         types[eggTokenID] = TokenType.HYBRID_EGG;
//         lastTimeBred[msg.sender] = block.timestamp;
//         breedCount[msg.sender]++;

//         emit Breed(msg.sender, _tokenIDA, _tokenIDB, eggTokenID);

//         return eggTokenID;
//     }

//     // Implemented prior to issue #30
//     // Should burn animal and return yield
//     function freeAnimal(uint256 _tokenID) public returns (bool) {
//         require(
//             bytes(hybrids[_tokenID].name).length > 0 ||
//                 bytes(animals[_tokenID].name).length > 0,
//             "Non-existing animal"
//         );

//         // burn the token
//         media.burn(_tokenID);
//         emit Burn(msg.sender, _tokenID);

//         uint256 blocks = block.number - animalDOB[_tokenID];
//         uint256 age = blocks.div(avgBlocksDaily);
//         uint256 dailyYield;
//         uint256 percentage;

//         if (bytes(hybrids[_tokenID].name).length > 0) {
//             // calculate daily yield
//             percentage = hybrids[_tokenID].yield;
//             dailyYield = age.mul(percentage) + percentage;
//             // transfer yield
//             token.transfer(msg.sender, dailyYield);
//             delete hybrids[_tokenID];
//         } else {
//             // calculate daily yield
//             percentage = animals[_tokenID].yield;
//             dailyYield = age.mul(percentage) + percentage;
//             // transfer yield
//             token.transfer(msg.sender, dailyYield);
//             delete animals[_tokenID];
//         }

//         delete animalDOB[_tokenID];
//         emit FreeAnimal(msg.sender, _tokenID, dailyYield);

//         return true;
//     }

//     //   @Kimani will overwrite this
//     // TEMP random function
//     function unsafeRandom() private view returns (uint256) {
//         uint256 randomNumber = uint256(
//             keccak256(
//                 abi.encodePacked(block.number, msg.sender, block.timestamp)
//             )
//         ) % 1000;
//         return randomNumber;
//     }

//     // take two animals and returns a bytes32 string of their names
//     // to be used with ZooMedia.possib;ePairs to get the two possible hybrid pairs coming from the two base animals
//     function concatAnimalIds(string memory a1, string memory a2)
//         internal
//         pure
//         returns (string memory)
//     {
//         return string(abi.encodePacked(a1, a2));
//     }

//     // Chooses animal based on random number generated from(0-999), replace strings with ENUMS / data that
//     // represents animal instead
//     function pickAnimal(uint256 random) public pure returns (string memory) {
//         if (random < 550) {
//             uint256 choice = random % 4;
//             if (choice == 0) {
//                 return "Pug";
//             } else if (choice == 1) {
//                 return "Butterfly";
//             } else if (choice == 2) {
//                 return "Kitten";
//             } else if (choice == 3) {
//                 return "Turtle";
//             }
//         } else if (random > 550 && random < 860) {
//             uint256 choice = random % 4;
//             if (choice == 0) {
//                 return "Penguin";
//             } else if (choice == 1) {
//                 return "Duckling";
//             } else if (choice == 2) {
//                 return "Orca";
//             } else if (choice == 3) {
//                 return "Elk";
//             }
//         } else if (random > 860 && random < 985) {
//             uint256 choice = random % 4;
//             if (choice == 0) {
//                 return "Panda";
//             } else if (choice == 1) {
//                 return "Gorilla";
//             } else if (choice == 2) {
//                 return "Elephant";
//             } else if (choice == 3) {
//                 return "Lion";
//             }
//         } else if (random > 985 && random < 995) {
//             uint256 choice = random % 2;
//             if (choice == 0) {
//                 return "Bear";
//             } else if (choice == 1) {
//                 return "Shark";
//             }
//         } else if (random > 995 && random < 1000) {
//             uint256 choice = random % 2;
//             if (choice == 0) {
//                 return "Blobfish";
//             } else if (choice == 1) {
//                 return "Naked Mole Rat";
//             }
//         }
//         return "Pug";
//     }

//     function getBreedingDelay() public view returns (uint256) {
//         uint256 count = breedCount[msg.sender];
//         uint256 delay;

//         if (count == 0) {
//             delay = 0;
//         } else if (count >= 5) {
//             delay = coolDowns[coolDowns.length - 1];
//         } else {
//             delay = coolDowns[count];
//         }

//         // if (count == 1) {
//         //     delay = coolDowns30 * avgBlocksDaily;
//         // } else if (count == 4) {
//         //     delay = 7 * avgBlocksDaily;
//         // } else if (count == 3) {
//         //     delay = 3 * avgBlocksDaily;
//         // } else if (count == 3) {
//         //     delay = avgBlocksDaily;
//         // } else if (count == 1) {
//         //     delay = avgBlocksDaily / 6;
//         // } else {
//         //     delay = 0;
//         // }
//         return delay;
//     }
// }
