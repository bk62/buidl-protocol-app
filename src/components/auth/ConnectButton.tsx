import * as React from "react";
import { Button, HStack, VStack, Text, Spinner, Center, Box, useColorModeValue } from "@chakra-ui/react";
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi";
import toast from "react-hot-toast";
import Avatar from "@davatar/react";
import { constants } from "ethers";
import ConnectedWallet from "./ConnectedWallet";



/**
 * Due to react hydration issues, tracking connection related state and updating in a useEffect hook
 * https://nextjs.org/docs/messages/react-hydration-error
 */
const ConnectButton = (props) => {
    const connectQuery = useConnect();
    const accountQuery = useAccount();
    const { disconnect } = useDisconnect();
    const [[connecting, connected, connectionError], setConnectionStatus] = React.useState<[boolean, boolean, null | Error]>([false, false, null]);


    React.useEffect(() => {
        if (connectQuery.error?.name === "ConnectorNotFoundError") {
            toast.error("MetaMask extension not found!");
        } else {
            toast.error(connectQuery.error?.message || "Unknown Connector Error: Please check MetaMask is active");
        }
    }, [connectQuery.error]);

    React.useEffect(() => {
        setConnectionStatus([connectQuery.isConnecting, connectQuery.isConnected, connectQuery.error]);
    }, [connectQuery.isConnecting, connectQuery.isConnected, connectQuery.error]);

    return (<Box textAlign="center">
        {
            // Require connected wallet
            !connected && (
                <Button
                    bgColor={useColorModeValue("cyan.400", "cyan.600")}
                    color={useColorModeValue("white", "gray.200")}
                    fontSize={'sm'}
                    fontWeight={500}
                    // color={'white'}
                    // bg={'blue.400'}
                    shadow="sm"
                    _hover={{
                        bg: 'cyan.500',
                    }}
                    {...props}
                    onClick={() => {
                        connectQuery.connect(connectQuery.connectors[0]);
                    }}
                    isLoading={connecting}
                    loadingText="Connecting"
                >
                    Connect wallet
                </Button>
            )
        }
        {
            // error
            connectionError && (
                <Text fontSize="xs" color="red.500">{connectQuery.error?.message}</Text>
            )
        }


        {
            // TODO connect btn and connected wallet should be children of another component
            // connected
            connected && (
                // <HStack>
                //     <Avatar size={20} address={accountQuery.data?.address || constants.AddressZero} />
                //     <VStack>
                //         <AccountName resolveENS={false} address={accountQuery.data?.address || constants.AddressZero} fontSize="sm" />
                //         <Text fontSize="xs" color="gray.200">Connected to {activeChain?.name} </Text>
                //     </VStack>
                //     <Button onClick={() => disconnect()}>
                //         Disconnect
                //     </Button>
                // </HStack>
                <ConnectedWallet address={accountQuery.data?.address || constants.AddressZero} onDisconnectClick={() => disconnect()} />
            )
        }


    </Box>)

}

export default ConnectButton;