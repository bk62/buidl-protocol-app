import React, { ReactNode } from 'react';
import {
    Box,
    Flex,
    Icon,
    useColorModeValue,
    Link,
    BoxProps,
    FlexProps,
    Text,
    HStack,
    Spacer
} from '@chakra-ui/react';
import { ReactText } from 'react';
import NextLink from "next/link"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDashboard, faDiagramProject, faIdCard, faLayerGroup, faCubes, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import Davatar from '@davatar/react';

import useWalletConnected from "../../hooks/auth/useWalletConnected"
import useGHConnected from "../../hooks/auth/useGHConnected"
import AccountName from "../auth/AccountName"

interface LinkItemProps {
    name: string;
    icon: any;
    href: string;
    props?: any;
}
const LinkItems: Array<LinkItemProps> = [
    { name: 'Dashboard', href: "/dashboard", icon: faDashboard },
    { name: 'My Profiles', href: "/dashboard/profiles", icon: faLayerGroup },
    { name: 'Create a Profile', href: '/profiles/create', icon: faSquarePlus },
    { name: 'My Projects', href: "/dashboard/projects", icon: faCubes },
    { name: 'Create a Project', href: '/projects/create', icon: faSquarePlus },
    { name: 'Create a Yield Trust', href: '/profiles/trusts/create', icon: faSquarePlus },

];


const SidebarContent = ({ ...rest }) => {
    // connected to gh
    const { loggedIn, ghUsername } = useGHConnected();
    // connected to metamask
    const { walletConnected, walletAddress, activeChain } = useWalletConnected();


    return (
        <Box
            as="nav"
            transition="background-color 3s ease"
            bg={useColorModeValue('white', 'gray.800')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            borderBottom={{ base: "1px", md: "none" }}
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 48 }}
            // pos="fixed"
            h="full"
            display={{ base: "flex", md: "inherit" }}
            // flexDirection={{ base: "row", md: "inherti" }}
            flexWrap="wrap"
            alignItems="baseline"
            justifyContent="baseline"
            alignContent="baseline"
            {...rest}
        >

            {LinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon} href={link.href} {...link.props}>
                    {link.name}
                </NavItem>
            ))}

            <Box mt={4}></Box>

            {
                walletConnected && (
                    <>
                        <HStack pl={4} ml={4} fontSize="xs" mt={4} pb={1}>
                            <Box mr="12px">
                                <Davatar size={12} address={walletAddress} />
                            </Box>
                            <AccountName resolveENS={false} address={walletAddress} start={7} fontSize="xs" fontWeight="normal" />
                        </HStack>
                        <HStack pl={4} ml={4} pb={1} alignItems="center">
                            <Box mr="12px">
                                <Box
                                    as="span"
                                    width="10px"
                                    height="10px"
                                    bgColor="green.500"
                                    borderRadius="50%"
                                    display="inline-block"
                                ></Box>
                            </Box>
                            <Text fontSize="xs" color={"text.300"} fontWeight="thin" textTransform={"lowercase"}>
                                {activeChain?.name} ({activeChain?.id})
                            </Text>
                        </HStack>
                    </>
                )
            }
            {
                loggedIn && (
                    <>
                        <HStack pl={4} ml={4} alignItems="center">
                            <Box mr="12px">
                                <Box
                                    as="span"
                                    width="10px"
                                    height="10px"
                                    bgColor="green.500"
                                    borderRadius="50%"
                                    display="inline-block"
                                ></Box>
                            </Box>
                            <Text fontSize="xs" color={"text.300"} fontWeight="thin">
                                github {ghUsername ? `(${ghUsername})` : ''}
                            </Text>
                        </HStack>
                    </>
                )
            }
        </Box >
    );
};

interface NavItemProps extends FlexProps {
    href: string;
    icon: any;
    children: ReactText;
}
const NavItem = ({ href, icon, children, ...rest }: NavItemProps) => {
    return (
        <NextLink href={href} passHref>
            <Link style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
                <Flex
                    align="center"
                    p="4"
                    mx="4"
                    borderRadius="lg"
                    role="group"
                    cursor="pointer"
                    _hover={{
                        bg: 'cyan.400',
                        color: 'white',
                    }}
                    {...rest}>
                    {/* {JSON.stringify(rest, null, 2)} */}
                    {icon && (
                        <Box
                            mr={4}
                            fontSize={16}
                            _groupHover={{
                                color: 'white',
                            }}
                        >
                            <FontAwesomeIcon
                                icon={icon}
                            />
                        </Box>
                    )}
                    {children}
                </Flex>
            </Link>
        </NextLink>
    );
};


export default SidebarContent;