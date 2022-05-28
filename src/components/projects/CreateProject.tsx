import * as React from "react";
import axios from "axios";
import {
    chakra,
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
    Divider,
    Image,
    Link
} from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useAccount } from "wagmi";
import { useQuery, useQueryClient } from "react-query";


import useBuidlHub from "../../hooks/useBuidlHub";
import { CaughtError as Err } from "../../lib/types";
import ConnectWalletCTA from "../common/ConnectWalletCTA";
import { ProjectTypeMapping, ProjectSizeMapping, ProjectStateMapping, ProfileTypeMapping } from "../../hooks/useBuidlHub/types";
import useCreateProject from "../../hooks/projects/useCreateProject";
import FileUpload from "../form/FileUpload";
import Tags from "../../utils/tags";
import TagSelectField from "../form/TagSelect";
import useWalletConnected from "../../hooks/auth/useWalletConnected"
import useGHConnected from "../../hooks/auth/useGHConnected"
import ConnectCTA from "../auth/ConnectCTA";



export default function EditProject() {
    // connected to gh
    const { loggedIn, ghUsername } = useGHConnected();
    // connected to metamask
    const { walletConnected, walletAddress } = useWalletConnected();

    // react query mut
    const mutation = useCreateProject();
    const queryClient = useQueryClient();


    // next router
    const router = useRouter();

    // alert
    const { isOpen, onOpen, onClose } = useDisclosure();
    const okRef = React.useRef<HTMLButtonElement>()
    const [error, setError] = React.useState<Err>({});

    // get profiles by connected wallet
    // so user can choose which profile to create a project for
    const hub = useBuidlHub();
    const profilesQuery = useQuery(
        // filter by account
        ["profiles", { filter: true, to: walletAddress ?? null }], () => hub.getProfiles({ to: walletAddress }),
        {
            // don't query until wallet connected
            enabled: walletConnected
        }
    )

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
        profileId: Yup.string()
            .matches(
                /^[0-9]+$/,
                "Invalid profileId: Not a number."
            )
            // .oneOf(profilesQuery.data) // TODO
            .required("Required"),
        projectType: Yup.string()
            .matches(
                /^[0-9]+$/,
                "Invalid project type"
            )
            .oneOf(Object.keys(ProjectTypeMapping))
            .required("Required"),
        projectSize: Yup.string()
            .matches(
                /^[0-9]+$/,
                "Invalid project size"
            )
            .oneOf(Object.keys(ProjectSizeMapping))
            .required("Required"),
        projectState: Yup.string()
            .matches(
                /^[0-9]+$/,
                "Invalid project state"
            )
            .oneOf(Object.keys(ProjectStateMapping))
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
            .required("Required")
    })

    const handleFormikSubmit = async (values, formikHelpers) => {
        // alert(JSON.stringify(values, null, 2));
        // return;
        const { setSubmitting, resetForm, isSubmitting } = formikHelpers;

        if (isSubmitting) return;
        if (!walletConnected) {
            displayErrorAlert({ message: "Not authenticated: Wallet not connected" });
            setSubmitting("false");
            return;
        }

        const { projectType, projectSize, projectState, profileId, handle, name, description, tags } = values;
        const image = imageUrl;
        let metadataURI;

        // 1. API call to create IPFS metadata URI -- if necessary
        if (!!!metadataIpfsUrl) {
            try {
                setCreatingMetadata(true);
                const res = await axios
                    .post('/api/storeNFTStorage', { image, ...values });
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

        // 2. React query mutate -> wagmi ethers contract call to create entity
        // TODO check metadataURI against ipfs url regex

        // debug - sleep for 5 s to simulate a delay
        // await new Promise(r => setTimeout(r, 5000));
        mutation.mutateAsync({
            profileId: profileId,
            to: walletAddress ?? "",
            handle: handle,
            metadataURI: metadataURI,
            projectType,
            projectSize,
            projectState
        }).then(() => {
            setSubmitting("false");
            resetForm();
            // invalidate queries
            queryClient.invalidateQueries(["projects"])
            router.push(`/projects/${handle}`)
            toast.success("Successfully created project!")
        }).catch((e) => {
            displayErrorAlert(e);
            setSubmitting("false");
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
                redirectTo={'/projects/create'}
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
                        projectType: "",
                        projectSize: "",
                        projectState: "",
                        handle: "",
                        metadataURI: "",
                        profileId: "",
                        name: "",
                        description: "",
                        tags: [],
                        githubRepo: ""
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
                                                placeholder="Select profile"
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
                                            Choose profile to associate with the project.
                                        </FormHelperText>
                                    </FormControl>
                                </SimpleGrid>


                                <SimpleGrid columns={3} spacing={6}>
                                    <FormControl
                                        isInvalid={!!errors.projectType && !!touched.projectType}
                                        as={GridItem}
                                        colSpan={[3, 3]}
                                    >
                                        <FormLabel
                                            fontSize="sm"
                                            fontWeight="md"
                                            color={"text.100"}
                                            htmlFor="projectType"
                                        >
                                            Project Type
                                        </FormLabel>
                                        <InputGroup size="sm">
                                            <Field
                                                as={Select}
                                                id="projectType"
                                                name="projectType"
                                                type="select"
                                                variant="filled"
                                                placeholder="Select project type"
                                                focusBorderColor="green.400"
                                                rounded="md"
                                            >
                                                {(Object.keys(ProjectTypeMapping)).map((key) => (
                                                    <option value={key} key={key}>{ProjectTypeMapping[key]}</option>
                                                ))}
                                            </Field>
                                        </InputGroup>
                                        <FormErrorMessage fontSize="sm">
                                            {errors.projectType}
                                        </FormErrorMessage>
                                        <FormHelperText>
                                            Choose project type.
                                        </FormHelperText>
                                    </FormControl>
                                </SimpleGrid>

                                <SimpleGrid columns={3} spacing={6}>
                                    <FormControl
                                        isInvalid={!!errors.projectSize && !!touched.projectSize}
                                        as={GridItem}
                                        colSpan={[3, 3]}
                                    >
                                        <FormLabel
                                            fontSize="sm"
                                            fontWeight="md"
                                            color={"text.100"}
                                            htmlFor="projectSize"
                                        >
                                            Project Size
                                        </FormLabel>
                                        <InputGroup size="sm">
                                            <Field
                                                as={Select}
                                                id="projectSize"
                                                name="projectSize"
                                                type="select"
                                                variant="filled"
                                                placeholder="Select project size"
                                                focusBorderColor="green.400"
                                                rounded="md"
                                            >
                                                {(Object.keys(ProjectSizeMapping)).map((key) => (
                                                    <option value={key} key={key}>{ProjectSizeMapping[key]}</option>
                                                ))}
                                            </Field>
                                        </InputGroup>
                                        <FormErrorMessage fontSize="sm">
                                            {errors.projectSize}
                                        </FormErrorMessage>
                                        <FormHelperText>
                                            Choose project size.
                                        </FormHelperText>
                                    </FormControl>
                                </SimpleGrid>

                                <SimpleGrid columns={3} spacing={6}>
                                    <FormControl
                                        isInvalid={!!errors.projectState && !!touched.projectState}
                                        as={GridItem}
                                        colSpan={[3, 3]}
                                    >
                                        <FormLabel
                                            fontSize="sm"
                                            fontWeight="md"
                                            color={"text.100"}
                                            htmlFor="projectState"
                                        >
                                            Project State
                                        </FormLabel>
                                        <InputGroup size="sm">
                                            <Field
                                                as={Select}
                                                id="projectState"
                                                name="projectState"
                                                state="select"
                                                variant="filled"
                                                placeholder="Select project state"
                                                focusBorderColor="green.400"
                                                rounded="md"
                                            >
                                                {(Object.keys(ProjectStateMapping)).map((key) => (
                                                    <option value={key} key={key}>{ProjectStateMapping[key]}</option>
                                                ))}
                                            </Field>
                                        </InputGroup>
                                        <FormErrorMessage fontSize="sm">
                                            {errors.projectState}
                                        </FormErrorMessage>
                                        <FormHelperText>
                                            Choose project state.
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
                                                placeholder="your-handle"
                                                focusBorderColor="green.400"
                                                rounded="md"
                                            />
                                        </InputGroup>
                                        <FormErrorMessage fontSize="sm">
                                            {errors.handle}
                                        </FormErrorMessage>
                                        <FormHelperText>
                                            Choose your project handle.
                                            <br />
                                            {values.handle &&
                                                `Your project url will be "${window.location.host}/projects/${values.handle}"`
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
                                    The following fields will be comprise your project metadata and will be linked from the NFTs people who invest in your project get!
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
                                    isInvalid={!!errors.githubRepo && !!touched.githubRepo}
                                    as={GridItem}
                                    colSpan={[3, 3]}
                                >
                                    <FormLabel
                                        fontSize="sm"
                                        fontWeight="md"
                                        color={"text.100"}
                                        htmlFor="github"
                                    >
                                        Github Repo Name
                                    </FormLabel>
                                    <InputGroup size="sm">
                                        <InputLeftAddon children={`https://github.com/${ghUsername ?? ''}/`} />
                                        <Field
                                            as={Input}
                                            id="githubRepo"
                                            name="githubRepo"
                                            type="text"
                                            variant="filled"
                                            placeholder={values.handle || "awesome-web3-project"}
                                            focusBorderColor="green.400"
                                            rounded="md"
                                            textTransform="lowercase"
                                        />
                                    </InputGroup>
                                    <FormErrorMessage fontSize="sm">
                                        {errors.githubRepo}
                                    </FormErrorMessage>
                                    <FormHelperText>
                                        Your github repo name is stored in the profile NFT metadata json file.
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
                                        Project Tags
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
                                        Add tags to help people discover your project.
                                        <br /> These are also stored in your project metadata json file.
                                    </FormHelperText>
                                </FormControl>
                            </Stack>
                            <Box
                                px={{ base: 4, sm: 6 }}
                                py={3}
                                bg={"bg.submit"}
                            >
                                {mutation.isLoading && (
                                    <Box color="text" fontSize="sm" fontWeight={"thin"} color={"green.500"} my={2}>
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
                                    loadingText={mutation.isLoading ? "Creating Project" : (uploadingImage ? "Uploading Image" : "Creating Metadata on IPFS")}
                                >
                                    Create Project
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
