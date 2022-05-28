import * as React from "react";
import { Box, Text, Heading, useColorModeValue, HStack, Container, UnorderedList, ListItem, ListIcon, SimpleGrid, GridItem } from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

import ConnectButton from "../auth/ConnectButton";
import ConnectGHButton from "./ConnectGHButton"

type ConnectCTAProps = {
    heading?: string | React.ReactElement,
    text?: string | React.ReactElement,
    helpText?: string | React.ReactElement,
    walletConnected: boolean,
    ghConnected: boolean,
    redirectTo?: string
}

export default function ConnectCTA({ heading = "", text = "", helpText = "", walletConnected = false, ghConnected = false, redirectTo = '/dashboard' }: ConnectCTAProps) {
    const bgColor = useColorModeValue("white", "gray.700");
    const hColor = useColorModeValue("gray.800", "gray.100");
    const textColor = useColorModeValue("gray.500", "gray.400");

    if (typeof window !== 'undefined') {
        redirectTo = `${window.location.protocol}//${window.location.host}${redirectTo}`;
    } else {
        redirectTo = `https://localhost:3000${redirectTo}`;
    }

    heading = !!heading ? heading : `Please connect your wallet and Github account to proceed.`
    text = !!text ? text : (
        <>
            You will need to connect your wallet as well as your Github to store data on chain and on IPFS + Filecoin.

        </>
    )
    helpText = !!helpText ? helpText : (
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
            <GridItem>
                <Text mb={2}>
                    We will use your Github to:
                </Text>
                <UnorderedList spacing={3} listStyleType="none" textAlign="start">
                    <ListItem>
                        <ListIcon as={CheckIcon} color="green.500" fontSize={"xs"} />
                        verify that you own (or, more accurately, had access to) the Github account associated with any projects you create
                    </ListItem>
                    <ListItem>
                        <ListIcon as={CheckIcon} color="green.500" fontSize={"xs"} />
                        streamline image file uploads to IPFS + Filecoin via Supabase auth and storage
                    </ListItem>
                    <ListItem>
                        <ListIcon as={CheckIcon} color="green.500" fontSize={"xs"} />
                        query publicly available data like the number of Stars and Forks your projects get
                    </ListItem>
                </UnorderedList>
            </GridItem>
            <GridItem>
                <Text mb={2}>
                    We will never:
                </Text>
                <UnorderedList spacing={3} listStyleType="none" textAlign="start">
                    <ListItem>
                        <ListIcon as={CloseIcon} color="red.500" fontSize={"xs"} />
                        query store any data other than your username and repository names
                    </ListItem>
                    <ListItem>
                        <ListIcon as={CloseIcon} color="red.500" fontSize={"xs"} />
                        store private data like emails on IPFS or on chain
                    </ListItem>
                </UnorderedList>

            </GridItem>
        </SimpleGrid>
    )



    return (
        <Box
            display="flex"
            flexDirection="column"
            shadow="base"
            rounded={[null, "md"]}
            overflow={{ sm: "hidden" }}
            justifyContent={"center"}
            alignItems={"center"}
            p="16px"
            bg={bgColor}
            py="45px"
            minHeight="400px"
        >

            {/* <Image /> */}
            <Heading
                color={hColor}
                fontSize="2xl"
                fontWeight="semibold"
                lineHeight="short"
                mb={4}
                textAlign="center"
                letterSpacing="unset"
            >
                {heading}
            </Heading>
            <Text
                color={textColor}
                m={0}
                fontSize="sm"
                lineHeight="base"
                letterSpacing="wide"
                fontWeight="thin"
                mb={4}
                textAlign="center"
            >
                {text}
            </Text>

            <Container
                color={textColor}
                fontSize="sm"
                lineHeight="base"
                letterSpacing="wide"
                fontWeight="thin"
                mb={4}
                textAlign="center"
            >
                {helpText}

            </Container>
            <HStack mt={4} spacing={4} alignItems="center" justifyContent="center">

                {!walletConnected && (
                    <ConnectButton />
                )}
                {!ghConnected && (
                    <ConnectGHButton fontSize="sm" redirectTo={redirectTo} />
                )}
            </HStack>
        </Box>

    )
}
