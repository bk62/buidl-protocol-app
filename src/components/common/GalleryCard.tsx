import { Box, Image, Text, useColorModeValue, HStack, VStack, Spacer, BoxProps, LinkBox, LinkOverlay, Skeleton } from "@chakra-ui/react";
import { ReactElement } from "react";
import NextLink from "next/link";

import TimeAgo from "react-timeago";
import moment from "moment";
import Avatar from "@davatar/react";

import Card from "./Card";
import CardHeader from "./CardHeader";
import CardContent from "./CardContent";
import { constants } from "ethers";


type GalleryCardProps = {
    href?: string,
    image?: string | null;
    imageAlt?: string;
    children?: any,
    address?: string,
    handle?: string,
    timestamp?: string,
    footer?: boolean | ReactElement,
    imageIsLoading?: boolean;
} & BoxProps


const GalleryCard = ({ href = "#", image, imageAlt, imageIsLoading = false, address = constants.AddressZero, handle, timestamp, children, footer = false, ...rest }: GalleryCardProps) => {
    const mts = moment.unix(parseInt(timestamp || ""));
    const handleColor = useColorModeValue("gray.600", "gray.300");
    const timeColor = useColorModeValue("gray.300", "gray.500");
    return (
        <LinkBox>
            <Card variant="gradient" h="full" {...rest}>
                <NextLink href={href} passHref>
                    <LinkOverlay></LinkOverlay>
                </NextLink>

                {(image || imageIsLoading) && (
                    <CardHeader>
                        <Skeleton isLoaded={!imageIsLoading}>
                            <Image src={image || ""} alt={imageAlt} roundedTop="lg" objectFit={"cover"} w="full" maxH="350px" />
                        </Skeleton>
                    </CardHeader>
                )}
                <CardContent p={6}>
                    {children}

                    {(address || handle || timestamp) && (
                        <HStack spacing={3} alignItems="center" justify="baseline" mt="2">
                            <Avatar size={24} address={address || constants.AddressZero} />
                            <Text color={handleColor} fontSize="sm">{handle}</Text>
                            <Spacer />
                            <Text color={timeColor} fontSize="sm">
                                {/* <TimeAgo date={Number(timestamp) * 1000} /> */}
                                <time dateTime={mts.format()}>{mts.fromNow()}</time>
                            </Text>
                        </HStack>
                    )}
                </CardContent>

                {!!footer && (
                    <CardContent p={8} pb={4} pt={0} mt={-2}>
                        {footer}
                    </CardContent>
                )}

            </Card>
        </LinkBox>
    )
}



export default GalleryCard;