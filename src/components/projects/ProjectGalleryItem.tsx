import * as React from "react";
import { Box, Flex, Image, Badge, Text, HStack, useColorModeValue, Heading, useStyleConfig, SkeletonText } from "@chakra-ui/react";

import GalleryCard from "../common/GalleryCard";

import { ViewIcon, InvestIcon } from "../../icons";
import GalleryActionButton from "../common/GalleryActionButton";
import useIpfsMetadata from "../../hooks/utils/useIpfsMetadata"

import ProjectBadges from "./ProjectBadges";


const placeholder = {
    imageUrl: (id) => `https://picsum.photos/seed/${id}/500`,
    imageAlt: "Project photo",
    title: "Web dev learning web3",
    about: "Longer paragraph description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    numBackers: 10,
    totalBackedAmount: 1000,
    numProjects: 2,
    totalInvestmentsInProjects: 200
}

const Project = ({ project }) => {

    const { timestamp, projectType, projectSize, projectState } = project;

    // get ipfs metadata json
    const { data: metadata, isLoading: metadataIsLoading } = useIpfsMetadata({ metadataURI: project.metadataURI, handle: project.handle, type: "project" });


    const footer = (
        <HStack
            justifyContent="end"
            spacing={4}
        >
            <GalleryActionButton href={`/projects/${project.handle}`} icon={<ViewIcon />} colorScheme="blue">View</GalleryActionButton>
            <GalleryActionButton href={`/projects/invest?handle=${project.handle}`} icon={<InvestIcon />} colorScheme="teal">Invest</GalleryActionButton>
        </HStack>
    )

    return (
        <>
            <GalleryCard
                href={`/projects/${project.handle}`}
                image={metadataIsLoading ? null : (!!metadata && !!metadata.imageHttpUrl ? metadata.imageHttpUrl : placeholder.imageUrl(project.profileId))}
                imageIsLoading={metadataIsLoading}
                imageAlt={`${project.handle} - Project Profile Image`}
                address={project.creator}
                handle={project.handle}
                timestamp={project.timestamp}
                maxW={{ base: "sm", sm: "md" }}
                footer={footer}
            >
                <Box d="flex" alignItems="baseline">
                    <ProjectBadges {...{ timestamp, projectType, projectSize, projectState }} />

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
                {/* <Text>{project.metadataURI}</Text> */}
            </GalleryCard>


        </>
    );
}

export default Project;