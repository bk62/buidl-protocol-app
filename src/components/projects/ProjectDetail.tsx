import * as React from "react";
import {
    Link, Box,
    Flex, Center, Text, useColorModeValue, Stack, Button, Grid, GridItem, Icon, Heading, Container, LinkBox, LinkOverlay,
    SkeletonText, Image, Skeleton, SimpleGrid
} from "@chakra-ui/react";
import { Divider } from '@chakra-ui/react'
import useProject from "../../hooks/projects/useProject";
import useProjectInvestors from "../../hooks/projects/useProjectInvestors";
import useProjects from "../../hooks/projects/useProjects";
import { useProfileIdByHandle } from "../../hooks/profiles/useProfile";
import { constants } from "ethers";
import Card from "../common/Card";
import CardHeader from "../common/CardHeader";
import CardContent from "../common/CardContent";
import Davatar from "@davatar/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCube, faArchway, faPenFancy } from '@fortawesome/free-solid-svg-icons'
import { ArrowRightIcon } from "@chakra-ui/icons";
import Investors from "./detail/Investors";
import AccountName from "../auth/AccountName";
import EmptyListCTA from "../common/EmptyListCTA";
import NextLink from "next/link";
import InfoRow from "../common/ProfileInfoRow";
import useBuidlHub from "../../hooks/useBuidlHub";
import { useQuery } from "react-query";
import { readMetadataJSON, ipfsUrlToNftStorageUrl } from "../../utils/helpers";
import { InvestIcon, ViewIcon } from "../../icons";
import Tags from "../common/Tags";
import EmptyCreateCTA from "../dashboard/EmptyCreateCTA";
import ProjectBadges from "./ProjectBadges";
import truncateMiddle from "truncate-middle";
import Contributors from "../common/Contributor";
import useYieldTrusts from "../../hooks/profiles/useYieldTrusts";



const placeholder = {
    "name": "Anon Jack",
    "website": "anonjack.com",
    "twitter": "twitter.com/aj",
    "github.com": "github.com/aj",
    "about": "Hi, I’m Esthera Jackson, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).",
    "location": "US",
    "previous-projects": [
        {
            title: "AI at school",
            description: "Lots of AI related work for school",
            url: "github.com/aj/school-project"
        }
    ],
    "header-image": (id) => `https://picsum.photos/seed/${id}/2000`
}


const ProjectDetail = ({ handle, projectId }) => {
    const hub = useBuidlHub();

    // get project data
    const query = useProject(handle);
    const investorsQuery = useProjectInvestors(handle);

    const profileId = !!query.data && query.data?.profileId;

    // get owner of project's profile nft
    const { data: profileOwner } = useQuery(
        ["profileOwner", "project", handle], () => hub.getProfileOwner(query.data?.profileId),
        {
            enabled: !!profileId,
            retry: false
        }
    )

    const address = !!profileOwner ? profileOwner : constants.AddressZero;

    // get project's IPFS metadata
    const { data: metadata, isLoading: metadataIsLoading } = useQuery(
        ["metadata_json", "project", handle], async () => {
            const res = await readMetadataJSON(query.data?.metadataURI)
            const data = res.data
            data.httpUrl = res.httpUrl
            data.imageHttpUrl = ipfsUrlToNftStorageUrl(data?.image)
            return data
        },
        {
            staleTime: 10e7, // never changes
            retry: false,
            enabled: !!query.data // only fetch when profile data is fetched
        }
    )




    return (
        <SimpleGrid
            columns={{ sm: 1, md: 2, lg: 3 }}
            rowGap={2}
        >
            <GridItem colSpan={{ sm: 1, md: 2, lg: 3 }}>
                <CardHeader w="full" px={0} bg="bg.2">
                    <Skeleton isLoaded={!metadataIsLoading}>
                        <Image
                            src={metadata && metadata.imageHttpUrl || ""}
                            alt={`${handle} - Profile image`}
                            objectFit={"cover"}
                            w="full" maxH="350px"
                            roundedTop={[null, "md"]} />
                    </Skeleton>
                </CardHeader>
            </GridItem>

            {/* Header */}
            <GridItem colSpan={{ sm: 1, md: 2, lg: 3 }}>
                <Box
                    px={1}
                    mx={1}
                >

                    <Card bg="bg.2" p="16px" pt={8} shadow="0"
                    >



                        <CardHeader p='12px 5px' mb='12px' justify="center" align="center">
                            <Grid gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr", md: "1fr 1fr" }} gap={10}
                                justifyContent={{ base: "flex-start", md: "center" }}
                                alignItems="center"
                            >
                                <GridItem>
                                    <Stack
                                        direction={["column", "row"]}
                                    >
                                        <Box me={{ base: 0, sm: 6 }} mb={6}>
                                            <Davatar size={80} address={address} />
                                        </Box>
                                        <Stack>
                                            <SkeletonText isLoaded={!metadataIsLoading}>
                                                <Text
                                                    fontSize={{ base: "lg", sm: "xl", md: "2xl", lg: "3xl" }}
                                                    fontWeight="extrabold"
                                                >
                                                    {metadata && metadata.name}
                                                </Text>
                                            </SkeletonText>
                                            <Text
                                                color={"text.200"}
                                                fontSize="sm"
                                            >
                                                {handle}
                                            </Text>
                                            <Text
                                                color={useColorModeValue("gray.400", "gray.500")}
                                                fontSize="sm"
                                                fontWeight="thin"
                                            >
                                                <AccountName address={address} />
                                            </Text>



                                        </Stack>
                                    </Stack>
                                </GridItem>
                                <GridItem>
                                    <NextLink href={`/projects/invest?handle=${query.data?.handle}`} passHref>
                                        <Button
                                            variant="solid"
                                            colorScheme="teal"
                                            size="lg"
                                            leftIcon={<InvestIcon />}
                                        >
                                            Invest in this Project
                                        </Button>
                                    </NextLink>
                                </GridItem>
                            </Grid>
                        </CardHeader>
                        <CardContent px='5px'>


                            <Flex direction="column">

                                <Divider my={4} />
                                <Flex
                                    align="baseline"
                                    direction="column"
                                    mb={4}
                                >
                                    {/* {metadata && JSON.stringify(metadata, null, 2)} */}
                                    {(['name', 'github']).map((k, ix) => (
                                        <InfoRow key={ix} title={k} value={(metadata && metadata[k]) || ""} />
                                    ))}

                                    <Stack direction="row" mb={1}>
                                        <Text
                                            color={"text.200"}
                                            fontSize="md"
                                            fontWeight="bold"
                                            me={2}
                                            textTransform="capitalize"
                                        >
                                            Metadata URI: {" "}
                                        </Text>
                                        <Link isExternal href={(query.data && query.data?.metadataURI) || ""}>
                                            <Container paddingInlineStart={0} marginInlineStart={0}>
                                                <Text
                                                    color="text"
                                                    fontSize="sm"
                                                    fontWeight="thin"
                                                >
                                                    {(query.data && query.data?.metadataURI && truncateMiddle(query.data?.metadataURI || "", 14, 14, "...")) || ""}
                                                </Text>
                                            </Container>
                                        </Link>

                                    </Stack>

                                    <Stack direction="row" mb={1} alignItems="center">
                                        <Text
                                            color={"text.200"}
                                            fontSize="md"
                                            fontWeight="bold"
                                            me={2}
                                            textTransform="capitalize"
                                        >
                                            Project Type: {" "}
                                        </Text>
                                        {query.data && (
                                            <ProjectBadges {...{ projectType: query.data?.projectType, projectSize: query.data?.projectSize, projectState: query.data?.projectState }} />
                                        )}
                                    </Stack>

                                    <Stack direction="row" mb={1} alignItems="center">
                                        <Text
                                            color={"text.200"}
                                            fontSize="md"
                                            fontWeight="bold"
                                            me={2}
                                            textTransform="capitalize"
                                        >
                                            Project Tags: {" "}
                                        </Text>
                                        {metadata && metadata?.tags && (<Tags tags={metadata.tags} />)}
                                    </Stack>

                                    <Stack direction="row" mb={1} alignItems="center">
                                        <Text
                                            color={"text.200"}
                                            fontSize="md"
                                            fontWeight="bold"
                                            me={2}
                                            textTransform="capitalize"
                                        >
                                            Profile: {" "}
                                        </Text>
                                        <NextLink href={`/profiles/${!!profileId ? profileId : ""}?isId=true`} passHref>
                                            <Button
                                                variant="link"
                                                colorScheme="gray"
                                                size="xs"
                                                ml={2}
                                                leftIcon={<ViewIcon />}
                                            >
                                                View Profile {" "} {!!profileId ? profileId : ""}
                                            </Button>
                                        </NextLink>
                                    </Stack>


                                    <Container mt={4} textAlign="justify" paddingInlineStart={0} marginInlineStart={0}>
                                        <SkeletonText isLoaded={!metadataIsLoading}>
                                            <Text
                                                color={"text.200"}
                                                fontSize="md"
                                            >
                                                {metadata && metadata.description}
                                            </Text>
                                        </SkeletonText>
                                    </Container>
                                </Flex>
                            </Flex>

                        </CardContent>
                    </Card>

                </Box>
            </GridItem>

            {/* Other panels */}

            {/* Backers data -- TODO show empty view when empty */}
            <GridItem colSpan={{ sm: 1, md: 2, lg: 3 }}>
                <Box
                    px={1}
                    m={1}
                >
                    <Contributors
                        title="Investors"
                        contributors={investorsQuery.data || []}
                        contributorAddressKey="investor"
                        empty={
                            <EmptyCreateCTA
                                topText="This project doesn't have any investors yet :("
                                heading="Invest in this project!"
                                text="Invest in this project to receive a cool Investor NFT and any rewards set on the Invest module by the project owner."
                                ctaText="I want to seed this #BUIDL project"
                                ctaHref={`/projects/invest?handle=${query.data?.handle}`}
                                shadow={0}
                            />
                        }
                    />
                </Box>
            </GridItem>

        </SimpleGrid>


    )
}

export default ProjectDetail;