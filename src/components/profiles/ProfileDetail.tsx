import * as React from "react";
import { HStack, Link, Skeleton, Image, LinkBox, LinkOverlay, Box, Spinner, Flex, Center, Text, useColorModeValue, Stack, Button, Grid, GridItem, Icon, Heading, Container, SimpleGrid, SkeletonCircle, SkeletonText, VStack } from "@chakra-ui/react";
import { Divider } from '@chakra-ui/react'
import useProfile, { useProfileIdByHandle } from "../../hooks/profiles/useProfile";
import useProfileBackers from "../../hooks/profiles/useProfileBackers";
import useProjects from "../../hooks/projects/useProjects";
import { constants } from "ethers";
import Card from "../common/Card";
import CardHeader from "../common/CardHeader";
import CardContent from "../common/CardContent";
import Davatar from "@davatar/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCube, faArchway, faPenFancy } from '@fortawesome/free-solid-svg-icons'
import { ArrowRightIcon } from "@chakra-ui/icons";
import Backers from "./detail/Backers";
import Projects from "./detail/Projects";
import AccountName from "../auth/AccountName";
import EmptyListCTA from "../common/EmptyListCTA";
import NextLink from "next/link";
import useIpfsMetadata from "../../hooks/utils/useIpfsMetadata"
import truncateMiddle from "truncate-middle";
import { readMetadataJSON, ipfsUrlToNftStorageUrl } from "../../utils/helpers";
import { useQuery } from "react-query";
import { ViewIcon, BackIcon } from "../../icons";
import EmptyCreateCTA from "../dashboard/EmptyCreateCTA";
import ProfileBadges from "./ProfileBadges";
import Tags from "../common/Tags";
import useBuidlHub from "../../hooks/useBuidlHub";
import InfoRow from "../common/ProfileInfoRow";
import Contributors from "../common/Contributor";
import YieldTrust from "./detail/YieldTrust";
import useProjectsGallery from "../../hooks/projects/useProjectsGallery";
import { addERC20ToMetamask } from "../../utils/helpers";
import { Copy } from "../../icons";


const placeholder = {
    "name": "Anon Jack",
    "website": "anonjack.com",
    "twitter": "twitter.com/aj",
    "github.com": "github.com/aj",
    "about": "Hi, I’m Esthera Jackson, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).",
    "location": "US",
    // TODO developer level - use CL hackathon form
    "developer-level": "entry-level",
    "previous-projects": [
        {
            title: "AI at school",
            description: "Lots of AI related work for school",
            url: "github.com/aj/school-project"
        }
    ],
    "header-image": (id) => `https://picsum.photos/seed/${id}/2000`
}




const ProfileDetail = ({ handle, profileId }) => {
    const hub = useBuidlHub();

    // get profile data
    const query = useProfile(handle, profileId);
    const backersQuery = useProfileBackers(handle, profileId);
    // const projectsQuery = useProjects(handle);

    // if (!!query.data) {
    //     alert(JSON.stringify(query.data, null, 2));
    // }

    // get owner of profile nft
    const { data: profileId2 } = useProfileIdByHandle(handle);
    if (!!!profileId && !!profileId2) {
        profileId = profileId2;
    }
    const { data: profileOwner } = useQuery(
        ["profileOwner", handle], () => hub.getProfileOwner(profileId),
        {
            enabled: !!profileId,
            retry: false
        }
    )

    const address = !!profileOwner ? profileOwner : constants.AddressZero;



    // get ipfs metadata json
    const { data: metadata, isLoading: metadataIsLoading } = useQuery(
        ["metadata_json", "profile", handle], async () => {
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

    // get module details
    const { data: backModuleData } = useQuery(
        ["back_module", handle], () => hub.getProfileBackModule(profileId),
        {
            enabled: !!profileId,
        }
    )

    // get profile yield trusts
    const { data: yieldTrusts, isLoading: ytIsLoading } = useQuery(
        ["yield_trusts", { profileId }], () => hub.getYieldTrusts({ profileId }),
        {
            enabled: !!profileId
        }
    )

    // get projects
    const filters = { profileId }
    const { data: projects, isLoading: projectsIsLoading } = useQuery(
        ["projects_by_profile", filters], () => hub.getProjects(filters),
        {
            enabled: !!profileId
        }
    )

    const backModuleSet = !!query.data && !!query.data.backModule;
    const backModule = backModuleSet && !!backModuleData && backModuleData.length > 0 ? backModuleData[0] : null
    const moduleDetails = backModuleSet && !!backModule
        ?
        (
            <VStack justifyContent={"center"} alignItems="center" >
                <Text fontSize='lg' color="text" fontWeight='normal'>
                    ICO: Backers get ERC-20 tokens!
                    {/* {backModule && JSON.stringify(backModule, null, 2)} */}
                </Text>
                <Text fontSize='sm' color="text" fontWeight='thin'>
                    You will get 1.0 {backModule && backModule.name} ({backModule && backModule.symbol})
                    tokens for every {backModule && backModule.tokenPriceInUsd} USD worth of MATIC or tokens you contribute to this creator.
                </Text>
                {backModule && (<Button
                    size="xs"
                    variant="link"
                    colorScheme="gray"
                    marginLeft={4}
                    fontWeight="thin"
                    onClick={() => {
                        addERC20ToMetamask(backModule.erc20Address, backModule.symbol, 18)
                    }}
                >
                    Add {backModule && backModule.symbol} to Metamask
                </Button>)}
            </VStack>
        )
        : (
            <VStack justifyContent={"center"} alignItems="center" >
                <Text fontSize='xs' color="text" fontWeight='thin'>
                    Profile Owner has not set a Back Module
                </Text>
            </VStack>
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
                                    <NextLink href={`/profiles/back?handle=${query.data?.handle}`} passHref>
                                        <Button
                                            variant="solid"
                                            colorScheme="teal"
                                            size="lg"
                                            leftIcon={<BackIcon />}
                                        >
                                            Back this Profile
                                        </Button>
                                    </NextLink>

                                </GridItem>
                            </Grid>
                        </CardHeader>
                        <CardContent px='5px'>

                            <Grid gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr", md: "1fr 1fr" }} gap={10}
                                justifyContent={{ base: "flex-start", md: "center" }}
                                alignItems="center"
                            >
                                <GridItem>
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
                                                    Profile Type: {" "}
                                                </Text>
                                                {query.data && (<ProfileBadges profileType={query.data?.profileType} />)}
                                            </Stack>

                                            <Stack direction="row" mb={1} alignItems="center">
                                                <Text
                                                    color={"text.200"}
                                                    fontSize="md"
                                                    fontWeight="bold"
                                                    me={2}
                                                    textTransform="capitalize"
                                                >
                                                    Back NFT Contract: {" "}
                                                </Text>
                                                {
                                                    (query.data && query.data.backNFT
                                                        && query.data.backNFT !== constants.AddressZero)
                                                        ? (
                                                            <>
                                                                <AccountName address={query.data.backNFT} />
                                                                <Button size="sm" variant="link" ml={1} onClick={() => { navigator.clipboard.writeText(query.data.backNFT); }} leftIcon={<Copy />} colorScheme="gray"> </Button>
                                                            </>
                                                        )
                                                        : `Not Deployed Yet`
                                                }

                                            </Stack>

                                            <Stack direction="row" mb={1} alignItems="center">
                                                <Text
                                                    color={"text.200"}
                                                    fontSize="md"
                                                    fontWeight="bold"
                                                    me={2}
                                                    textTransform="capitalize"
                                                >
                                                    Profile Tags: {" "}
                                                </Text>
                                                {metadata && metadata?.tags && (<Tags tags={metadata.tags} />)}
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
                                </GridItem>
                                <GridItem>
                                    {moduleDetails}
                                </GridItem>
                            </Grid>
                        </CardContent>
                    </Card>

                </Box>
            </GridItem>

            {/* Other panels */}

            <GridItem colSpan={{ sm: 1, md: 2, lg: 3 }}>

                <Card p="16px" shadow="0" bg="bg.2">
                    <CardHeader p='12px 5px' mb='12px'>
                        <Text fontSize='lg' color="text" fontWeight='bold'>
                            Yield Trusts
                        </Text>
                    </CardHeader>
                    <CardContent px='5px'>
                        <Flex direction='column' w='100%'>
                            {/* {JSON.stringify(yieldTrusts, null, 2)} */}
                            {!!yieldTrusts && yieldTrusts.map((yt) => (
                                <YieldTrust erc20Addr={yt.erc20} vaultAddr={yt.vault} />
                            ))}
                            {!!yieldTrusts && yieldTrusts.length === 0 && (
                                <Card
                                    maxW="full"
                                    bgColor="inherit"
                                    shadow={0}
                                    pb={0}
                                >
                                    <CardContent
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="baseline"
                                        alignItems="stretch"
                                        px={6}
                                        pt={0}
                                        pb={0}
                                    >
                                        <Text
                                            color={"text.200"}
                                            fontWeight="extrathin"
                                            fontSize="sm"
                                        >
                                            This profile doesn't have any yield trusts yet :(
                                        </Text>
                                    </CardContent>
                                </Card>

                            )}
                        </Flex>
                    </CardContent>
                </Card>
            </GridItem>


            <GridItem colSpan={{ sm: 1, md: 2, lg: 3 }}>
                <Box
                    px={1}
                    m={1}
                >
                    {/* {backersQuery.data && JSON.stringify(backersQuery.data, null, 2)} */}
                    <Contributors
                        title="Backers"
                        contributors={backersQuery.data || []}
                        contributorAddressKey="backer"
                        empty={
                            <EmptyCreateCTA
                                topText="This profile doesn't have any backers yet :("
                                heading="Back this profile!"
                                text="Back this profile to receive a cool Backer NFT and any rewards set on the Back module by the profile owner."
                                ctaText="Help this creator #BUIDL"
                                ctaHref={`/profiles/back?handle=${query.data?.handle}`}
                                shadow={0}
                            />
                        }
                    />
                    {/* <Backers
                        backers={backersQuery.data || []}
                        empty={
                            <EmptyCreateCTA
                                topText="This profile doesn't have any backers yet :("
                                heading="Back this profile!"
                                text="Back this profile to receive a cool Backer NFT and any rewards set on the Back module by the profile owner."
                                ctaText="Help this creator #BUIDL"
                                ctaHref={`/profiles/back?handle=${query.data?.handle}`}
                                shadow={0}
                            />
                        }
                    /> */}
                </Box>
            </GridItem>

            {/* Projects */}
            <GridItem colSpan={{ sm: 1, md: 2, lg: 3 }}>
                <Box
                    px={1}
                    m={1}
                >
                    <Projects projects={projects || []} />
                </Box>
            </GridItem>

        </SimpleGrid>


    )
}

export default ProfileDetail;