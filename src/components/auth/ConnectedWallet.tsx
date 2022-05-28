import { useEffect, useState } from 'react'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    MenuDivider,
    Box,
    chakra,
    Text,
    useColorModeValue
} from "@chakra-ui/react"
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons"
import Davatar from "@davatar/react";
import AccountName from "./AccountName";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faCopy } from "@fortawesome/free-regular-svg-icons"
import toast from "react-hot-toast";
import { useNetwork } from "wagmi";
import ConnectGHButton from "./ConnectGHButton";
import { supabase } from '../../utils/supabaseClient'


const ChakraDavatar = chakra(Davatar)


export default function ConnectedWallet({ address, onDisconnectClick }) {
    const { activeChain } = useNetwork();

    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        setSession(supabase.auth.session())

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

    }, [])

    const user = session === null ? null : session.user;
    const loggedIn = !!user;
    const ghUsername = loggedIn ? user.user_metadata.user_name : "";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(address);
        toast.success("Copied address to clipboard")
    }

    return (
        <Menu>
            {({ isOpen }) => (
                <>
                    <MenuButton
                        variant="outline"
                        isActive={isOpen}
                        as={Button}
                        rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        transition="all 0.2s"
                        px={4}
                        py={2}

                    >
                        <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <ChakraDavatar size={10} address={address} />
                            <AccountName resolveENS={false} address={address} fontSize="sm" fontWeight="thin" ml={2} />
                        </Box>
                    </MenuButton>
                    <MenuList fontSize="sm">
                        <MenuItem minH="48px" onClick={copyToClipboard} cursor="default">
                            <Box mr="22px">
                                <Davatar size={30} address={address} />
                            </Box>
                            <AccountName resolveENS={false} address={address} start={7} fontSize="md" fontWeight="normal" />
                        </MenuItem>
                        <MenuItem minH="48px" cursor="default">
                            <Box mr="22px">
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
                                Connected to {activeChain?.name} ({activeChain?.id})
                            </Text>
                        </MenuItem>
                        <MenuItem icon={<FontAwesomeIcon icon={faCopy} fontSize="md" />} onClick={copyToClipboard}>
                            <Box as="span" ml="32px">Copy Address</Box>
                        </MenuItem>
                        <MenuItem icon={<FontAwesomeIcon icon={faArrowRightFromBracket} fontSize="md" />} onClick={onDisconnectClick}>
                            <Box as="span" ml="32px">Disconnect</Box>
                        </MenuItem>
                        <MenuDivider></MenuDivider>
                        {loggedIn && (
                            <MenuItem minH="48px" cursor="default">
                                <Box mr="22px">
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
                                    Connected to Github {ghUsername ? `as ${ghUsername}` : ''}
                                </Text>
                            </MenuItem>
                        )}
                        <MenuItem>
                            <ConnectGHButton />
                        </MenuItem>
                    </MenuList>
                </>
            )}
        </Menu>

        // <Avatar size={20} address={accountQuery.data?.address || constants.AddressZero} />
        //             <VStack>
        //                 <AccountName resolveENS={false} address={accountQuery.data?.address || constants.AddressZero} fontSize="sm" />
        //                 <Text fontSize="xs" color="gray.200">Connected to {activeChain?.name} </Text>
        //             </VStack>
        //             <Button onClick={() => disconnect()}>
        //                 Disconnect
        //             </Button>
    )
}