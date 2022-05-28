import * as React from "react";
import { Box, Flex, Image, Badge, Text, Button, HStack, useColorModeValue, Heading, useStyleConfig, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";


import GalleryCard from "../common/GalleryCard";

import { ViewIcon, BackIcon } from "../../icons";
import GalleryActionButton from "../common/GalleryActionButton";
import useIpfsMetadata from "../../hooks/utils/useIpfsMetadata"

import ProfileBadges from "./ProfileBadges";


const placeholder = {
    imageUrl: (id) => `https://picsum.photos/seed/${id}/500`,
    imageAlt: "Profile photo",
    description: "Web dev learning web3",
    about: "Longer paragraph description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    numBackers: 10,
    totalBackedAmount: 1000,
    numProjects: 2,
    totalInvestmentsInProjects: 200
}

const Profile = ({ profile }) => {

    // get ipfs metadata json
    const { data: metadata, isLoading: metadataIsLoading } = useIpfsMetadata({ metadataURI: profile.metadataURI, handle: profile.handle, type: "profile" });

    const footer = (
        <HStack
            justifyContent="end"
            spacing={4}
        >
            <GalleryActionButton href={`/profiles/${profile.handle}`} icon={<ViewIcon />} colorScheme="blue">View</GalleryActionButton>
            <GalleryActionButton href={`/profiles/back?handle=${profile.handle}`} icon={<BackIcon />} colorScheme="teal">Back</GalleryActionButton>
        </HStack>
    )

    return (
        <>
            <GalleryCard
                href={`/profiles/${profile.handle}`}
                image={metadataIsLoading ? null : (!!metadata && !!metadata.imageHttpUrl ? metadata.imageHttpUrl : placeholder.imageUrl(profile.profileId))}
                imageIsLoading={metadataIsLoading}
                imageAlt={`${profile.handle} - Profile Image`}
                address={profile.to}
                handle={profile.handle}
                timestamp={profile.timestamp}
                maxW={{ base: "sm", sm: "full" }}
                footer={footer}
            >
                <Box d="flex" alignItems="baseline" justifyContent="baseline">
                    <ProfileBadges timestamp={profile.timestamp} profileType={profile.profileType} />
                </Box>
                <Box mt='1' fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
                    <SkeletonText isLoaded={!metadataIsLoading}>
                        {metadata && metadata.name}
                    </SkeletonText>
                </Box>
                <Box>
                    <Text fontSize="sm" isTruncated noOfLines={[1, 2]}>
                        <SkeletonText isLoaded={!metadataIsLoading}>
                            {metadata && metadata.description}
                        </SkeletonText>
                    </Text>
                </Box>
                {/* <Text>{profile.metadataURI}</Text> */}
            </GalleryCard>


        </>
    );
}

export default Profile;