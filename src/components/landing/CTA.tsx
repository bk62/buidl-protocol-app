import React from "react";
import {
  chakra,
  Box,
  Flex,
  useColorModeValue,
  Stack,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link"

export function CTA() {
  return (
    <Flex
      bg={useColorModeValue("#F9FAFB", "gray.600")}
      // p={50}
      w="full"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        w="full"
        bg={useColorModeValue("gray.50", "gray.800")}
        alignItems="center"
        justifyContent="center"
      >
        <Box
          maxW="7xl"
          w={{ md: "3xl", lg: "4xl" }}
          // w="full"
          mx="auto"
          py={{ base: 12, lg: 16 }}
          px={{ base: 4, lg: 8 }}
          display={{ lg: "flex" }}
          alignItems={{ lg: "center" }}
          justifyContent={{ lg: "space-between" }}
        >
          <chakra.h2
            fontSize={{ base: "3xl", sm: "4xl" }}
            fontWeight="extrabold"
            letterSpacing="tight"
            lineHeight="shorter"
            color={useColorModeValue("gray.900", "gray.100")}
          >
            <chakra.span display="block">Ready to dive in?</chakra.span>
            <chakra.span
              display="block"
              color={useColorModeValue("brand.600", "gray.500")}
            >
              Start buidling!
            </chakra.span>
          </chakra.h2>
          <Stack
            direction={{ base: "column", sm: "row" }}
            mt={{ base: 8, lg: 0 }}
            shrink={{ lg: 0 }}
          >
            <NextLink href={"/dashboard"} passHref>
              <Link
                w={["full", , "auto"]}
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                px={5}
                py={3}
                border="solid transparent"
                fontWeight="bold"
                rounded="md"
                shadow="md"
                color={useColorModeValue("white", "gray.700")}
                bg={useColorModeValue("gray.600", "gray.500")}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.600"),
                }}
              >
                Buidl to earn
              </Link>
            </NextLink>

            <Link
              w={["full", , "auto"]}
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              px={5}
              py={3}
              border="solid transparent"
              fontWeight="bold"
              rounded="md"
              shadow="md"
              color="brand.600"
              bg="white"
              _hover={{
                bg: "brand.50",
              }}
            >
              Learn More
            </Link>
          </Stack>
        </Box>
      </Box>
    </Flex>
  );
}
