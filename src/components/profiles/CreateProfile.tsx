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
    chakra,
} from "@chakra-ui/react";
import axios from "axios";
import { useAccount } from "wagmi";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useQueryClient } from "react-query";


import useCreateProfile from "../../hooks/profiles/useCreateProfile";
import { CaughtError as Err } from "../../lib/types";
import { ProfileTypeMapping } from "../../hooks/useBuidlHub/types"
import ConnectCTA from "../auth/ConnectCTA";
import FileUpload from "../form/FileUpload";
import Tags from "../../utils/tags";
import TagSelectField from "../form/TagSelect";
import useWalletConnected from "../../hooks/auth/useWalletConnected"
import useGHConnected from "../../hooks/auth/useGHConnected"



export default function EditProfile() {
    // connected to gh
    const { loggedIn, ghUsername } = useGHConnected();
    // connected to metamask
    const { walletConnected, walletAddress } = useWalletConnected();

    // react query mut
    const mutation = useCreateProfile();
    const queryClient = useQueryClient();

    // next router
    const router = useRouter();

    // alert
    const { isOpen, onOpen, onClose } = useDisclosure();
    const okRef = React.useRef<HTMLButtonElement>()
    const [error, setError] = React.useState<Err>({});

    // track file upload and uploaded uri
    // empty until FileUpload widget uploads image to supabase
    const [uploadingImage, setUploadingImage] = React.useState(false);
    // local file for display, filename on server
    const [imageUrl, setImageUrl] = React.useState("");
    const [imageFile, setImageFile] = React.useState(null);

    // track IPFS metadata creation request
    const [creatingMetadata, setCreatingMetadata] = React.useState(false);
    const [metadataIpfsUrl, setMetadataIpfsUrl] = React.useState("");


    // file upload handlers
    const handleUploadStart = () => {
        setUploadingImage(true);
    }
    const handleUploadSuccess = (file, url) => {
        setImageFile(file);
        setImageUrl(url);
        setUploadingImage(false);
        toast.success("Successfully uploaded image to Supabase!")
    }
    const handleUploadError = (e) => {
        displayErrorAlert({ message: `Image upload error: ${e.message}` });
    }



    const yupValidationSchema = Yup.object({
        profileType: Yup.string()
            .matches(
                /^[0-9]+$/,
                "Invalid profile type."
            )
            .oneOf(Object.keys(ProfileTypeMapping))
            .required("Required"),
        handle: Yup.string()
            .max(31, "Too long: Only 31 or less characters allowed.")
            .matches(
                /^[a-z0-9_\-.]+$/,
                "Invalid characters: Only small case letters, digits, underscore (_), hyphen (-) and periods (.) allowed."
            )
            .required("Required"),
        name: Yup.string()
            // .url()
            .required("Required"),
        description: Yup.string()
            .required("Required"),
        tags: Yup.array()
            .of(
                Yup.object().shape({
                    label: Yup.string(),
                    value: Yup.string()
                })
            )
            .min(1, "At least one tag is required")
            .required("Required"),
        erc20_name: Yup.string(),
        erc20_symbol: Yup.string()
            .max(12, "Too long: Only 12 or less characters allowed."),
        erc20_price: Yup.string()
            .matches(
                /^[0-9]+\.?[0-9]*$/,
                "Invalid amount."
            )
    })

    const handleFormikSubmit = async (values, formikHelpers) => {
        // alert(JSON.stringify(values, null, 2));
        // return;
        const { setSubmitting, resetForm, isSubmitting } = formikHelpers;

        if (isSubmitting) return;
        // const addr = walletAddress;
        if (!walletConnected) {
            displayErrorAlert({ message: "Not authenticated: Wallet not connected" });
            setSubmitting("false");
            return;
        }

        const { profileType, handle, name, description, tags, enable_module, erc20_name, erc20_symbol, erc20_price } = values;
        const image = imageUrl;
        let metadataURI;

        // 1. API call to create IPFS metadata URI -- if necessary
        if (!!!metadataIpfsUrl) {
            try {
                setCreatingMetadata(true);
                const res = await axios
                    .post('/api/storeNFTStorage', { image, ...values, githubUsername: ghUsername });
                const { data: { error }, data, status } = res;
                if (error) throw error;
                const { ipnft, url } = data;
                setMetadataIpfsUrl(url);
                metadataURI = url;
                toast.success("Successfully stored metadata on IPFS!")
                setCreatingMetadata(false);
            } catch (e) {
                displayErrorAlert(e);
                setCreatingMetadata(false);
                return;
            }
        } else {
            metadataURI = metadataIpfsUrl;
        }


        // 2. React query mutate -> wagmi ethers contract call to create profile
        // TODO check metadataURI against ipfs url regex

        // debug - sleep for 5 s to simulate a delay
        // await new Promise(r => setTimeout(r, 5000));

        const backModuleInitData = !!enable_module
            ? { name: erc20_name, symbol: erc20_symbol, tokenPrice: erc20_price }
            : null;
        const mutData = {
            to: walletAddress ?? "",
            handle,
            metadataURI,
            profileType,
            githubUsername: ghUsername,
            backModuleInitData
        }
        mutation.mutateAsync(mutData).then(() => {
            setSubmitting(false);
            resetForm();
            // invalidate queries
            queryClient.invalidateQueries(["profiles"])
            router.push(`/profiles/${handle}`)
            toast.success("Successfully created profile!")
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


    if (!loggedIn || !walletConnected) {
        // not connected to gh or metamask
        return (
            <ConnectCTA
                ghConnected={loggedIn}
                walletConnected={walletConnected}
                redirectTo={'/profiles/create'}
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
                        profileType: "0",
                        handle: "",
                        name: "",
                        description: "",
                        tags: [],
                        enable_module: true,
                        erc20_name: "",
                        erc20_symbol: "",
                        erc20_price: "0.01"
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
                                        isInvalid={!!errors.profileType && !!touched.profileType}
                                        as={GridItem}
                                        colSpan={[3, 3]}
                                    >
                                        <FormLabel
                                            fontSize="sm"
                                            fontWeight="md"
                                            color={"text.100"}
                                            htmlFor="profileType"
                                        >
                                            Profile Type
                                        </FormLabel>
                                        <InputGroup size="sm">
                                            <Field
                                                as={Select}
                                                id="profileType"
                                                name="profileType"
                                                type="select"
                                                variant="filled"
                                                placeholder="Select profile type"
                                                focusBorderColor="green.400"
                                                rounded="md"
                                            >
                                                {(Object.keys(ProfileTypeMapping)).map((key) => (
                                                    <option value={key} key={key}>{ProfileTypeMapping[key]}</option>
                                                ))}
                                            </Field>
                                        </InputGroup>
                                        <FormErrorMessage fontSize="sm">
                                            {errors.profileType}
                                        </FormErrorMessage>
                                        <FormHelperText>
                                            Choose your profile type.
                                        </FormHelperText>
                                    </FormControl>
                                </SimpleGrid>

                                <SimpleGrid columns={3} spacing={6}>
                                    <FormControl
                                        isInvalid={!!errors.handle && !!touched.handle}
                                        as={GridItem}
                                        colSpan={[3, 3]}
                                    >
                                        <FormLabel
                                            fontSize="sm"
                                            fontWeight="md"
                                            color={"text.100"}
                                            htmlFor="handle"
                                        >
                                            Handle
                                        </FormLabel>
                                        <InputGroup size="sm">
                                            <Field
                                                as={Input}
                                                id="handle"
                                                name="handle"
                                                type="text"
                                                variant="filled"
                                                placeholder="patrick"
                                                focusBorderColor="green.400"
                                                rounded="md"
                                            />
                                        </InputGroup>
                                        <FormErrorMessage fontSize="sm">
                                            {errors.handle}
                                        </FormErrorMessage>
                                        <FormHelperText>
                                            Choose your profile handle.
                                            <br />
                                            {values.handle &&
                                                `Your profile url will be "${window.location.host}/profiles/${values.handle}"`
                                            }
                                        </FormHelperText>
                                    </FormControl>
                                </SimpleGrid>

                                <Divider />

                                <Heading fontSize="lg" fontWeight="md" lineHeight="6" color={"text.50"}>Profile NFT Metadata</Heading>
                                <Text
                                    mt={0}
                                    fontSize="sm"
                                    color={"text.50"}
                                >
                                    The following fields will be comprise your profile NFT metadata and will be linked from the NFTs people who back your profile or invest
                                    in your projects will get!
                                    <br />
                                    The metadata will be stored on Filecoin + IPFS via NFT.storage and a URI link to it will be stored on chain.
                                </Text>

                                <SimpleGrid columns={3} spacing={6}>
                                    <FormControl
                                        isInvalid={!!errors.name && !!touched.name}
                                        as={GridItem}
                                        colSpan={[3, 3]}
                                    >
                                        <FormLabel
                                            fontSize="sm"
                                            fontWeight="md"
                                            color={"text.100"}
                                            htmlFor="name"
                                        >
                                            Name
                                        </FormLabel>
                                        <InputGroup size="sm">
                                            <Field
                                                as={Input}
                                                id="name"
                                                name="name"
                                                type="text"
                                                variant="filled"
                                                placeholder="Patrick Codes"
                                                focusBorderColor="green.400"
                                                rounded="md"
                                            />
                                        </InputGroup>
                                        <FormErrorMessage fontSize="sm">
                                            {errors.name}
                                        </FormErrorMessage>
                                        <FormHelperText>
                                            A name or title for your profile. This will go in the name field of your profile NFT.
                                        </FormHelperText>
                                    </FormControl>
                                </SimpleGrid>

                                <div>
                                    <FormControl
                                        isInvalid={!!errors.description && !!touched.description}
                                        as={GridItem}
                                        colSpan={[3, 3]}
                                    >
                                        <FormLabel
                                            fontSize="sm"
                                            fontWeight="md"
                                            color={"text.100"}
                                            htmlFor="description"
                                        >
                                            Description
                                        </FormLabel>
                                        <InputGroup size="sm">
                                            <Field
                                                as={Textarea}
                                                id="description"
                                                name="description"
                                                placeholder="New to web3, but loving it!"
                                                variant="filled"
                                                mt={1}
                                                rows={3}
                                                shadow="sm"
                                                focusBorderColor="green.400"
                                                fontSize={{ sm: "sm" }}
                                            />
                                        </InputGroup>
                                        <FormErrorMessage fontSize="sm">
                                            {errors.description}
                                        </FormErrorMessage>
                                        <FormHelperText>
                                            Brief description for your profile. This will go in the description field of your profile NFT.
                                        </FormHelperText>
                                    </FormControl>
                                </div>

                                <FormControl
                                    as={GridItem}
                                    colSpan={[3, 3]}
                                >
                                    <FormLabel
                                        fontSize="sm"
                                        fontWeight="md"
                                        color={"text.100"}
                                    >
                                        Image
                                    </FormLabel>

                                    {/* // display file upload widget
                                    // or an uneditabe image uri + preview if file already uploaded
                                    const fileUploadOrImageURIWidget = imageUrl */}

                                    {!!!imageUrl && (
                                        <FileUpload
                                            onUploadStart={handleUploadStart}
                                            onUploadSuccess={handleUploadSuccess}
                                            onUploadError={handleUploadError}
                                        />
                                    )}


                                    <InputGroup size="sm">
                                        {!!imageUrl && (
                                            <Image ml={{ base: 0, sm: 4 }} src={imageFile ? URL.createObjectURL(imageFile) : ""} boxSize={{ base: "full", sm: "525px" }} objectFit="cover"></Image>
                                        )}
                                    </InputGroup>

                                    {!!!imageUrl
                                        ? (
                                            <FormHelperText>
                                                Choose an image for your profile cover and profile NFT.
                                                <br /> If you don't select an image, we will choose a random default image for this profile.
                                            </FormHelperText>
                                        )
                                        : (
                                            <FormHelperText>
                                                Your image has been uploaded to Supabase as an intermediate step. It will be uploaded to IPFS when you submit this form.

                                            </FormHelperText>
                                        )
                                    }


                                    {/* <FormErrorMessage fontSize="sm">
                                        {errors.imageFilename}
                                    </FormErrorMessage> */}
                                </FormControl>

                                <FormControl
                                    isInvalid={!!errors.github && !!touched.github}
                                    as={GridItem}
                                    colSpan={[3, 3]}
                                >
                                    <FormLabel
                                        fontSize="sm"
                                        fontWeight="md"
                                        color={"text.100"}
                                        htmlFor="github"
                                    >
                                        Github username
                                    </FormLabel>
                                    <InputGroup size="sm">
                                        <InputLeftAddon children="https://github.com/" />
                                        <Field
                                            as={Input}
                                            id="name"
                                            name="name"
                                            type="text"
                                            variant="filled"
                                            placeholder="patrickalphac"
                                            focusBorderColor="green.400"
                                            rounded="md"
                                            value={ghUsername}
                                            textTransform="lowercase"
                                            isReadOnly
                                        />
                                    </InputGroup>
                                    <FormErrorMessage fontSize="sm">
                                        {errors.github}
                                    </FormErrorMessage>
                                    <FormHelperText>
                                        Your github username is stored in the profile NFT metadata json file.
                                        <br />
                                    </FormHelperText>
                                </FormControl>

                                <FormControl
                                    isInvalid={!!errors.tags && !!touched.tags}
                                    as={GridItem}
                                    colSpan={[3, 3]}
                                >
                                    <FormLabel
                                        fontSize="sm"
                                        fontWeight="md"
                                        color={"text.100"}
                                        htmlFor="tags"
                                    >
                                        Profile Tags
                                    </FormLabel>
                                    <InputGroup size="sm">
                                        <TagSelectField
                                            options={Tags}
                                            onChange={(value, action) => {
                                                setFieldValue("tags", value.map(({ label, value }) => ({ label, value })), true);
                                                setFieldTouched("tags", true, true);
                                            }}
                                        />
                                    </InputGroup>
                                    <FormErrorMessage fontSize="sm">
                                        {errors.tags}
                                    </FormErrorMessage>
                                    <FormHelperText mt={3}>
                                        Add tags to help people discover your profile.
                                        <br /> These are also stored in your profile NFT metadata json file.
                                    </FormHelperText>
                                </FormControl>

                                <Divider />

                                <Heading fontSize="lg" fontWeight="md" lineHeight="6" color={"text.50"}>Backer ERC-20 ICO Module</Heading>
                                <Text
                                    mt={0}
                                    fontSize="sm"
                                    color={"text.50"}
                                >
                                    The following fields will configure your Backer ERC-20 ICO module. This module, if enabled, will distribute your custom
                                    ERC-20 tokens to your backers based on a fiat USD price per token you can set below.
                                    <br />
                                    You can use these tokens as is. Or, you can use these to indicate a promise that these tokens will be redeemable at a one-to-one ratio for your
                                    project's actial ERC-20 currency or governance tokens at some later time.
                                </Text>

                                <FormControl
                                    isInvalid={!!errors.enable_module && !!touched.enable_module}
                                    as={GridItem}
                                    colSpan={[3, 3]}
                                >
                                    <FormLabel
                                        fontSize="sm"
                                        fontWeight="md"
                                        color={"text.100"}
                                        htmlFor="enable_module"
                                    >
                                        Enable Back ERC-20 ICO Module
                                    </FormLabel>
                                    <InputGroup size="sm">
                                        <Field
                                            as={Checkbox}
                                            id="enable_module"
                                            name="enable_module"
                                            variant="filled"
                                            placeholder="Impact Tokens"
                                            focusBorderColor="green.400"
                                            isChecked={values.enable_module}
                                        />
                                    </InputGroup>
                                    <FormErrorMessage fontSize="sm">
                                        {errors.enabled}
                                    </FormErrorMessage>
                                    <FormHelperText>
                                        Enable this module?
                                        <br />
                                    </FormHelperText>
                                </FormControl>

                                <FormControl
                                    isInvalid={!!errors.erc20_name && !!touched.erc20_name}
                                    as={GridItem}
                                    colSpan={[3, 3]}
                                >
                                    <FormLabel
                                        fontSize="sm"
                                        fontWeight="md"
                                        color={"text.100"}
                                        htmlFor="erc20_name"
                                    >
                                        ERC-20 Name
                                    </FormLabel>
                                    <InputGroup size="sm">
                                        <Field
                                            as={Input}
                                            id="erc20_name"
                                            name="erc20_name"
                                            type="text"
                                            variant="filled"
                                            placeholder="Impact Tokens"
                                            focusBorderColor="green.400"
                                            rounded="md"
                                            isDisabled={!!!values.enable_module}
                                        />
                                    </InputGroup>
                                    <FormErrorMessage fontSize="sm">
                                        {errors.erc20_name}
                                    </FormErrorMessage>
                                    <FormHelperText>
                                        Choose your ERC-20 name.
                                        <br />
                                    </FormHelperText>
                                </FormControl>

                                <FormControl
                                    isInvalid={!!errors.erc20_symbol && !!touched.erc20_symbol}
                                    as={GridItem}
                                    colSpan={[3, 3]}
                                >
                                    <FormLabel
                                        fontSize="sm"
                                        fontWeight="md"
                                        color={"text.100"}
                                        htmlFor="erc20_symbol"
                                    >
                                        ERC-20 Symbol
                                    </FormLabel>
                                    <InputGroup size="sm">
                                        <Field
                                            as={Input}
                                            id="erc20_symbol"
                                            name="erc20_symbol"
                                            type="text"
                                            variant="filled"
                                            placeholder="Imp"
                                            focusBorderColor="green.400"
                                            rounded="md"
                                            isDisabled={!!!values.enable_module}
                                        />
                                    </InputGroup>
                                    <FormErrorMessage fontSize="sm">
                                        {errors.erc20_symbol}
                                    </FormErrorMessage>
                                    <FormHelperText>
                                        Choose your ERC-20 symbol.
                                    </FormHelperText>
                                </FormControl>

                                <FormControl
                                    isInvalid={!!errors.erc20_price && !!touched.erc20_price}
                                    as={GridItem}
                                    colSpan={[3, 3]}
                                >
                                    <FormLabel
                                        fontSize="sm"
                                        fontWeight="md"
                                        color={"text.100"}
                                        htmlFor="erc20_price"
                                    >
                                        ERC-20 Token Price In USD
                                    </FormLabel>
                                    <InputGroup size="sm">
                                        <Field
                                            as={Input}
                                            id="erc20_price"
                                            name="erc20_price"
                                            type="text"
                                            variant="filled"
                                            placeholder="0.01"
                                            focusBorderColor="green.400"
                                            rounded="md"
                                            isDisabled={!!!values.enable_module}
                                        />
                                    </InputGroup>
                                    <FormErrorMessage fontSize="sm">
                                        {errors.erc20_price}
                                    </FormErrorMessage>
                                    <FormHelperText>
                                        Choose how much an ERC-20 token costs in USD.
                                        <br />
                                    </FormHelperText>
                                </FormControl>
                            </Stack>


                            <Box
                                px={{ base: 4, sm: 6 }}
                                py={3}
                                bg={"bg.submit"}
                            >
                                {mutation.isLoading && (
                                    <Box fontSize="sm" fontWeight={"thin"} color={"green.500"} my={2}>
                                        Created metadata json on IPFS!
                                        <br />
                                        <Link isExternal>
                                            {metadataIpfsUrl}
                                        </Link>
                                    </Box>
                                )}
                                <Button
                                    type="submit"
                                    colorScheme="green"
                                    _focus={{ shadow: "" }}
                                    fontWeight="md"
                                    px="40px"
                                    isLoading={mutation.isLoading || uploadingImage || creatingMetadata}
                                    loadingText={mutation.isLoading ? "Creating Profile" : (uploadingImage ? "Uploading Image" : "Creating Metadata on IPFS")}
                                >
                                    Create Profile
                                </Button>
                                <Text
                                    color={"text.200"}
                                    fontSize="sm"
                                    fontWeight={"thin"}
                                    mt={2}
                                >
                                    Uploading image to server, creating NFT metadata on IPFS, and then sending data to the blockchain might take some time.
                                    <br />
                                    Thanks for your patience!
                                </Text>
                            </Box>
                        </chakra.form>);
                    }
                }
            </Formik>

        </>
    );
}
