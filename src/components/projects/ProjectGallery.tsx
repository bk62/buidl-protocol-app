import * as React from "react";
import { Text, Box, Spinner, Flex, Center, useColorModeValue, SimpleGrid } from "@chakra-ui/react";
import ProjectGalleryItem from "./ProjectGalleryItem"
import useProjectsGallery from "../../hooks/projects/useProjectsGallery";

const Projects = ({ filters = {} }) => {
    const query = useProjectsGallery({ filters });
    return (
        <SimpleGrid
            columns={{ base: 1, sm: 2, md: 2, lg: 3 }}
            bg={'bg.0'}
            spacing={5} my={6} alignItems="stretch" justifyContent="center"
        >
            {query.isLoading && (
                <Center p={8}>
                    <Spinner />
                </Center>
            )}

            {query.data?.map((project) => (
                <ProjectGalleryItem project={project} key={`${project.profileId}-${project.projectId}`} />
            )
            )}

            {query.isSuccess && query.data.length === 0 && (
                <Center p={8}>
                    <Text color="text" fontSize="lg" fontWeight="thin">
                        Nothing to see here.
                    </Text>
                </Center>
            )}
        </SimpleGrid>

    )
}

export default Projects;