import * as React from "react";
import { Box, Text, Heading, useColorModeValue } from "@chakra-ui/react";

import ConnectButton from "../auth/ConnectButton";

export default function ConnectWalletCTA(props) {
    const { heading, text } = props;
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
            bg={useColorModeValue("white", "gray.700")}
            py="45px"
            minHeight="400px"
        >

            {/* <Image /> */}
            <Heading
                color={useColorModeValue("gray.800", "gray.100")}
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
                color={useColorModeValue("gray.500", "gray.400")}
                m={0}
                fontSize="sm"
                lineHeight="base"
                letterSpacing="wide"
                fontWeight="thin"
                mb={8}
                textAlign="center"
            >
                {text}
            </Text>
            <ConnectButton />
        </Box>

    )
}

ConnectWalletCTA.defaultProps = {
    heading: "Please connect your wallet",
    text: "Please connect your wallet to see your projects, backers and investors"
}