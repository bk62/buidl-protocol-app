import * as React from "react"
import { useQuery } from "react-query"
import {
    chakra, Stack,
    Box, Center, Spinner, Text, Flex, Button, ButtonGroup, SimpleGrid, GridItem, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter,
    FormControl, FormLabel, ModalOverlay, ModalCloseButton, useDisclosure, Input, InputGroup, InputRightAddon, FormHelperText, FormErrorMessage, VStack
} from "@chakra-ui/react"
import Davatar from "@davatar/react";
import { utils } from "ethers";
import * as Yup from "yup";
import { Formik, Field } from "formik";
import { toast } from "react-hot-toast";
import { useQueryClient, useMutation } from "react-query";


import useBuidlHub, { useVault } from "../../../hooks/useBuidlHub";
import useWalletConnected from "../../../hooks/auth/useWalletConnected";
import AccountName from "../../auth/AccountName";
import { Upload, Download, ViewIcon } from "../../../icons"

export default function YieldTrust({ erc20Addr, vaultAddr }) {
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

    const { walletConnected, walletAddress } = useWalletConnected();

    const vault = useVault(vaultAddr);
    const { data: balance, isLoading: balanceIsLoading } = useQuery(
        ["vault_balance", vaultAddr, walletAddress], async () => {
            return vault.vaultContract.balanceOf(walletAddress);
        },
        {
            enabled: walletConnected
        }
    )
    const { data: totalBalance, isLoading: totalBalanceIsLoading } = useQuery(
        ["vault_total_assets", vaultAddr], async () => {
            return vault.vaultContract.totalAssets();
        }
    )
    const { data: maxClaimYield, isLoading: maxClaimYieldIsLoading } = useQuery(
        ["vault_max_claim_yield", vaultAddr], async () => {
            return vault.vaultContract.maxClaimYield();
        }
    )

    const queryClient = useQueryClient();


    // 1 Deposit

    const depositMutation = useMutation(async (depositData: { amount: string, erc20Addr: string }) => {
        const { amount, erc20Addr } = depositData;
        if (!!erc20Addr && !!amount) {
            await vault.approveERC20(erc20Addr, amount)
        }
        const tx = await vault.vaultContract.deposit(utils.parseEther(amount), walletAddress);
        await tx.wait(1)
    })

    // modal
    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialRef = React.useRef()

    // formik and validation
    const depositValidation = Yup.object({
        amount: Yup.string()
            .matches(
                /^[0-9]+\.?[0-9]*$/,
                "Invalid characters: Only digits and a single period (.) allowed."
            )
    })



    const handleDeposit = (values, formikHelpers) => {
        const { setSubmitting, resetForm, isSubmitting } = formikHelpers;
        if (isSubmitting) return;
        if (!walletConnected) {
            toast.error("Not authenticated: Wallet not connected");
            setSubmitting("false");
            return;
        }
        const { amount } = values;
        depositMutation.mutateAsync({
            amount,
            erc20Addr
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
            toast.success("Succesfully deposited into yield trust vault!")
            onClose()
        }).catch((e) => {
            toast.error(e.message);
            setSubmitting(false);
            return;
        })
    }

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

    if (query.isLoading) {
        return (
            <Center p={8}>
                <Spinner />
            </Center>
        )
    }


    return (
        <>

            {/* Deposit Modal Form */}
            <Modal
                initialFocusRef={initialRef}
                // finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <Formik
                        initialValues={{ amount: "" }}
                        onSubmit={handleDeposit}
                        validationSchema={depositValidation}
                    >
                        {
                            ({ values, errors, touched, isSubmitting, handleSubmit }) => (
                                <chakra.form
                                    onSubmit={handleSubmit}
                                >

                                    <ModalHeader>Deposit {erc20?.symbol} into Vault</ModalHeader>
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
                                                        ref={initialRef}
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
                                            colorScheme='teal'
                                            mr={3}
                                            type="submit"
                                            isLoading={isSubmitting}
                                            loadingText="Depositing"
                                        >
                                            Deposit
                                        </Button>
                                        <Button onClick={onClose}>Cancel</Button>
                                    </ModalFooter>

                                </chakra.form>
                            )
                        }
                    </Formik>
                </ModalContent>
            </Modal>

            {/* Withdraw modal form -- TODO combine */}
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

            <SimpleGrid columns={[1, 2, 3]} mb={2} spacing={3} justifyContent="center" alignItems={"center"}>
                <GridItem colSpan={1}>
                    <Flex align='center' justify={"center"}>
                        <Box
                            w='50px'
                            h='50px'
                            me='10px'
                        >
                            <Davatar
                                address={vaultAddr}
                                size={42}
                            />
                        </Box>
                        <Flex direction='column'>
                            <Text fontSize='sm' color="text" fontWeight='bold'>
                                <AccountName address={vaultAddr} />
                            </Text>
                            <Text fontSize='xs' color='gray.500' fontWeight='400'>
                                {`${erc20.name} (${erc20.symbol})`} Vault

                            </Text>
                        </Flex>
                    </Flex>
                </GridItem>
                <GridItem colSpan={[1]}>
                    <VStack>
                        <Text fontSize='xs' color="text" fontWeight='thin'>
                            My Balance: {" "} {!!balance ? utils.formatEther(balance) : "0.0"} {" "} {erc20.symbol}
                        </Text>
                        <Text fontSize='xs' color="text" fontWeight='thin'>
                            Total Balance: {" "} {!!totalBalance ? utils.formatEther(totalBalance) : "0.0"} {" "} {erc20.symbol}
                        </Text>
                        <Text fontSize='xs' color="text" fontWeight='thin'>
                            Yield Claimable by Creator: {" "} {!!maxClaimYield ? utils.formatEther(maxClaimYield) : "0.0"} {" "} {erc20.symbol}
                        </Text>
                    </VStack>


                </GridItem>
                <GridItem colSpan={[1, 2, 1]}>
                    <Flex direction="row" justify={"center"} align="center">
                        <ButtonGroup variant="outline" fontSize='sm' size="xs"
                            fontWeight='600'>
                            <Button colorScheme={"white"} leftIcon={<ViewIcon />}>
                                DETAILS
                            </Button>
                            <Button onClick={onOpen} colorScheme={"teal"} leftIcon={<Upload />}>
                                DEPOSIT
                            </Button>
                            <Button onClick={onOpenW} colorScheme={"orange"} leftIcon={<Download />}>
                                WITHDRAW
                            </Button>
                        </ButtonGroup>
                    </Flex>
                </GridItem>

            </SimpleGrid>
        </>
    )
}