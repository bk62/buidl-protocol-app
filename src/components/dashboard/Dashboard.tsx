

import * as React from "react";
import { useQuery } from "react-query";
import {
    Box, Button, Heading, HStack, GridItem,
    SimpleGrid, Grid, VStack, Text,
    useColorModeValue, ButtonGroup,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
    Flex

} from "@chakra-ui/react";
import NextLink from "next/link"

import { ArrowRight, Carrot, Horse, VaultIcon } from "../../icons";



import useBuidlHub from "../../hooks/useBuidlHub";

import { useAccount } from "wagmi";
import ConnectWalletCTA from "../../components/common/ConnectWalletCTA";
import CTA from "../../components/dashboard/CTA";
import PageContainer from "../../components/common/PageContainer";
import Card from "../../components/common/Card";
import CardHeader from "../../components/common/CardHeader";
import CardContent from "../../components/common/CardContent";
import ConnectGH from "../../components/auth/ConnectGH";
import AccountName from "../../components/auth/AccountName";
import ProfilesTable from "../../components/dashboard/ProfilesTable";
import ProjectsTable from "../../components/dashboard/ProjectsTable";
import EmptyCreateCTA from "../../components/dashboard/EmptyCreateCTA";
import BackedProfilesTable from "./BackedProfilesTable";
import InvestedProjectsTable from "./InvestedProjectsTable"
import YieldTrustsTable from "./YieldTrustsTable"
import YieldTrustDepositsTable from "./YieldTrustDepositsTable"
import useWalletConnected from "../../hooks/auth/useWalletConnected";
import ConnectCTA from "../auth/ConnectCTA";

function Dashboard() {

    // connected to metamask
    const { walletConnected, walletAddress } = useWalletConnected();


    const hub = useBuidlHub();

    const numProfilesQuery = useQuery(
        ["numProfiles", walletAddress], () => hub.getAccountNumProfiles(walletAddress),
        {
            enabled: walletConnected
        }
    )
    const hasProfile = numProfilesQuery.isSuccess && numProfilesQuery.data && parseInt(numProfilesQuery.data.toString()) > 0;

    if (!walletConnected) {
        // not connected to metamask
        return (
            <ConnectCTA
                ghConnected={true}
                walletConnected={walletConnected}
                redirectTo={'/dashboard'}
                heading="Please connect your wallet to proceed."
                text="You will need to connect Metamask to see your profiles, projects and investments."
                helpText=" "
            />
        )
    }

    return (

        <Grid
            mb={8}
            gridTemplateColumns={{ base: "1fr", sm: "1fr", md: "1fr 1fr", lg: "1fr 1fr", xl: "1fr 1fr" }}
            // gridGap={{ base: 5 }}
            columnGap={{ base: 2 }}
            rowGap={{ base: 4 }}
            // bg='bg.2'
            bg={'bg.0'}
            height={"full"}
            px={6}
            py={1}
            // className="dashboard-container"
            display="grid"
            alignItems="stretch"
        >
            {/* 
            <GridItem colSpan={[1, 2]} >
                <StatGroup>
                    <Flex
                        flexDirection="row"
                        flexWrap="wrap"
                    >
                        <Card bg="bg.dashboard" shadow="base" rounded={[null, "md"]} h="full">
                            <Stat>
                                <StatLabel>Number of Profiles</StatLabel>
                                <StatNumber>{!!numProfilesQuery.data && numProfilesQuery.data.toString()}</StatNumber>
                            </Stat>
                        </Card>

                        <Card bg="bg.dashboard" shadow="base" rounded={[null, "md"]} h="full">

                            <Stat>
                                <StatLabel>Number of Projects</StatLabel>
                                <StatNumber>1</StatNumber>
                            </Stat>
                        </Card>

                        <Card bg="bg.dashboard" shadow="base" rounded={[null, "md"]} h="full">

                            <Stat>
                                <StatLabel>Number of Yield Trusts</StatLabel>
                                <StatNumber>1</StatNumber>
                            </Stat>
                        </Card>

                        <Card bg="bg.dashboard" shadow="base" rounded={[null, "md"]} h="full">

                            <Stat>
                                <StatLabel>Yield Trusts Total Deposits</StatLabel>
                                <StatNumber>1</StatNumber>
                            </Stat>
                        </Card>

                        <Card bg="bg.dashboard" shadow="base" rounded={[null, "md"]} h="full">

                            <Stat>
                                <StatLabel>Number of Backers</StatLabel>
                                <StatNumber>1</StatNumber>
                            </Stat>
                        </Card>

                        <Card bg="bg.dashboard" shadow="base" rounded={[null, "md"]} h="full">

                            <Stat>
                                <StatLabel>Number of Investors</StatLabel>
                                <StatNumber>1</StatNumber>
                            </Stat>
                        </Card>

                        <Card bg="bg.dashboard" shadow="base" rounded={[null, "md"]} h="full">

                            <Stat>
                                <StatLabel>Total Raised</StatLabel>
                                <StatNumber>1</StatNumber>
                            </Stat>
                        </Card>
                    </Flex>
                </StatGroup>


            </GridItem> */}


            <GridItem colSpan={[1, 2, 1]}>
                <Card bg="bg.dashboard" shadow="base" rounded={[null, "md"]} h="full">
                    <CardHeader
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Heading
                            my={4}
                            fontWeight="bold"
                            fontSize="4xl"
                            ml={6}
                            mt={10}
                            px={8}
                        >
                            Discover, back, and invest in extraordinary Web3 creators and their projects
                        </Heading>
                    </CardHeader>
                    <CardContent>
                        <VStack>
                            <Text
                                color={"text.200"}
                                m={0}
                                fontSize="sm"
                                lineHeight="base"
                                letterSpacing="wide"
                                fontWeight="thin"
                                mb={4}
                                textAlign="center"
                                mt={2}
                                px={8}
                                as="div"
                            >
                                <Text>Discover Web3 projects, become an early adopter, back promising creators and projects that could become the next big thing or
                                    contribute to public good projects.
                                </Text>
                                <Text>
                                    <Carrot mr={2} />
                                    Receive NFTs and ERC-20s for your contributions.
                                </Text>
                                <br />
                                <Text>
                                    <VaultIcon mr={2} />
                                    You can even contribute just the yield from your
                                    ERC-20 tokens to get all the benefits while preserving your crypto holdings.
                                </Text>
                            </Text>
                            <ButtonGroup pb={14}>
                                <NextLink href={"/profiles"} passHref>
                                    <Button size="sm" variant="outline" colorScheme="teal">
                                        Discover Creators
                                    </Button>
                                </NextLink>
                                <NextLink href={"/projects"} passHref>
                                    <Button size="sm" variant="outline" colorScheme="cyan">
                                        Discover Projects
                                    </Button>
                                </NextLink>
                            </ButtonGroup>
                        </VStack>
                    </CardContent>
                </Card>
            </GridItem>

            <GridItem colSpan={[1, 2, 1]}>
                <Card bg="bg.dashboard" shadow="base" rounded={[null, "md"]} h="full">
                    <CardHeader
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Heading
                            my={4}
                            fontWeight="bold"
                            fontSize="4xl"
                            ml={6}
                            mt={10}
                            px={8}
                        >
                            Create a project, fundraise, attract investors, and start building!
                        </Heading>
                    </CardHeader>
                    <CardContent>
                        <VStack>
                            <Text
                                color={"text.200"}
                                m={0}
                                fontSize="sm"
                                lineHeight="base"
                                letterSpacing="wide"
                                fontWeight="thin"
                                mb={4}
                                textAlign="center"
                                mt={2}
                                px={8}
                                as="div"
                            >
                                <Text>
                                    <Carrot mr={2} />
                                    Attract early adopters and investors by rewarding backers and investors with
                                    your project's ERC-20 tokens and NFTs.
                                </Text>
                                <Text> Create and fundraise to build Web3 tooling and public good projects.</Text>
                                <br />
                                <Text>
                                    <Horse mr={2} />
                                    Make investors and users an offer they can't refuse.
                                </Text>
                                <Text>
                                    <VaultIcon mr={2} />
                                    Investors can contribute just the yield from their
                                    ERC-20 tokens to get all the benefits while preserving their crypto holdings.
                                </Text>
                            </Text>
                            <ButtonGroup pb={14}>
                                <NextLink href={hasProfile ? "/projects/create" : "/profiles/create"} passHref>
                                    <Button size="sm" variant="outline" colorScheme="teal">
                                        {hasProfile ? "Build an awesome new Project" : "Start by creating a Profile"}
                                    </Button>
                                </NextLink>
                            </ButtonGroup>
                        </VStack>
                    </CardContent>
                </Card>
            </GridItem>

            <GridItem colSpan={[1, 2]}>
                <Card bg="bg.dashboard" shadow="base" rounded={[null, "md"]}>
                    <CardHeader
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Heading
                            my={4}
                            fontWeight="semibold"
                            fontSize="xl"
                            ml={6}
                        >
                            My Profiles
                        </Heading>
                        <NextLink href={"/dashboard/profiles"} passHref>
                            <Button
                                variant="link"
                                colorScheme="blue"
                                fontSize="sm"
                                height={6}
                                textTransform={"uppercase"}
                                letterSpacing={"wide"}
                                fontWeight="semibold"
                                px={14}
                                marginInlineEnd={6}
                            >
                                See All
                            </Button>
                        </NextLink>
                    </CardHeader>
                    <CardContent>
                        <ProfilesTable
                            filters={{ to: walletAddress }}
                            empty={
                                <EmptyCreateCTA
                                    heading="Please create a profile to #BUIDL"
                                    text="All you need to create a new project is two minutes, a Github account and (optionally) a profile cover image."
                                    ctaHref="/profiles/create"
                                />
                            }
                        />
                    </CardContent>
                </Card>
            </GridItem>

            <GridItem colSpan={[1, 2]}>
                <Card bg="bg.dashboard" shadow="base" rounded={[null, "md"]}>
                    <CardHeader
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Heading
                            my={4}
                            fontWeight="semibold"
                            fontSize="xl"
                            ml={6}
                        >
                            My Projects
                        </Heading>
                        <NextLink href={"/dashboard/projects"} passHref>
                            <Button
                                variant="link"
                                colorScheme="blue"
                                fontSize="sm"
                                height={6}
                                textTransform={"uppercase"}
                                letterSpacing={"wide"}
                                fontWeight="semibold"
                                px={14}
                                marginInlineEnd={6}
                            >
                                See All
                            </Button>
                        </NextLink>
                    </CardHeader>
                    <CardContent>
                        {/* Don't display create project cta unless a profile exists */}
                        <ProjectsTable
                            filters={{ creator: walletAddress }}
                            empty={
                                (numProfilesQuery.isSuccess && parseInt(numProfilesQuery.data.toString()) > 0)
                                    ? (
                                        <EmptyCreateCTA
                                            heading="Let's create a new project!"
                                            text="All you need to create a new project is two minutes, an idea and (optionally) a profile cover image."
                                            ctaHref="/projects/create"
                                        />
                                    )
                                    : (
                                        <EmptyCreateCTA
                                            heading="Please create a profile to #BUIDL"
                                            text="You need to create a profile before you can create a project. All you need to create a new project is two minutes, a Github account and (optionally) a profile cover image."
                                            ctaHref="/profiles/create"
                                        />
                                    )
                            }
                        />
                    </CardContent>
                </Card>
            </GridItem>

            <GridItem colSpan={[1, 2]}>
                <Card bg="bg.dashboard" shadow="base" rounded={[null, "md"]}>
                    <CardHeader
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Heading
                            my={4}
                            fontWeight="semibold"
                            fontSize="xl"
                            ml={6}
                        >
                            My Yield Trusts
                        </Heading>
                    </CardHeader>
                    <CardContent>
                        <YieldTrustsTable
                            filters={{ recipient: walletAddress }}
                            empty={
                                <EmptyCreateCTA
                                    heading="You don't have any yield trusts yet"
                                    text={
                                        <>
                                            You can create yield trusts to finance your projects.
                                            <br />
                                            Anyone can deposit ERC-20 tokens to your trust to support you via Defi yields!
                                            <br />
                                            Since they can withdraw 100% of their deposit, its lossless and win-win!
                                        </>
                                    }
                                    ctaHref="/profiles/trusts/create"
                                    ctaText="Leverage Defi to #BUIDL"
                                />
                            }
                        />
                    </CardContent>
                </Card>
            </GridItem>

            <GridItem colSpan={[1, 2]}>
                <Card bg="bg.dashboard" shadow="base" rounded={[null, "md"]}>
                    <CardHeader
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Heading
                            my={4}
                            fontWeight="semibold"
                            fontSize="xl"
                            ml={6}
                        >
                            Profiles I've Backed
                        </Heading>
                        {/* <NextLink href={"/dashboard/profiles"} passHref>
                            <Button
                                variant="link"
                                colorScheme="blue"
                                fontSize="sm"
                                height={6}
                                textTransform={"uppercase"}
                                letterSpacing={"wide"}
                                fontWeight="semibold"
                                px={14}
                                marginInlineEnd={6}
                            >
                                See All
                            </Button>
                        </NextLink> */}
                    </CardHeader>
                    <CardContent>
                        <BackedProfilesTable
                            filters={{ backer: walletAddress }}
                            empty={
                                <EmptyCreateCTA
                                    heading="You haven't backed anyone yet"
                                    text="Any profiles you back by contributing MATIC or tokens to will show up here."
                                    ctaHref="/profiles/"
                                    ctaText="Discover Web3 Creators"
                                />
                            }
                        />
                    </CardContent>
                </Card>
            </GridItem>

            <GridItem colSpan={[1, 2]}>
                <Card bg="bg.dashboard" shadow="base" rounded={[null, "md"]}>
                    <CardHeader
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Heading
                            my={4}
                            fontWeight="semibold"
                            fontSize="xl"
                            ml={6}
                        >
                            Projects I've Invested In
                        </Heading>
                        {/* <NextLink href={"/dashboard/projects"} passHref>
                            <Button
                                variant="link"
                                colorScheme="blue"
                                fontSize="sm"
                                height={6}
                                textTransform={"uppercase"}
                                letterSpacing={"wide"}
                                fontWeight="semibold"
                                px={14}
                                marginInlineEnd={6}
                            >
                                See All
                            </Button>
                        </NextLink> */}
                    </CardHeader>
                    <CardContent>
                        {/* Don't display create project cta unless a profile exists */}
                        <InvestedProjectsTable
                            filters={{ investor: walletAddress }}
                            empty={
                                <EmptyCreateCTA
                                    heading="You haven't invested in any projects yet"
                                    text="Any projects you invest in by contributing MATIC or tokens to will show up here."
                                    ctaHref="/projects/"
                                    ctaText="Discover Web3 Projects"
                                />
                            }
                        />
                    </CardContent>
                </Card>
            </GridItem>

            <GridItem colSpan={[1, 2]}>
                <Card bg="bg.dashboard" shadow="base" rounded={[null, "md"]}>
                    <CardHeader
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Heading
                            my={4}
                            fontWeight="semibold"
                            fontSize="xl"
                            ml={6}
                        >
                            My Yield Trust Deposits
                        </Heading>
                    </CardHeader>
                    <CardContent>
                        <YieldTrustDepositsTable
                            filters={{ recipient: walletAddress }}
                            empty={
                                <EmptyCreateCTA
                                    heading="You don't have any yield trust deposits yet"
                                    text={
                                        <>
                                            Profiles create yield trusts to finance their projects.
                                            <br />
                                            You can deposit ERC-20 tokens to your trust to support profiles via Defi yields!
                                            <br />
                                            Since you can withdraw 100% of their deposit anytime, its lossless and win-win!
                                        </>
                                    }
                                    ctaHref="/profiles/"
                                    ctaText="Discover Creators & Leverage Defi "
                                />
                            }
                        />
                    </CardContent>
                </Card>
            </GridItem>

            <GridItem colSpan={[1, 2]} mb={4}></GridItem>

        </Grid>


    )
}


export default Dashboard