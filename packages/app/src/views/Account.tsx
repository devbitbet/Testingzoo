import BorderButton from "components/Button/BorderButton";
import Page from "components/layout/Page";
import React, { useState } from "react";
import { AppState } from "state";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { useHistory } from "react-router-dom";
import styles from "styled-components";
import { Label, Text } from "components/Text";
import { Heading } from "components";
import Body from "components/layout/Body";
import { useModal } from "components/Modal";
import BuyEggs from "components/BuyEggs";
import MyZooAccount from "views/MyZooAccount";
import { FaOldRepublic } from "react-icons/fa";

const fattyObject = [
   {
  base: 'Elephant',
  name: 'Baby Elephant',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elephant/Baby%20Elephant.jpg'
},
{
  base: 'Elk',
  name: 'Baby Elk',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elk/Baby%20Elk.jpg'
},
{
  base: 'Gorilla',
  name: 'Baby Gorilla',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Gorilla/Baby%20Gorilla.jpg'
},
{
  base: 'Orca',
  name: 'Baby Orca',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Orca/Baby%20Orca.jpg'
},
{
  base: 'Shark',
  name: 'Baby Shark',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Shark/Baby%20Shark.jpg'
},
{
  base: 'Bear',
  name: 'Banda',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Bear/Banda.jpg'
},
{
  name: 'Bear',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Bear/Bear.jpg'
},
{
  base: 'Bear',
  name: 'Bearblob',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Bear/Bearblob.jpg'
},
{
  base: 'Bear',
  name: 'Bearca',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Bear/Bearca.jpg'
},
{
  base: 'Bear',
  name: 'Bear Cub',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Bear/Bear%20Cub.jpg'
},
{
  base: 'Bear',
  name: 'Bearilla',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Bear/Bearilla.jpg'
},
{
  base: 'Bear',
  name: 'Bearling',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Bear/Bearling.jpg'
},
{
  base: 'Bear',
  name: 'Bearlion',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Bear/Bearlion.jpg'
},
{
  base: 'Bear',
  name: 'Bearpug',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Bear/Bearpug.jpg'
},
{
  base: 'Bear',
  name: 'Bearrat',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Bear/Bearrat.jpg'
},
{
  base: 'Bear',
  name: 'Bearshark',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Bear/Bearshark.jpg'
},
{
  base: 'Bear',
  name: 'Beartle',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Bear/Beartle.jpg'
},
{
  base: 'Bear',
  name: 'Beartten',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Bear/Beartten.jpg'
},
{
  base: 'Bear',
  name: 'Beartterfly',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Bear/Beartterfly.jpg'
},
{
  base: 'Bear',
  name: 'Belephant',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Bear/Belephant.jpg'
},
{
  base: 'Bear',
  name: 'Belk',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Bear/Belk.jpg'
},
{
  base: 'Bear',
  name: 'Benguin',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Bear/Benguin.jpg'
},
{
  name: 'Blobfish',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Blobfish/Blobfish.jpg'
},
{
  base: 'Butterfly',
  name: 'Butterbear',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Butterfly/Butterbear.jpg'
},
{
  base: 'Butterfly',
  name: 'Butterblob',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Butterfly/Butterblob.jpg'
},
{
  base: 'Butterfly',
  name: 'Butterflanda',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Butterfly/Butterflanda.jpg'
},
{
  base: 'Butterfly',
  name: 'Butterflelk',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Butterfly/Butterflelk.jpg'
},
{
  base: 'Butterfly',
  name: 'Butterflenguin',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Butterfly/Butterflenguin.jpg'
},
{
  base: 'Butterfly',
  name: 'Butterfling',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Butterfly/Butterfling.jpg'
},
{
  base: 'Butterfly',
  name: 'Butterflion',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Butterfly/Butterflion.jpg'
},
{
  base: 'Butterfly',
  name: 'Butterflitten',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Butterfly/Butterflitten.jpg'
},
{
  name: 'Butterfly',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Butterfly/Butterfly.jpg'
},
{
  base: 'Butterfly',
  name: 'Butterla',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Butterfly/Butterla.jpg'
},
{
  base: 'Butterfly',
  name: 'Butterphant',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Butterfly/Butterphant.jpg'
},
{
  base: 'Butterfly',
  name: 'Butterpug',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Butterfly/Butterpug.jpg'
},
{
  base: 'Butterfly',
  name: 'Butterrat',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Butterfly/Butterrat.jpg'
},
{
  base: 'Butterfly',
  name: 'Buttershark',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Butterfly/Buttershark.jpg'
},
{
  base: 'Butterfly',
  name: 'Buttorca',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Butterfly/Buttorca.jpg'
},
{
  base: 'Butterfly',
  name: 'Butturtle',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Butterfly/Butturtle.jpg'
},
{
  base: 'Butterfly',
  name: 'Caterpillar',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Butterfly/Caterpillar.jpg'
},
{
  base: 'Duckling',
  name: 'Dorca',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Duckling/Dorca.jpg'
},
{
  base: 'Duckling',
  name: 'Duckbear',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Duckling/Duckbear.jpg'
},
{
  base: 'Duckling',
  name: 'Duckblob',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Duckling/Duckblob.jpg'
},
{
  base: 'Duckling',
  name: 'Duckda',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Duckling/Duckda.jpg'
},
{
  base: 'Duckling',
  name: 'Duckelk',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Duckling/Duckelk.jpg'
},
{
  base: 'Duckling',
  name: 'Duckerfly',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Duckling/Duckerfly.jpg'
},
{
  base: 'Duckling',
  name: 'Duckitten',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Duckling/Duckitten.jpg'
},
{
  base: 'Duckling',
  name: 'Ducklephant',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Duckling/Ducklephant.jpg'
},
{
  name: 'Duckling',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Duckling/Duckling.jpg'
},
{
  base: 'Duckling',
  name: 'Ducklinguin',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Duckling/Ducklinguin.jpg'
},
{
  base: 'Duckling',
  name: 'Ducklion',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Duckling/Ducklion.jpg'
},
{
  base: 'Duckling',
  name: 'Duckorilla',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Duckling/Duckorilla.jpg'
},
{
  base: 'Duckling',
  name: 'DuckPug',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Duckling/DuckPug.jpg'
},
{
  base: 'Duckling',
  name: 'Duckrat',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Duckling/Duckrat.jpg'
},
{
  base: 'Duckling',
  name: 'Duckshark',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Duckling/Duckshark.jpg'
},
{
  base: 'Duckling',
  name: 'Durtle',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Duckling/Durtle.jpg'
},
{
  base: 'Elephant',
  name: 'Elebear',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elephant/Elebear.jpg'
},
{
  base: 'Elephant',
  name: 'Eleblob',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elephant/Eleblob.jpg'
},
{
  base: 'Elephant',
  name: 'Elepanda',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elephant/Elepanda.jpg'
},
{
  base: 'Elephant',
  name: 'Elepenguin',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elephant/Elepenguin.jpg'
},
{
  name: 'Elephant',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elephant/Elephant.jpg'
},
{
  base: 'Elephant',
  name: 'Elephantilla',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elephant/Elephantilla.jpg'
},
{
  base: 'Elephant',
  name: 'Elephantterfly',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elephant/Elephantterfly.jpg'
},
{
  base: 'Elephant',
  name: 'Elephanturtle',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elephant/Elephanturtle.jpg'
},
{
  base: 'Elephant',
  name: 'Elephelk',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elephant/Elephelk.jpg'
},
{
  base: 'Elephant',
  name: 'Elephitten',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elephant/Elephitten.jpg'
},
{
  base: 'Elephant',
  name: 'Elephling',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elephant/Elephling.jpg'
},
{
  base: 'Elephant',
  name: 'Elephlion',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elephant/Elephlion.jpg'
},
{
  base: 'Elephant',
  name: 'Elephorca',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elephant/Elephorca.jpg'
},
{
  base: 'Elephant',
  name: 'Elephrat',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elephant/Elephrat.jpg'
},
{
  base: 'Elephant',
  name: 'Elepug',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elephant/Elepug.jpg'
},
{
  base: 'Elephant',
  name: 'Eleshark',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elephant/Eleshark.jpg'
},
{
  name: 'Elk',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elk/Elk.jpg'
},
{
  base: 'Elk',
  name: 'Elka',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elk/Elka.jpg'
},
{
  base: 'Elk',
  name: 'Elkanda',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elk/Elkanda.jpg'
},
{
  base: 'Elk',
  name: 'Elkbear',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elk/Elkbear.jpg'
},
{
  base: 'Elk',
  name: 'Elkenguin',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elk/Elkenguin.jpg'
},
{
  base: 'Elk',
  name: 'Elkephant',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elk/Elkephant.jpg'
},
{
  base: 'Elk',
  name: 'Elkerfly',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elk/Elkerfly.jpg'
},
{
  base: 'Elk',
  name: 'Elkfish',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elk/Elkfish.jpg'
},
{
  base: 'Elk',
  name: 'Elkion',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elk/Elkion.jpg'
},
{
  base: 'Elk',
  name: 'Elkitten',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elk/Elkitten.jpg'
},
{
  base: 'Elk',
  name: 'Elkling',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elk/Elkling.jpg'
},
{
  base: 'Elk',
  name: 'Elkorilla',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elk/Elkorilla.jpg'
},
{
  base: 'Elk',
  name: 'Elkpug',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elk/Elkpug.jpg'
},
{
  base: 'Elk',
  name: 'Elk Rat',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elk/Elk%20Rat.jpg'
},
{
  base: 'Elk',
  name: 'Elkshark',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elk/Elkshark.jpg'
},
{
  base: 'Elk',
  name: 'Elkurtle',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Elk/Elkurtle.jpg'
},
{
  base: 'Duckling',
  name: 'Gen 1 Egg',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Duckling/Gen%201%20Egg.jpg'
},
{
  base: 'Gorilla',
  name: 'Goranda',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Gorilla/Goranda.jpg'
},
{
  base: 'Gorilla',
  name: 'Gorca',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Gorilla/Gorca.jpg'
},
{
  name: 'Gorilla',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Gorilla/Gorilla.jpg'
},
{
  base: 'Gorilla',
  name: 'Gorillabear',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Gorilla/Gorillabear.jpg'
},
{
  base: 'Gorilla',
  name: 'Gorillablob',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Gorilla/Gorillablob.jpg'
},
{
  base: 'Gorilla',
  name: 'Gorillafly',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Gorilla/Gorillafly.jpg'
},
{
  base: 'Gorilla',
  name: 'Gorillaguin',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Gorilla/Gorillaguin.jpg'
},
{
  base: 'Gorilla',
  name: 'Gorillaphant',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Gorilla/Gorillaphant.jpg'
},
{
  base: 'Gorilla',
  name: 'Gorilla Rat',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Gorilla/Gorilla%20Rat.jpg'
},
{
  base: 'Gorilla',
  name: 'Gorillark',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Gorilla/Gorillark.jpg'
},
{
  base: 'Gorilla',
  name: 'Gorillelk',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Gorilla/Gorillelk.jpg'
},
{
  base: 'Gorilla',
  name: 'Gorilling',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Gorilla/Gorilling.jpg'
},
{
  base: 'Gorilla',
  name: 'Gorillion',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Gorilla/Gorillion.jpg'
},
{
  base: 'Gorilla',
  name: 'Gorkitten',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Gorilla/Gorkitten.jpg'
},
{
  base: 'Gorilla',
  name: 'Gorturtle',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Gorilla/Gorturtle.jpg'
},
{
  base: 'Gorilla',
  name: 'Gug',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Gorilla/Gug.jpg'
},
{
  base: 'Lion',
  name: 'Lelephant',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Lion/Lelephant.jpg'
},
{
  name: 'Lion',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Lion/Lion.jpg'
},
{
  base: 'Lion',
  name: 'Lionbear',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Lion/Lionbear.jpg'
},
{
  base: 'Lion',
  name: 'Lion Cub',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Lion/Lion%20Cub.jpg'
},
{
  base: 'Lion',
  name: 'Lionda',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Lion/Lionda.jpg'
},
{
  base: 'Lion',
  name: 'Lionelk',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Lion/Lionelk.jpg'
},
{
  base: 'Lion',
  name: 'Lionfish',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Lion/Lionfish.jpg'
},
{
  base: 'Lion',
  name: 'Lionfly',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Lion/Lionfly.jpg'
},
{
  base: 'Lion',
  name: 'Lionguin',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Lion/Lionguin.jpg'
},
{
  base: 'Lion',
  name: 'Lionilla',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Lion/Lionilla.jpg'
},
{
  base: 'Kitten',
  name: 'Lion Kitty',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Kitten/Lion%20Kitty.jpg'
},
{
  base: 'Lion',
  name: 'Lionling',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Lion/Lionling.jpg'
},
{
  base: 'Lion',
  name: 'Lionorca',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Lion/Lionorca.jpg'
},
{
  base: 'Lion',
  name: 'Lionpug',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Lion/Lionpug.jpg'
},
{
  base: 'Lion',
  name: 'Lion Rat',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Lion/Lion%20Rat.jpg'
},
{
  base: 'Lion',
  name: 'Lionshark',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Lion/Lionshark.jpg'
},
{
  base: 'Lion',
  name: 'Lionturtle',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Lion/Lionturtle.jpg'
},
{
  base: 'Lion',
  name: 'Litten',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Lion/Litten.jpg'
},
{
  base: 'Naked Mole Rat',
  name: 'Naked Blobfish',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Naked%20Mole%20Rat/Naked%20Blobfish.jpg'
},
{
  base: 'Naked Mole Rat',
  name: 'Naked Butterfly',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Naked%20Mole%20Rat/Naked%20Butterfly.jpg'
},
{
  base: 'Naked Mole Rat',
  name: 'Naked Duckling',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Naked%20Mole%20Rat/Naked%20Duckling.jpg'
},
{
  base: 'Naked Mole Rat',
  name: 'Naked Elephant',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Naked%20Mole%20Rat/Naked%20Elephant.jpg'
},
{
  base: 'Naked Mole Rat',
  name: 'Naked Lion',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Naked%20Mole%20Rat/Naked%20Lion.jpg'
},
{
  base: 'Naked Mole Rat',
  name: 'Naked Mole Bear',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Naked%20Mole%20Rat/Naked%20Mole%20Bear.jpg'
},
{
  base: 'Naked Mole Rat',
  name: 'Naked Mole Elk',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Naked%20Mole%20Rat/Naked%20Mole%20Elk.jpg'
},
{
  base: 'Naked Mole Rat',
  name: 'Naked Mole Gorilla',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Naked%20Mole%20Rat/Naked%20Mole%20Gorilla.jpg'
},
{
  base: 'Naked Mole Rat',
  name: 'Naked Mole Kitten',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Naked%20Mole%20Rat/Naked%20Mole%20Kitten.jpg'
},
{
  base: 'Naked Mole Rat',
  name: 'Naked Mole Orca',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Naked%20Mole%20Rat/Naked%20Mole%20Orca.jpg'
},
{
  base: 'Naked Mole Rat',
  name: 'Naked Mole Pug',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Naked%20Mole%20Rat/Naked%20Mole%20Pug.jpg'
},
{
  name: 'Naked Mole Rat',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Naked%20Mole%20Rat/Naked%20Mole%20Rat.jpg'
},
{
  base: 'Naked Mole Rat',
  name: 'Naked Mole Shark',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Naked%20Mole%20Rat/Naked%20Mole%20Shark.jpg'
},
{
  base: 'Naked Mole Rat',
  name: 'Naked Panda',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Naked%20Mole%20Rat/Naked%20Panda.jpg'
},
{
  base: 'Naked Mole Rat',
  name: 'Naked Penguin',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Naked%20Mole%20Rat/Naked%20Penguin.jpg'
},
{
  base: 'Naked Mole Rat',
  name: 'Naked Rat Baby',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Naked%20Mole%20Rat/Naked%20Rat%20Baby.jpg'
},
{
  base: 'Naked Mole Rat',
  name: 'Naked Turtle',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Naked%20Mole%20Rat/Naked%20Turtle.jpg'
},
{
  name: 'Orca',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Orca/Orca.jpg'
},
{
  base: 'Orca',
  name: 'Orca Bear',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Orca/Orca%20Bear.jpg'
},
{
  base: 'Orca',
  name: 'Orcablob',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Orca/Orcablob.jpg'
},
{
  base: 'Orca',
  name: 'Orcafly',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Orca/Orcafly.jpg'
},
{
  base: 'Orca',
  name: 'Orcanda',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Orca/Orcanda.jpg'
},
{
  base: 'Orca',
  name: 'Orcapeng',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Orca/Orcapeng.jpg'
},
{
  base: 'Orca',
  name: 'Orcaphant',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Orca/Orcaphant.jpg'
},
{
  base: 'Orca',
  name: 'Orcapug',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Orca/Orcapug.jpg'
},
{
  base: 'Orca',
  name: 'Orcarat',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Orca/Orcarat.jpg'
},
{
  base: 'Orca',
  name: 'Orcashark',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Orca/Orcashark.jpg'
},
{
  base: 'Orca',
  name: 'Orcaturtle',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Orca/Orcaturtle.jpg'
},
{
  base: 'Orca',
  name: 'Orcelk',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Orca/Orcelk.jpg'
},
{
  base: 'Orca',
  name: 'Orcilla',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Orca/Orcilla.jpg'
},
{
  base: 'Orca',
  name: 'Orcling',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Orca/Orcling.jpg'
},
{
  base: 'Orca',
  name: 'Orclion',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Orca/Orclion.jpg'
},
{
  base: 'Orca',
  name: 'Orkitten',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Orca/Orkitten.jpg'
},
{
  name: 'Panda',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Panda/Panda.jpg'
},
{
  base: 'Panda',
  name: 'Pandablob',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Panda/Pandablob.jpg'
},
{
  base: 'Panda',
  name: 'Pandacat',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Panda/Pandacat.jpg'
},
{
  base: 'Panda',
  name: 'Panda Cub',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Panda/Panda%20Cub.jpg'
},
{
  base: 'Panda',
  name: 'Pandafly',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Panda/Pandafly.jpg'
},
{
  base: 'Panda',
  name: 'Pandaling',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Panda/Pandaling.jpg'
},
{
  base: 'Panda',
  name: 'Pandalion',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Panda/Pandalion.jpg'
},
{
  base: 'Panda',
  name: 'Pandalla',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Panda/Pandalla.jpg'
},
{
  base: 'Panda',
  name: 'Pandaphant',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Panda/Pandaphant.jpg'
},
{
  base: 'Panda',
  name: 'Pandapug',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Panda/Pandapug.jpg'
},
{
  base: 'Panda',
  name: 'Pandarat',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Panda/Pandarat.jpg'
},
{
  base: 'Panda',
  name: 'Pandashark',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Panda/Pandashark.jpg'
},
{
  base: 'Panda',
  name: 'Pandaturtle',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Panda/Pandaturtle.jpg'
},
{
  base: 'Panda',
  name: 'Pandelk',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Panda/Pandelk.jpg'
},
{
  base: 'Panda',
  name: 'Pandorca',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Panda/Pandorca.jpg'
},
{
  base: 'Panda',
  name: 'Panduin',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Panda/Panduin.jpg'
},
{
  base: 'Panda',
  name: 'Pearda',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Panda/Pearda.jpg'
},
{
  base: 'Penguin',
  name: 'Pelephant',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Penguin/Pelephant.jpg'
},
{
  base: 'Pug',
  name: 'Pelk',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Pug/Pelk.jpg'
},
{
  base: 'Penguin',
  name: 'Penda',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Penguin/Penda.jpg'
},
{
  base: 'Penguin',
  name: 'Pengbear',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Penguin/Pengbear.jpg'
},
{
  base: 'Penguin',
  name: 'Penggerfly',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Penguin/Penggerfly.jpg'
},
{
  base: 'Penguin',
  name: 'Pengkitty',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Penguin/Pengkitty.jpg'
},
{
  base: 'Penguin',
  name: 'Pengling',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Penguin/Pengling.jpg'
},
{
  base: 'Penguin',
  name: 'Pengpug',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Penguin/Pengpug.jpg'
},
{
  base: 'Penguin',
  name: 'Penguelk',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Penguin/Penguelk.jpg'
},
{
  base: 'Penguin',
  name: 'Penguilion',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Penguin/Penguilion.jpg'
},
{
  base: 'Penguin',
  name: 'Penguilla',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Penguin/Penguilla.jpg'
},
{
  name: 'Penguin',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Penguin/Penguin.jpg'
},
{
  base: 'Penguin',
  name: 'Penguin Chick',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Penguin/Penguin%20Chick.jpg'
},
{
  base: 'Penguin',
  name: 'Penguinfish',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Penguin/Penguinfish.jpg'
},
{
  base: 'Penguin',
  name: 'Penguinrat',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Penguin/Penguinrat.jpg'
},
{
  base: 'Penguin',
  name: 'Penguin Shark',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Penguin/Penguin%20Shark.jpg'
},
{
  base: 'Penguin',
  name: 'Penguorca',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Penguin/Penguorca.jpg'
},
{
  base: 'Penguin',
  name: 'Pengurtle',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Penguin/Pengurtle.jpg'
},
{
  base: 'Pug',
  name: 'Plobfish',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Pug/Plobfish.jpg'
},
{
  name: 'Pug',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Pug/Pug.jpg'
},
{
  base: 'Pug',
  name: 'Pugbear',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Pug/Pugbear.jpg'
},
{
  base: 'Pug',
  name: 'Pugda',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Pug/Pugda.jpg'
},
{
  base: 'Pug',
  name: 'Puggerfly',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Pug/Puggerfly.jpg'
},
{
  base: 'Pug',
  name: 'Puggerphant',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Pug/Puggerphant.jpg'
},
{
  base: 'Pug',
  name: 'Pugguin',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Pug/Pugguin.jpg'
},
{
  base: 'Pug',
  name: 'Puggy',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Pug/Puggy.jpg'
},
{
  base: 'Pug',
  name: 'Pugitten',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Pug/Pugitten.jpg'
},
{
  base: 'Pug',
  name: 'Pugling',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Pug/Pugling.jpg'
},
{
  base: 'Pug',
  name: 'Puglion',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Pug/Puglion.jpg'
},
{
  base: 'Pug',
  name: 'Pugorca',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Pug/Pugorca.jpg'
},
{
  base: 'Pug',
  name: 'Pugorilla',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Pug/Pugorilla.jpg'
},
{
  base: 'Pug',
  name: 'Pugrat',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Pug/Pugrat.jpg'
},
{
  base: 'Pug',
  name: 'Pugshark',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Pug/Pugshark.jpg'
},
{
  base: 'Pug',
  name: 'Pugurtle',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Pug/Pugurtle.jpg'
},
{
  base: 'Shark',
  name: 'Shanguin',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Shark/Shanguin.jpg'
},
{
  name: 'Shark',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Shark/Shark.jpg'
},
{
  base: 'Shark',
  name: 'Sharkbear',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Shark/Sharkbear.jpg'
},
{
  base: 'Shark',
  name: 'Sharkephant',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Shark/Sharkephant.jpg'
},
{
  base: 'Shark',
  name: 'Sharkerfly',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Shark/Sharkerfly.jpg'
},
{
  base: 'Shark',
  name: 'Sharkitten',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Shark/Sharkitten.jpg'
},
{
  base: 'Kitten',
  name: 'Shark Kitty',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Kitten/Shark%20Kitty.jpg'
},
{
  base: 'Shark',
  name: 'Sharkling',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Shark/Sharkling.jpg'
},
{
  base: 'Shark',
  name: 'Sharkorilla',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Shark/Sharkorilla.jpg'
},
{
  base: 'Shark',
  name: 'Shark Rat',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Shark/Shark%20Rat.jpg'
},
{
  base: 'Shark',
  name: 'Sharnda',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Shark/Sharnda.jpg'
},
{
  base: 'Shark',
  name: 'Shelk',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Shark/Shelk.jpg'
},
{
  base: 'Shark',
  name: 'Shlion',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Shark/Shlion.jpg'
},
{
  base: 'Shark',
  name: 'Shlobfish',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Shark/Shlobfish.jpg'
},
{
  base: 'Shark',
  name: 'Shorca',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Shark/Shorca.jpg'
},
{
  base: 'Shark',
  name: 'Shug',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Shark/Shug.jpg'
},
{
  base: 'Shark',
  name: 'Shurtle',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Shark/Shurtle.jpg'
},
{
  base: 'Turtle',
  name: 'Tiny Turtle',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Turtle/Tiny%20Turtle.jpg'
},
{
  base: 'Turtle',
  name: 'Turkitten',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Turtle/Turkitten.jpg'
},
{
  base: 'Turtle',
  name: 'Turtanda',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Turtle/Turtanda.jpg'
},
{
  base: 'Turtle',
  name: 'Turtelephant',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Turtle/Turtelephant.jpg'
},
{
  base: 'Turtle',
  name: 'Turtelk',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Turtle/Turtelk.jpg'
},
{
  base: 'Turtle',
  name: 'Turtilla',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Turtle/Turtilla.jpg'
},
{
  name: 'Turtle',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Turtle/Turtle.jpg'
},
{
  base: 'Turtle',
  name: 'Turtle Bear',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Turtle/Turtle%20Bear.jpg'
},
{
  base: 'Turtle',
  name: 'Turtleblob',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Turtle/Turtleblob.jpg'
},
{
  base: 'Turtle',
  name: 'Turtlepeng',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Turtle/Turtlepeng.jpg'
},
{
  base: 'Turtle',
  name: 'Turtlerat',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Turtle/Turtlerat.jpg'
},
{
  base: 'Turtle',
  name: 'Turtleshark',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Turtle/Turtleshark.jpg'
},
{
  base: 'Turtle',
  name: 'Turtling',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Turtle/Turtling.jpg'
},
{
  base: 'Turtle',
  name: 'Turtlion',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Turtle/Turtlion.jpg'
},
{
  base: 'Turtle',
  name: 'Turtorca',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Turtle/Turtorca.jpg'
},
{
  base: 'Turtle',
  name: 'Turtpug',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Turtle/Turtpug.jpg'
},
{
  base: 'Turtle',
  name: 'Turtterfly',
  src: 'http://res.cloudinary.com/htcif1pyx/image/upload/w_600/v1/CryptoZoo/9:16%20Aspect%20Ratio/Turtle/Turtterfly.jpg'
},

]

const toDataURL = url => fetch(url)
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  }))

const HeadingContainer = styles.div`
    width: 100%;
    display: flex;
    justify-content: start;
    margin: 0px 8px;
`;

const MyZooContainer = styles.div`
    width: 100%;
    display: flex;
    padding: 16px;
    
`

const StyledButton = styles.button`
    cursor: pointer;
    text-decoration: underline;
    text-transform: uppercase;
`;

const LabelWrapper = styles.div`
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;
`;

const ValueWrapper = styles(Text)`
    color: white;
    width: 100%;
    display: flex;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 18px;
`;
const RowWrapper = styles.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
    margin: 16px;
`;

const Account: React.FC = () => {
   const { account } = useWeb3React();
   const history = useHistory();
   const [onBuyEggs] = useModal(<BuyEggs />);
   const allEggs = useSelector<AppState, AppState["zoo"]["eggs"]>(
      (state) => state.zoo.eggs
   );
   const currentEggsOwned = Object.values(allEggs).filter(
      (egg) => egg.owner === account
   ).length;
   // setEggsOwned(currentEggsOwned)
   const handleClick = () => {
      history.push("/bank");
   };

   let valid = []
   let invalid = []

   const uploadMoralis = () => {
      console.log("LFG")
      let newAnimal= {
         name: '',
         base: '',
         imageUrl: ''
      };
      for(let i = 0; i < fattyObject.length; i++) {
         fetch(fattyObject[i].src)
            .then(response => {
               if(response.status != 404) {
                  valid.push(fattyObject[i])
                  newAnimal.name = fattyObject[i].name
                  newAnimal.base = fattyObject[i].base
                  //newAnimal.imageUrl = 
                  console.log(toDataURL(fattyObject[i].src))
               }
               else {
                  invalid.push(fattyObject[i])
               }
            })
                  /* toDataURL(fattyObject[i].src)
         .then(dataUrl => {
            console.log('RESULT:', dataUrl) */
      }
      //console.log(invalid[1].toString())
      /* for(let i = 0; i < valid.length; i++) {
         console.log(valid[i])
      }
      for(let i = 0; i < invalid.length; i++){
         console.log(invalid[i])
      } */
      console.log(valid, invalid)
   }

   const pageHeading = (
      <HeadingContainer>
         <Heading>My Account</Heading>
         <StyledButton
            style={{
               background: "transparent",
               border: "none",
               color: "white",
               marginLeft: "8px",
            }}
            onClick={() => uploadMoralis()}>
            View Bank
         </StyledButton>
      </HeadingContainer>
   );

   const toLink = () => {
    location.href = "https://pancakeswap.info/token/0x8e7788ee2b1d3e5451e182035d6b2b566c2fe997"
  }
   return (
      <>
         <Page>
            {pageHeading}
            <Body>
               <LabelWrapper>
                  <Label small>Wallet Balance</Label>
                  <BorderButton scale="md" onClick={toLink}>Add Funds</BorderButton>
               </LabelWrapper>
               <RowWrapper>
                  <ValueWrapper>Balance</ValueWrapper>
               </RowWrapper>
               <LabelWrapper>
                  <Label small>{currentEggsOwned} Eggs Owned</Label>
                  <BorderButton scale="md" onClick={() => onBuyEggs()}>
                     Buy Eggs
                  </BorderButton>
               </LabelWrapper>
            </Body>
            <MyZooAccount />
         </Page>
      </>
   );
};

export default Account;
