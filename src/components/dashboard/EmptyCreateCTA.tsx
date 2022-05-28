import {
    Box,
    Grid,
    GridItem,
    Heading,
    Text,
    Flex,
    Button,
    useColorModeValue,
    StyleProps
} from "@chakra-ui/react"

import NextLink from "next/link";


import Card from "../common/Card"
import CardContent from "../common/CardContent"
import { ReactElement } from "react";
import { ArrowRight } from "../../icons"

type EmptyCreateCTAProps = {
    topText?: string;
    heading?: string;
    text?: string | ReactElement;
    ctaText?: string;
    ctaIcon?: ReactElement;
    ctaHref?: string;
} & StyleProps

export default function EmptyCreateCTA(props: EmptyCreateCTAProps) {
    const { topText, heading, text, ctaText, ctaIcon, ctaHref, ...rest } = props;
    return (
        <Card
            maxW="full"
            bgColor="inherit"
            {...rest}
        >
            <CardContent
                display="flex"
                flexDirection="column"
                justifyContent="baseline"
                alignItems="stretch"
                px={6}
                pt={0}
                pb={4}

            >
                <Text
                    color={"text.200"}
                    mb={3}
                    fontWeight="extrathin"
                    fontSize="sm"
                >
                    {topText}
                </Text>
                <Heading mb={4} fontSize="xl" fontWeight="thin">
                    {heading}
                </Heading>
                <Text
                    fontWeight="thin"
                    lineHeight="5"
                    mb={4}
                    color={"text.200"}
                >
                    {text}
                </Text>
                <NextLink href={ctaHref || ""} passHref>
                    <Button
                        variant="ghost"
                        rightIcon={ctaIcon}
                        textAlign="left"
                        justifyContent="flex-start"
                        fontSize="md"
                        px={1}
                        width="fit-content"
                        color={"text.cta"}
                        _hover={{
                            color: "text.cta.hover",
                        }}
                        {...rest}
                    >
                        {ctaText}
                    </Button>
                </NextLink>
            </CardContent>
        </Card>
    );
}

EmptyCreateCTA.defaultProps = {
    topText: "There isn't anything here :(",
    heading: "You don't have any items",
    text: "Please create an item. It'll only take a minute.",
    ctaText: "I want to #BUIDL!",
    ctaIcon: <ArrowRight />,
    ctaHref: "/dashboard"
}