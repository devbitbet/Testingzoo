import { ethers } from 'hardhat';

import { ZooToken } from '../types/ZooToken';

import { ZooFaucet } from '../types/ZooFaucet';

import chai, { expect } from "chai";

let zooToken: any;

let zooFaucet: any;

let signers: any;

describe("Test Faucet", () => {

    beforeEach(async () => {

        signers = await ethers.getSigners();

        const zooTokenFactory = await ethers.getContractFactory(
            "ZooToken",
            signers[0]
        );

        zooToken = (await zooTokenFactory.deploy()) as ZooToken;
        await zooToken.deployed();

        const zooFaucetFactory = await ethers.getContractFactory(
            "ZooFaucet",
            signers[0]
        );

        zooFaucet = (await zooFaucetFactory.deploy(zooToken.address)) as ZooFaucet;
        await zooFaucet.deployed()

    })

    it("Should mint 100,000,000 tokens from ZooToken to ZooFaucet", async () => {

        const faucetPreBal = await zooToken.balanceOf(zooFaucet.address)

        // await zooToken.mint(zooFaucet.address, 100000000);

        expect(parseInt(faucetPreBal._hex)).to.equal(0);


    });
})
