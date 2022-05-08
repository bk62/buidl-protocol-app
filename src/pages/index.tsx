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
import { Container } from '../components/layout/Container'
import { Main } from '../components/layout/Main'
import { CTA } from '../components/landing/CTA'
import { Footer } from '../components/navigation/Footer'
import { Features } from "../components/landing/Features"


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fa1, fa2, fa3 } from '@fortawesome/free-solid-svg-icons'

import Nav from "../components/navigation/Navbar";


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
    title: "Unify your payments stack",
    icon: <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />,
    text: `Manage all your online and offline sales in one place with a single
                    integration, simplifying reporting and reconciliation.Terminal works
                    seamlessly with Payments, Connect, and Billing.`,
  },
  {
    title: "Unify your payments stack",
    icon: <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />,
    text: `Manage all your online and offline sales in one place with a single
                    integration, simplifying reporting and reconciliation.Terminal works
                    seamlessly with Payments, Connect, and Billing.`,
  },
  {
    title: "Unify your payments stack",
    icon: <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />,
    text: `Manage all your online and offline sales in one place with a single
                    integration, simplifying reporting and reconciliation.Terminal works
                    seamlessly with Payments, Connect, and Billing.`,
  },
]

const steps = [
  {
    title: "Unify your payments stack",
    icon: <FontAwesomeIcon icon={fa1} />,
    text: `Manage all your online and offline sales in one place with a single
                    integration, simplifying reporting and reconciliation.Terminal works
                    seamlessly with Payments, Connect, and Billing.`,
  },
  {
    title: "Unify your payments stack",
    icon: <FontAwesomeIcon icon={fa2} />,
    text: `Manage all your online and offline sales in one place with a single
                    integration, simplifying reporting and reconciliation.Terminal works
                    seamlessly with Payments, Connect, and Billing.`,
  },
  {
    title: "Unify your payments stack",
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
    <Nav />
    {/* <Container> */}
    <Hero />
    <Features features={features} />
    <CTA />
    <Features features={steps} />

    {/* </Container> */}
    <Footer />


    {/* <Main>
        <Text color="text">
          Example repository of <Code>Next.js</Code> + <Code>chakra-ui</Code> +{' '}
          <Code>TypeScript</Code>.
        </Text>

        <List spacing={3} my={0} color="text">
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <ChakraLink
              isExternal
              href="https://chakra-ui.com"
              flexGrow={1}
              mr={2}
            >
              Chakra UI <LinkIcon />
            </ChakraLink>
          </ListItem>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <ChakraLink isExternal href="https://nextjs.org" flexGrow={1} mr={2}>
              Next.js <LinkIcon />
            </ChakraLink>
          </ListItem>
        </List>
      </Main>


      <Footer>
        <Text>Next ❤️ Chakra</Text>
      </Footer>
      <CTA /> */}
  </>
)

export default Index
