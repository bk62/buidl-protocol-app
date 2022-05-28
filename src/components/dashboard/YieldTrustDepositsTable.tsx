import React, { useMemo } from "react";
import {
    Flex,
    Progress,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    Center,
    Spinner,
    HStack,
    Link,
    Button,
    useDisclosure,
    Modal, ModalBody, ModalContent, ModalHeader, ModalFooter,
    FormControl, FormLabel, ModalOverlay, ModalCloseButton,
    Input, InputGroup, InputRightAddon, FormHelperText, FormErrorMessage,
    Stack, chakra
} from "@chakra-ui/react";
import truncateMiddle from "truncate-middle";
import moment from "moment";
import Davatar from "@davatar/react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { Formik, Field } from "formik";

import useBuidlHub, { useVault } from "../../hooks/useBuidlHub";
import GalleryActionButton from "../common/GalleryActionButton";
import { ViewIcon, Copy, Download } from "../../icons";
import useWalletConnected from "../../hooks/auth/useWalletConnected";
import AccountName from "../auth/AccountName";
import { utils } from "ethers";


const columns = [
    {
        Header: "Profile",
        accessor: "profileId"
    },
    {
        Header: "ERC-20",
        accessor: "erc20"
    },
    {
        Header: "ERC-4626 Vault",
        accessor: "vault"
    },
    {
        Header: "Actions",
        accessor: ""
    }
];

type Props = {
    filters?: any;
    empty?: React.ReactElement;
}

export const YieldTrustRow = ({ yTrust }) => {
    const { profileId, erc20: erc20Addr, vault: vaultAddr, timestamp } = yTrust;
    const { walletConnected, walletAddress } = useWalletConnected();
    const queryClient = useQueryClient();
    const timeColor = useColorModeValue("gray.500", "gray.300");


    // erc 20 metadata
    const hub = useBuidlHub()

    const query = useQuery(
        ["erc20_metadata", erc20Addr], async () => {
            return hub.getERC20Metadata(erc20Addr);
        },
        {
            staleTime: 10e100 // never expires
        }
    )

    const erc20 = query.data;


    // vault metadata
    const vault = useVault(vaultAddr);
    const { data: balance, isLoading: balanceIsLoading } = useQuery(
        ["vault_balance", vaultAddr, walletAddress], async () => {
            return vault.vaultContract.balanceOf(walletAddress);
        },
        {
            enabled: walletConnected
        }
    )


    // 2 Withdraw
    const withdrawMutation = useMutation(async (data: { amount: string }) => {
        const { amount } = data;
        // assets, receiver, owner
        const tx = await vault.vaultContract.withdraw(utils.parseEther(amount), walletAddress, walletAddress);
        await tx.wait(1);
    })

    // modal
    const { isOpen: isOpenW, onOpen: onOpenW, onClose: onCloseW } = useDisclosure()

    const initialRefW = React.useRef()

    // formik and validation
    const withdrawValidation = Yup.object({
        amount: Yup.string()
            .matches(
                /^[0-9]+\.?[0-9]*$/,
                "Invalid characters: Only digits and a single period (.) allowed."
            )
            .test(
                "test-lt-balance",
                "Invalid amount: Has to be <= balance",
                (value) => utils.parseEther(value ?? "0").lte(balance ?? "0")
            )

    })

    const handleWithdraw = (values, formikHelpers) => {
        const { setSubmitting, resetForm, isSubmitting } = formikHelpers;
        if (isSubmitting) return;
        if (!walletConnected) {
            toast.error("Not authenticated: Wallet not connected");
            setSubmitting("false");
            return;
        }
        const { amount } = values;
        withdrawMutation.mutateAsync({
            amount
        }).then(() => {
            setSubmitting(false);
            resetForm();
            // invalidate queries
            queryClient.invalidateQueries({
                predicate: query => {
                    let qkey = query.queryKey
                    let key0: string = qkey.length > 0 ? qkey[0] as string : ""
                    return key0.startsWith('vault')
                }
            })
            toast.success("Succesfully withdrew from yield trust vault!")
            onCloseW()
        }).catch((e) => {
            toast.error(e.message);
            setSubmitting(false);
            return;
        })
    }



    if (query.isLoading || balanceIsLoading) {
        return (
            <Center p={8}>
                <Spinner />
            </Center>
        );
    }

    if (!balanceIsLoading && !!balance && balance.eq(0)) {
        // balance is 0,
        // TODO
        // b/c of the way im using Deposited events
        // dont' display anything
        return <Tr></Tr>
    }


    return (
        <>
            <Modal
                initialFocusRef={initialRefW}
                // finalFocusRef={finalRef}
                isOpen={isOpenW}
                onClose={onCloseW}
            >
                <ModalOverlay />
                <ModalContent>
                    <Formik
                        initialValues={{ amount: "" }}
                        onSubmit={handleWithdraw}
                        validationSchema={withdrawValidation}
                    >
                        {
                            ({ values, errors, touched, isSubmitting, handleSubmit, setFieldValue, setFieldTouched }) => (
                                <chakra.form
                                    onSubmit={handleSubmit}
                                >

                                    <ModalHeader>Withdraw {erc20?.symbol} from Vault</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody pb={6}>

                                        <Stack
                                            bg={"bg.2"}
                                            alignItems="flex-end"
                                            flexDirection={{ base: "column", sm: "row" }}
                                        >
                                            <FormControl
                                                isInvalid={!!errors.amount && !!touched.amount}
                                            >
                                                <Button
                                                    variant="link"
                                                    letterSpacing={"wide"}
                                                    fontSize="xs"
                                                    onClick={(e) => {
                                                        setFieldValue("amount", utils.formatEther(balance ?? "0"), true);
                                                        setFieldTouched("amount", true, true);
                                                    }}
                                                >
                                                    MAX
                                                </Button>
                                                <InputGroup size="sm">
                                                    <Field
                                                        as={Input}
                                                        id="amount"
                                                        name="amount"
                                                        type="text"
                                                        variant="filled"
                                                        placeholder="amount"
                                                        focusBorderColor="green.400"
                                                        rounded="md"
                                                        ref={initialRefW}
                                                    />
                                                    <InputRightAddon children={erc20?.symbol} />
                                                </InputGroup>
                                                <FormErrorMessage fontSize="sm">
                                                    {errors.amount}
                                                </FormErrorMessage>
                                            </FormControl>
                                        </Stack>
                                    </ModalBody>

                                    <ModalFooter>
                                        <Button
                                            colorScheme='orange'
                                            mr={3}
                                            type="submit"
                                            isLoading={isSubmitting}
                                            loadingText="Withdrawing"
                                        >
                                            Withdraw
                                        </Button>
                                        <Button onClick={onCloseW}>Cancel</Button>
                                    </ModalFooter>

                                </chakra.form>
                            )
                        }
                    </Formik>
                </ModalContent>
            </Modal>

            <Tr>
                <Td>
                    {profileId}
                </Td>
                <Td>
                    <Flex direction='column'>
                        <Text fontSize='sm' color="text" fontWeight='normal'>
                            <AccountName address={erc20Addr} />
                            <Button size="sm" variant="link" ml={1} onClick={() => { navigator.clipboard.writeText(erc20Addr); }} leftIcon={<Copy />} colorScheme="gray"> </Button>
                        </Text>
                        <Text fontSize='xs' color='gray.500' fontWeight='400'>
                            {`${erc20.name} (${erc20.symbol})`}

                        </Text>
                    </Flex>
                </Td>
                <Td>
                    <Flex direction='column'>
                        <Text fontSize='sm' color="text" fontWeight='normal'>
                            <AccountName address={vaultAddr} />
                            <Button size="sm" variant="link" ml={1} onClick={() => { navigator.clipboard.writeText(vaultAddr); }} leftIcon={<Copy />} colorScheme="gray"> </Button>
                        </Text>
                        <Text fontSize='xs' color='gray.500' fontWeight='400'>
                            My Balance: {`${utils.formatEther(balance)} (${erc20.symbol})`}
                        </Text>
                    </Flex>
                </Td>
                <Td>
                    <Flex direction="column" flexWrap="wrap" gap={2} align="center" justify="center">
                        <GalleryActionButton href={`/profiles/${profileId}?isId=true`} icon={<ViewIcon />} colorScheme="blue">View Profile</GalleryActionButton>
                        <Button size="xs" variant="link" colorScheme="orange" leftIcon={<Download />}
                            onClick={onOpenW}
                        >
                            Withdraw</Button>
                    </Flex>
                </Td>
            </Tr>
        </>
    )
}

export default function ProfilesTable(props: Props) {
    const { filters, empty } = props;

    const hub = useBuidlHub();

    const query = useQuery(
        ["yield_trusts", filters], () => hub.getYieldTrusts(filters)
    )


    let { data: trusts } = query;

    if (query.isLoading) {
        return (
            <Center p={8}>
                <Spinner />
            </Center>
        );
    }

    if (query.isSuccess && query.data.length === 0) {
        if (!!empty) {
            return (
                <>
                    {empty}
                </>
            )
        }
        return (

            <Center p={8}>
                <Text color="text" fontSize="lg" fontWeight="thin">
                    Nothing to see here.
                </Text>
            </Center>

        )
    }

    return (
        <Table fontSize="sm">
            <Thead>
                <Tr>
                    {columns.map((column, ix) => (
                        <Th key={ix}>{column.Header}</Th>
                    ))}
                </Tr>
            </Thead>
            <Tbody>
                {/* {JSON.stringify(trusts, null, 2)} */}
                {trusts.map((trust, ix) => (
                    <YieldTrustRow key={ix} yTrust={trust} />
                ))}
            </Tbody>
        </Table>
    )
}