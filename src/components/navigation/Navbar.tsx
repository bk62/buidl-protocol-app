import NextLink from "next/link"
import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    Icon,
    Link,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useColorModeValue,
    useBreakpointValue,
    useDisclosure,
} from '@chakra-ui/react';
import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon,
    ChevronRightIcon,
} from '@chakra-ui/icons';
import {
    FiBell
} from 'react-icons/fi';
import { useAccount } from "wagmi";


import { DarkModeSwitch } from './DarkModeSwitch'
import Logo from "../Logo";

import ConnectButton from "../auth/ConnectButton";


export default function Navbar() {
    const { isOpen, onToggle } = useDisclosure();

    // wagmi - use to show nav for connected users
    const accountQuery = useAccount();

    const accountConnected = !!accountQuery.data && !!accountQuery.data?.address;

    return (
        <Box as="header">
            <Flex
                as="nav"
                zIndex="banner"
                transition="3s ease"
                bg={useColorModeValue('white', 'darkbg.800')}
                color={useColorModeValue('gray.600', 'gray.100')}
                minH={'60px'}
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                align={'center'}
                justify={'center'}

            >
                <Flex
                    flex={{ base: 1, md: 'auto' }}
                    ml={{ base: -2 }}
                    display={{ base: 'flex', md: 'none' }}>
                    <IconButton
                        onClick={onToggle}
                        icon={
                            isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
                        }
                        variant={'ghost'}
                        aria-label={'Toggle Navigation'}
                    />
                </Flex>
                <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
                    {/* <Text
                        textAlign={useBreakpointValue({ base: 'left', md: 'left' })}
                        fontFamily={'heading'}
                        color={useColorModeValue('gray.800', 'white')}>
                        Buidl Protocol
                    </Text> */}
                    <NextLink href="/" passHref>
                        <Link textDecoration="none">
                            <Logo textProps={{ fontSize: { md: "2xl" } }} />
                        </Link>
                    </NextLink>
                    <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                        <DesktopNav loggedIn={accountConnected} />
                    </Flex>
                </Flex>

                <Stack
                    flex={{ base: 1, md: 0 }}
                    justify={'flex-end'}
                    align="center"
                    direction={'row'}
                    spacing={6}>
                    <DarkModeSwitch display={{ base: 'none', md: 'flex' }} />
                    <ConnectButton
                        display={{ md: 'inline-flex' }}
                    />
                </Stack>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <MobileNav />
            </Collapse>
        </Box>
    );
}

const DesktopNav = ({ loggedIn }) => {
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');
    const popoverContentBgColor = useColorModeValue('white', 'gray.800');

    return (
        <Stack direction={'row'} align="center" justify="center" spacing={4}>
            {loggedIn &&
                (<NextLink href={"/dashboard"} passHref>
                    <Link
                        p={2}
                        fontSize={'sm'}
                        fontWeight={500}
                        color={linkColor}
                        _hover={{
                            textDecoration: 'none',
                            color: linkHoverColor,
                        }}>
                        Dashboard
                    </Link>
                </NextLink>)
            }
            {NAV_ITEMS.map((navItem) => (
                <Box key={navItem.label}>
                    <Popover trigger={'hover'} placement={'bottom-start'}>
                        <PopoverTrigger>
                            <Box>
                                <NextLink href={navItem.href}>
                                    <Link
                                        p={2}
                                        // href={navItem.href ?? '#'}
                                        fontSize={'sm'}
                                        fontWeight={500}
                                        color={linkColor}
                                        _hover={{
                                            textDecoration: 'none',
                                            color: linkHoverColor,
                                        }}>
                                        {navItem.label}
                                    </Link>
                                </NextLink>
                            </Box>
                        </PopoverTrigger>

                        {navItem.children && (
                            <PopoverContent
                                border={0}
                                boxShadow={'xl'}
                                bg={popoverContentBgColor}
                                p={4}
                                rounded={'xl'}
                                minW={'sm'}>
                                <Stack>
                                    {navItem.children.map((child) => (
                                        <DesktopSubNav key={child.label} {...child} />
                                    ))}
                                </Stack>
                            </PopoverContent>
                        )}
                    </Popover>
                </Box>
            ))}
        </Stack>
    );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
    return (
        <Link
            href={href}
            role={'group'}
            display={'block'}
            p={2}
            rounded={'md'}
            _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
            <Stack direction={'row'} align={'center'}>
                <Box>
                    <Text
                        transition={'all .3s ease'}
                        _groupHover={{ color: 'pink.400' }}
                        fontWeight={500}>
                        {label}
                    </Text>
                    <Text fontSize={'sm'}>{subLabel}</Text>
                </Box>
                <Flex
                    transition={'all .3s ease'}
                    transform={'translateX(-10px)'}
                    opacity={0}
                    _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
                    justify={'flex-end'}
                    align={'center'}
                    flex={1}>
                    <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
                </Flex>
            </Stack>
        </Link>
    );
};

const MobileNav = () => {
    return (
        <Stack
            as="nav"
            bg={useColorModeValue('bg.light.50', 'gray.800')}
            p={4}
            display={{ md: 'none' }}>
            <DarkModeSwitch display={{ base: 'flex', md: 'none' }} />
            <MobileNavItem key="dashboard" href="/dashboard" label="Dashboard" />
            {NAV_ITEMS.map((navItem) => (
                <MobileNavItem key={navItem.label} {...navItem} />
            ))}
        </Stack>
    );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <Stack spacing={4} onClick={children && onToggle}>
            <Flex
                py={2}
                as={Link}
                href={href ?? '#'}
                justify={'space-between'}
                align={'center'}
                _hover={{
                    textDecoration: 'none',
                }}>
                <Text
                    fontWeight={600}
                    color={useColorModeValue('gray.600', 'gray.200')}>
                    {label}
                </Text>
                {children && (
                    <Icon
                        as={ChevronDownIcon}
                        transition={'all .25s ease-in-out'}
                        transform={isOpen ? 'rotate(180deg)' : ''}
                        w={6}
                        h={6}
                    />
                )}
            </Flex>

            <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
                <Stack
                    mt={2}
                    pl={4}
                    borderLeft={1}
                    borderStyle={'solid'}
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    align={'start'}>
                    {children &&
                        children.map((child) => (
                            <NextLink href={child.href} key={child.label} passHref>
                                <Link py={2}>
                                    {child.label}
                                </Link>
                            </NextLink>
                        ))}
                </Stack>
            </Collapse>
        </Stack>
    );
};

interface NavItem {
    label: string;
    subLabel?: string;
    children?: Array<NavItem>;
    href: string;
}

const NAV_ITEMS: Array<NavItem> = [
    {
        label: 'Profiles',
        href: "/profiles/"
    },
    {
        label: 'Projects',
        href: "/projects/"
    }
];
