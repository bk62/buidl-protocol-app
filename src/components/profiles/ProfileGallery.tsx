import * as React from "react";
import { Text, Box, Spinner, Flex, Center, SimpleGrid } from "@chakra-ui/react";
import useProfiles from "../../hooks/profiles/useProfiles";
import Profile from "./ProfileGalleryItem"

const Profiles = ({ filters = {} }) => {
    const query = useProfiles({ filters });
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

            {query.data?.map((profile) => (
                <Profile profile={profile} key={profile.profileId} />
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

export default Profiles;