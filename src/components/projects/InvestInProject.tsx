import * as React from "react";
import {
    chakra,
    Box,
    Stack,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    Button,
    FormErrorMessage,
    AlertDialog,
    AlertDialogBody,
    AlertDialogOverlay,
    useDisclosure,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    InputRightAddon,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import useInvestInProject from "../../hooks/projects/useInvestInProject";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useQueryClient } from "react-query";


import { CaughtError as Err } from "../../lib/types";
import ConnectWalletCTA from "../common/ConnectWalletCTA";
import useWhitelistedERC20s from "../../hooks/utils/useWhitelistedERC20s";
import { ERC20Form } from "../form/ContributeForm";




export default function InvestInProject({ handle }) {
    // react query mut
    const mutation = useInvestInProject();
    const queryClient = useQueryClient();

    // wagmi
    const { data, isError, isLoading, isSuccess } = useAccount();

    // next router
    const router = useRouter();

    // alert
    const { isOpen, onOpen, onClose } = useDisclosure();
    const okRef = React.useRef<HTMLButtonElement>()
    const [error, setError] = React.useState<Err>({});

    // list of accepted erc20s
    const { data: erc20sData, isLoading: erc20sLoading } = useWhitelistedERC20s();

    const validationObj = {
        amount: Yup.string()
            .matches(
                /^[0-9]+\.?[0-9]*$/,
                "Invalid characters: Only digits and a single period (.) allowed."
            )
    }
    const yupValidationSchema = Yup.object(validationObj)

    const handleFormikSubmit = (values, formikHelpers) => {
        const { setSubmitting, resetForm, isSubmitting } = formikHelpers;
        if (isSubmitting) return;
        if (!!!data?.address) {
            displayErrorAlert({ message: "Not authenticated: Wallet not connected" });
            setSubmitting("false");
            return;
        }
        const { amount } = values;
        // transfer MATIC
        mutation.mutateAsync({
            handle,
            // moduleData, // TODO
            value: amount,
            // erc20s: [],
            // amounts: [],
        }).then(() => {
            setSubmitting(false);
            resetForm();
            // invalidate queries
            queryClient.invalidateQueries(["investors", handle])
            router.push(`/projects/${handle}`)
            toast.success("Succesfully invested in project with MATIC!")
        }).catch((e) => {
            displayErrorAlert(e);
            setSubmitting(false);
            return;
        })
    }

    const handleERC20FormikSubmit = (values) => {
        const { amount, erc20Addr, handleError, handleSuccess, name } = values;
        // transfer ERC20
        mutation.mutateAsync({
            handle,
            // moduleData, // TODO
            value: '0',
            erc20s: [erc20Addr],
            amounts: [amount],
        }).then(() => {
            handleSuccess();
            // invalidate queries
            queryClient.invalidateQueries({
                predicate: query => {
                    let qkey = query.queryKey
                    let key0: string = qkey.length > 0 ? qkey[0] as string : ""
                    return key0.startsWith('investors')
                }
            })
            router.push(`/projects/${handle}`)
            toast.success(`Succesfully invested in project with ${name}!`)
        }).catch((e) => {
            displayErrorAlert(e);
            handleError(e);
        })
    }

    const displayErrorAlert = (e) => {
        console.log(e);
        setError(e);
        onOpen();
    }

    if (!!!data || !!!data?.address) {
        // not connected
        return (
            <ConnectWalletCTA />
        )
    }

    return (
        <>

            {error && (
                <AlertDialog
                    isOpen={isOpen}
                    onClose={onClose}
                    leastDestructiveRef={okRef}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="error">
                                Error: Failed to submit data
                            </AlertDialogHeader>
                            <AlertDialogBody>
                                {`${error.code ?? ""} ${error.message ?? "Error: Failed to submit data"} ${error.data?.message ?? ""}`}
                            </AlertDialogBody>
                            <AlertDialogFooter>
                                <Button colorScheme="gray" variant="outline" onClick={onClose} ref={okRef}>
                                    OK
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            )}

            <Box
                shadow="base"
                rounded={[null, "md"]}
                px={8}
                py={8}
                bg={"bg.2"}
                justifyContent="space-evenly"
            >
                <Formik
                    initialValues={{ amount: "" }}
                    onSubmit={handleFormikSubmit}
                    validationSchema={yupValidationSchema}
                >
                    {
                        ({
                            values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting
                        }) => {
                            return (
                                <>
                                    <chakra.form
                                        onSubmit={handleSubmit}
                                        width="full"
                                        py={2}

                                    >
                                        <Stack
                                            bg={"bg.2"}
                                            alignItems="flex-end"
                                            flexDirection={{ base: "column", sm: "row" }}
                                        >
                                            <FormControl
                                                isInvalid={!!errors.amount && !!touched.amount}
                                                pr={{ base: 0, sm: 4 }}
                                            >
                                                <FormLabel
                                                    fontSize="sm"
                                                    fontWeight="md"
                                                    color={"text.100"}
                                                    htmlFor="amount"
                                                >
                                                    Native Currency (MATIC)
                                                </FormLabel>
                                                <InputGroup size="sm">
                                                    <Field
                                                        as={Input}
                                                        id="amount"
                                                        name="amount"
                                                        type="text"
                                                        variant="filled"
                                                        placeholder="amount in MATIC"
                                                        focusBorderColor="green.400"
                                                        rounded="md"
                                                    />
                                                    <InputRightAddon children="MATIC" />
                                                </InputGroup>
                                                <FormErrorMessage fontSize="sm">
                                                    {errors.amount}
                                                </FormErrorMessage>
                                            </FormControl>

                                            <Button
                                                type="submit"
                                                // onClick={onOpen}
                                                colorScheme="teal"
                                                _focus={{ shadow: "" }}
                                                fontWeight="md"
                                                px="40px"
                                                size="sm"
                                                variant="outline"
                                                isLoading={isSubmitting}
                                                loadingText="Investing"
                                                fontSize="xs"
                                            >
                                                Invest with MATIC
                                            </Button>

                                        </Stack>

                                    </chakra.form>

                                </>

                            );
                        }
                    }
                </Formik>

                {/* {!erc20sLoading && JSON.stringify(erc20sData, null, 4)} */}

                {
                    erc20sData && erc20sData.map((erc20) => (
                        <ERC20Form
                            erc20Addr={erc20.erc20}
                            userAddr={data?.address}
                            onError={displayErrorAlert}
                            onSubmit={handleERC20FormikSubmit}
                            btnText="Invest with"
                        />
                    )
                    )
                }
            </Box>

        </>
    );
}


