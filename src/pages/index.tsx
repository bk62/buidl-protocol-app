import Head from "next/head"
import {
  Link as ChakraLink,
  Text,
  Code,
  List,
  ListIcon,
  ListItem,
} from '@chakra-ui/react'
import { CheckCircleIcon, LinkIcon } from '@chakra-ui/icons'

import { Hero } from '../components/landing/Hero'
import { CTA } from '../components/landing/CTA'
import { Features } from "../components/landing/Features"


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fa1, fa2, fa3 } from '@fortawesome/free-solid-svg-icons'

import { getDefaultLayout } from "../components/layout/Layout"

import React from "react";
import {
  chakra,
  Box,
  Flex,
  useColorModeValue,
  Stack,
  Link,
} from "@chakra-ui/react";


const features = [
  {
    title: "Raise funds by showcasing your Web3 projects and ideas",
    icon: <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />,
    text: `Your profiles are NFTs on the Buidl Hub contract. Your metadata is stored on
    IPFS + Filecoin via NFT.storage. Your profile metadata stores your Github username and your project metadata
    stores your Github project repository name.`,
  },
  {
    title: "Build your community of early adopters, backers and investors by rewarding them",
    icon: <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />,
    text: `Backers and investors are issued backer and investor NFTs. [Extension: that track your Github metadata (i.e. stars and forks)].
    Issue ERC-20s to backers based on fiat USD price per token via Chainlink pricefeeds. If and when your project takes off,
    take your early investors with you!
    `,
  },
  {
    title: "Leverage Defi to make backers and investors offers they can't refuse",
    icon: <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />,
    text: `Create ERC-4626 compatible "Yield Trust Vaults" that deposit into Aave Lending pools. 
    Your supporters can withdraw their entire deposit any time they want, and you get to claim the
    yield on the deposits to support your #Buidling. [Extension: use PoolTogether's TWAP implementation and Chainlink keeper to routinely reward depositors for keeping their
    tokens in the vault.]
    You get to build cool projects, your community
    gets to support you and inventivize building. Win-win!`,
  },
]

const steps = [
  {
    title: "Create a profile",
    icon: <FontAwesomeIcon icon={fa1} />,
    text: `Showcase all your Web3 projects in one place with a single
                    integration, simplifying reporting and reconciliation.Terminal works
                    seamlessly with Payments, Connect, and Billing.`,
  },
  {
    title: "Attract investors for your projects",
    icon: <FontAwesomeIcon icon={fa2} />,
    text: `Manage all your online and offline sales in one place with a single
                    integration, simplifying reporting and reconciliation.Terminal works
                    seamlessly with Payments, Connect, and Billing.`,
  },
  {
    title: "Succeed together!",
    icon: <FontAwesomeIcon icon={fa3} />,
    text: `Manage all your online and offline sales in one place with a single
                    integration, simplifying reporting and reconciliation.Terminal works
                    seamlessly with Payments, Connect, and Billing.`,
  },
]

const Index = () => (
  <>
    <Head>
      <title>Buidl Protocol</title>
    </Head>
    <Hero />
    <Features features={features} />
    <CTA />
    <Features features={steps} />
  </>
)

Index.getLayout = getDefaultLayout

export default Index
