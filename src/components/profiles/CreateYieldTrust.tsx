import * as React from "react";
import {
    Box,
    Flex,
    useColorModeValue,
    SimpleGrid,
    GridItem,
    Heading,
    Text,
    HStack,
    Stack,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputLeftAddon,
    FormHelperText,
    Textarea,
    Icon,
    Button,
    VisuallyHidden,
    Select,
    Checkbox,
    RadioGroup,
    Radio,
    Avatar,
    FormErrorMessage,
    AlertDialog,
    AlertDialogBody,
    AlertDialogOverlay,
    useDisclosure,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    Image,
    Divider,
    Link,
    chakra
} from "@chakra-ui/react";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useQueryClient, useQuery, useQueries } from "react-query";


import useCreateYieldTrust from "../../hooks/profiles/useCreateYieldTrust";
import { CaughtError as Err } from "../../lib/types";
import ConnectCTA from "../auth/ConnectCTA";
import useWalletConnected from "../../hooks/auth/useWalletConnected"
import useBuidlHub from "../../hooks/useBuidlHub";
import useWhitelistedERC20s from "../../hooks/utils/useWhitelistedERC20s";


export const ERC20Option = ({ erc20Addr }) => {
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

    return (
        <option value={erc20Addr}>{!!erc20 ? `${erc20.name} (${erc20.symbol})` : erc20Addr}</option>
    )

}

export default function CreateYieldTrust() {
    // connected to metamask
    const { walletConnected, walletAddress } = useWalletConnected();

    // get profiles by connected wallet
    // so user can choose
    const hub = useBuidlHub();
    const profilesQuery = useQuery(
        // filter by account
        ["profiles", { filter: true, to: walletAddress ?? null }], () => hub.getProfiles({ to: walletAddress }),
        {
            // don't query until wallet connected
            enabled: walletConnected
        }
    )

    // list of accepted erc20s
    const { data: erc20sData, isLoading: erc20sLoading } = useWhitelistedERC20s();

    // react query mut
    const mutation = useCreateYieldTrust();
    const queryClient = useQueryClient();

    // next router
    const router = useRouter();

    // alert
    const { isOpen, onOpen, onClose } = useDisclosure();
    const okRef = React.useRef<HTMLButtonElement>()
    const [error, setError] = React.useState<Err>({});

    const yupValidationSchema = Yup.object({
        profileId: Yup.string()
            .matches(
                /^[0-9]+$/,
                "Invalid profile Id."
            )
            // .oneOf(Object.keys(ProfileTypeMapping))
            .required("Required"),
        currency: Yup.string()
            .matches(
                /^[0-9a-zA-Z]+$/,
                "Invalid ERC-20."
            )
            // .oneOf(Object.keys(ProfileTypeMapping))
            .required("Required")
    })

    const handleFormikSubmit = async (values, formikHelpers) => {
        const { setSubmitting, resetForm, isSubmitting } = formikHelpers;

        if (isSubmitting) return;
        // const addr = walletAddress;
        if (!walletConnected) {
            displayErrorAlert({ message: "Not authenticated: Wallet not connected" });
            setSubmitting("false");
            return;
        }

        const { profileId, currency } = values;

        mutation.mutateAsync({
            profileId, currency
        }).then(() => {
            setSubmitting(false);
            resetForm();
            // invalidate queries
            queryClient.invalidateQueries(["yield_trusts", { profileId }])
            router.push(`/dashboard`)
            toast.success("Successfully created yield trust!")
        }).catch((e) => {
            displayErrorAlert(e);
            setSubmitting(false);
            return;
        })
    }

    const displayErrorAlert = (e) => {
        console.log(e);
        setError(e);
        onOpen();
    }


    if (!walletConnected) {
        // not connected to  metamask
        return (
            <ConnectCTA
                ghConnected={true}
                walletConnected={walletConnected}
                redirectTo={'/profiles/trusts/create'}
            />
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

            <Formik
                initialValues={
                    {
                        profileId: "",
                        currency: ""
                    }
                }
                onSubmit={handleFormikSubmit}
                validationSchema={yupValidationSchema}
            >
                {
                    ({
                        values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue, setFieldTouched
                    }) => {
                        return (<chakra.form
                            onSubmit={handleSubmit}
                            shadow="base"
                            rounded={[null, "md"]}
                            overflow={{ sm: "hidden" }}
                        >
                            <Stack
                                px={4}
                                py={5}
                                bg={'bg.2'}
                                spacing={6}
                                p={{ sm: 6 }}
                            >
                                <SimpleGrid columns={3} spacing={6}>
                                    <FormControl
                                        isInvalid={!!errors.profileId && !!touched.profileId}
                                        as={GridItem}
                                        colSpan={[3, 3]}
                                    >
                                        <FormLabel
                                            fontSize="sm"
                                            fontWeight="md"
                                            color={"text.100"}
                                            htmlFor="profileId"
                                        >
                                            Profile
                                        </FormLabel>
                                        <InputGroup size="sm">
                                            <Field
                                                as={Select}
                                                id="profileId"
                                                name="profileId"
                                                type="select"
                                                variant="filled"
                                                placeholder="Select profile to create trust for"
                                                focusBorderColor="green.400"
                                                rounded="md"
                                            >
                                                {profilesQuery.isSuccess && profilesQuery.data.map((profile) => (
                                                    <option value={profile.profileId.toString()}>{profile.handle}</option>
                                                ))}
                                            </Field>
                                        </InputGroup>
                                        <FormErrorMessage fontSize="sm">
                                            {errors.profileId}
                                        </FormErrorMessage>
                                        <FormHelperText>
                                            Choose the profile you want to create a yield trust for
                                        </FormHelperText>
                                    </FormControl>

                                    <FormControl
                                        isInvalid={!!errors.currency && !!touched.currency}
                                        as={GridItem}
                                        colSpan={[3, 3]}
                                    >
                                        <FormLabel
                                            fontSize="sm"
                                            fontWeight="md"
                                            color={"text.100"}
                                            htmlFor="currency"
                                        >
                                            ERC-20 Token
                                        </FormLabel>
                                        <InputGroup size="sm">
                                            <Field
                                                as={Select}
                                                id="currency"
                                                name="currency"
                                                type="select"
                                                variant="filled"
                                                placeholder="Select ERC-20 token to use as underlying asset"
                                                focusBorderColor="green.400"
                                                rounded="md"
                                            >
                                                {erc20sData && erc20sData.map((erc20) => (
                                                    <ERC20Option erc20Addr={erc20.erc20} />
                                                )
                                                )}
                                            </Field>
                                        </InputGroup>
                                        <FormErrorMessage fontSize="sm">
                                            {errors.currency}
                                        </FormErrorMessage>
                                        <FormHelperText>
                                            Choose the ERC-20 token that you want to use as the underlying asset for this Yield Trust.
                                        </FormHelperText>
                                    </FormControl>
                                </SimpleGrid>
                            </Stack>


                            <Box
                                px={{ base: 4, sm: 6 }}
                                py={3}
                                bg={"bg.submit"}
                            >
                                <Button
                                    type="submit"
                                    colorScheme="green"
                                    _focus={{ shadow: "" }}
                                    fontWeight="md"
                                    px="40px"
                                    isLoading={mutation.isLoading}
                                    loadingText={"Creating Yield Trust"}
                                >
                                    Create Yield Trust
                                </Button>
                            </Box>
                        </chakra.form>);
                    }
                }
            </Formik>

        </>
    );
}
