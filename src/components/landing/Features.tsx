import React from "react";
import {
    chakra,
    Box,
    SimpleGrid,
    Flex,
    useColorModeValue,
    Icon,
} from "@chakra-ui/react";



const Feature = (props) => {
    return (
        <Box>
            <Icon
                boxSize={12}
                color={useColorModeValue("gray.700", "gray.200")}
                mb={4}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
            >
                {props.icon}
            </Icon>
            <chakra.h3
                mb={3}
                fontSize="lg"
                lineHeight="shorter"
                fontWeight="bold"
                color={useColorModeValue("gray.900", "gray.400")}
            >
                {props.title}
            </chakra.h3>
            <chakra.p
                lineHeight="tall"
                color={useColorModeValue("gray.600", "gray.400")}
            >
                {props.children}
            </chakra.p>
        </Box>
    );
};


export function Features({ features }) {

    return (
        <Flex
            bg={useColorModeValue("#F9FAFB", "gray.600")}
            w="auto"
            justifyContent="center"
            alignItems="center"
        >
            <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={20}
                px={{ base: 4, lg: 16, xl: 24 }}
                py={20}
                w="full"
                bg={useColorModeValue("white", "gray.800")}
            >
                {features.map(({ title, icon, text }, ix: Number) =>
                    <Feature
                        key={ix}
                        title={title}
                        icon={icon}
                    >
                        {text}
                    </Feature>
                )}
            </SimpleGrid>
        </Flex>
    );
}
