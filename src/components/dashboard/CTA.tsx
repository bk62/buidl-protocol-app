import {
    Box,
    Grid,
    GridItem,
    Heading,
    Text,
    Flex,
    Button,
    useColorModeValue
} from "@chakra-ui/react"
import {
    ArrowRightIcon
} from "@chakra-ui/icons"
import NextLink from "next/link";


import Card from "../common/Card"
import CardContent from "../common/CardContent"
import AccountName from "../auth/AccountName"


export default function CTA({ topText, heading, text, ctaButton }) {

    return (
        <Card
            mx={{ base: "auto", md: 10 }}
            mt={4}
            mb={{ base: 4, md: 4 }}
            maxW={{ base: "95%", md: "md", lg: "3xl", xl: "4xl" }}
            bgColor="bg.1"
        >
            <CardContent
                display="flex"
                flexDirection="column"
                justifyContent="baseline"
                alignItems="stretch"
                p={8}
            >
                <Text
                    color={"text.200"}
                    mb={2}
                    fontWeight="semibold"
                    fontSize="sm"
                >
                    {topText}
                </Text>
                <Heading mb={8}>
                    {heading}
                </Heading>
                <Text
                    fontWeight="thin"
                    lineHeight="5"
                    mb={10}
                    color={"text.200"}
                >
                    {text}
                </Text>
                <NextLink href={ctaButton.href} passHref>
                    <Button
                        variant="ghost"
                        rightIcon={ctaButton.icon || <ArrowRightIcon />}
                        textAlign="left"
                        justifyContent="flex-start"
                        fontSize="md"
                        pl={``}
                        width="fit-content"
                        color={"text.cta"}
                        _hover={{
                            color: "text.cta.hover",
                        }}
                        {...ctaButton.props}
                    >
                        {ctaButton.text}
                    </Button>
                </NextLink>
            </CardContent>
        </Card>
    );
}