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
    InputRightAddon
} from "@chakra-ui/react";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { useQuery } from "react-query";


import useBuidlHub from "../../hooks/useBuidlHub";
import { addERC20ToMetamask } from "../../utils/helpers";


type ERC20FormProps = {
    erc20Addr: string;
    userAddr: string;
    onSubmit: Function;
    onError: Function;
    btnText?: string;
}

export function ERC20Form({ erc20Addr, userAddr, onSubmit, onError, btnText = "Contribute with" }: ERC20FormProps) {
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
        if (!!!userAddr) {
            onError({ message: "Not authenticated: Wallet not connected" });
            setSubmitting("false");
            return;
        }

        const { amount } = values;

        onSubmit({
            amount, erc20Addr, name: !!erc20 ? erc20.name : 'ERC-20',
            handleSuccess: () => { setSubmitting(false); resetForm(); },
            handleError: (e) => { setSubmitting(false) }
        })
    }


    return (
        <Formik
            initialValues={{ amount: "" }}
            onSubmit={handleFormikSubmit}
            validationSchema={yupValidationSchema}
        >
            {
                ({
                    errors, touched, handleSubmit, isSubmitting
                }) => {
                    return (
                        <chakra.form
                            onSubmit={handleSubmit}
                            width="full"
                            my={2}
                        >
                            <Stack
                                bg={"bg.2"}
                                spacing={6}
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
                                        textTransform="capitalize"
                                        htmlFor="amount"
                                    >
                                        {erc20 && erc20.name}
                                        <Button
                                            size="xs"
                                            variant="link"
                                            colorScheme="gray"
                                            marginLeft={4}
                                            fontWeight="thin"
                                            onClick={() => {
                                                addERC20ToMetamask(erc20Addr, !!erc20 ? erc20.symbol : "UNKNOWN", erc20?.decimals)
                                            }}
                                        >
                                            Add to Metamask
                                        </Button>
                                    </FormLabel>
                                    <InputGroup size="sm">
                                        <Field
                                            as={Input}
                                            id={`amount`}
                                            name={`amount`}
                                            type="text"
                                            variant="filled"
                                            placeholder={`amount in ${erc20 && erc20.symbol}`}
                                            focusBorderColor="green.400"
                                            rounded="md"
                                        />
                                        <InputRightAddon children={erc20 && erc20.symbol} />
                                    </InputGroup>
                                    <FormErrorMessage fontSize="sm">
                                        {errors.amount}
                                    </FormErrorMessage>
                                </FormControl>

                                <Button
                                    type="submit"
                                    colorScheme="teal"
                                    _focus={{ shadow: "" }}
                                    fontWeight="md"
                                    px="40px"
                                    size="sm"
                                    variant="outline"
                                    isLoading={isSubmitting}
                                    loadingText="Submitting"
                                    fontSize="xs"
                                >
                                    {btnText} {erc20 && erc20.symbol}
                                </Button>
                            </Stack>
                        </chakra.form>);
                }
            }
        </Formik>
    )
}

