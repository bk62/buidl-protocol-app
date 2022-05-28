import { Box, Flex, Stack, Icon, useColorModeValue, chakra, VisuallyHidden, Text, Image, VStack, Button } from "@chakra-ui/react"
import { url } from "inspector";
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { supabase } from "../../utils/supabaseClient";

type FileUploadProps = {
    bucket?: string;
    onUploadStart?: null | Function;
    onUploadSuccess?: null | Function;
    onUploadError?: null | Function;
}

export default function FileUpload({ bucket = "avatars", onUploadStart = null, onUploadSuccess = null, onUploadError = null }: FileUploadProps) {
    const [uploading, setUploading] = useState(false);

    // config react-dropzone
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/gif': ['.gif'],
            'image/svg': ['.svg']
        },
        maxFiles: 1,
        multiple: false,
        maxSize: 1e+7, // 10 mb in bytes,
        disabled: uploading,
        // onDrop: uploadImage
    });

    // upload image to supabase storage
    async function uploadImage(acceptedFiles) {
        console.log("uploadImage");
        try {
            setUploading(true)
            if (!!onUploadStart) onUploadStart()

            if (!!!acceptedFiles || acceptedFiles.length === 0) {
                throw new Error("Image not selected")
            }

            const file = acceptedFiles[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            let { data, error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            if (!!onUploadSuccess) {
                // const Key = data?.Key || "";
                // const fn = Key.split('/').pop() ?? "";
                // const { data: dlData, error: dlError } = await supabase.storage.from(bucket).download(fn);
                // if (dlError) throw dlError
                // onUploadSuccess(URL.createObjectURL(dlData));
                onUploadSuccess(file, data?.Key.split('/').pop());
            }
        } catch (error) {
            if (!!onUploadError) {
                onUploadError(error)
            } else {
                alert(error.message)
            }
        } finally {
            setUploading(false)
        }
    }


    // Display selected image
    const files = acceptedFiles.map(file => (
        <VStack mt={2} justifyContent="center">
            <Image src={URL.createObjectURL(file)} boxSize="200px" objectFit="cover" />
            <Text fontSize="md" color="gray.500" key={file.name} ml={2}>
                Selected: {file.name} - {file.size} bytes
            </Text>
            <Button
                colorScheme="blue" onClick={() => uploadImage(acceptedFiles)}
                size="sm"
                isLoading={uploading}
                loadingText="Uploading to Supabase"
            >
                Confirm
            </Button>
            <Text fontSize="xs" color="text.200" mt={1}>Finalize and upload to server in preparation for uploading to Filecoin + IPFS via NFT.storage</Text>
        </VStack>
    ));

    return (
        <Box>
            <Flex
                mt={1}
                justify="center"
                px={6}
                pt={5}
                pb={6}
                borderWidth={2}
                borderColor={useColorModeValue("gray.300", "gray.500")}
                borderStyle="dashed"
                rounded="md"
                {...getRootProps({ className: 'dropzone' })}
            >
                <Stack spacing={1} textAlign="center">
                    <Icon
                        mx="auto"
                        boxSize={12}
                        color={useColorModeValue("gray.400", "gray.500")}
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </Icon>
                    <Flex
                        fontSize="sm"
                        color={useColorModeValue("gray.600", "gray.400")}
                        alignItems="baseline"
                    >
                        <chakra.label
                            htmlFor="file-upload"
                            cursor="pointer"
                            rounded="md"
                            fontSize="md"
                            color={useColorModeValue("green.600", "green.200")}
                            pos="relative"
                            _hover={{
                                color: useColorModeValue("green.400", "green.300"),
                            }}
                        >
                            <span>Upload a file</span>
                            <VisuallyHidden>
                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    {...getInputProps()}
                                />
                            </VisuallyHidden>
                        </chakra.label>
                        <Text pl={1}>or drag and drop</Text>
                    </Flex>
                    <Text
                        fontSize="xs"
                        color={useColorModeValue("gray.500", "gray.50")}
                    >
                        PNG, JPG, GIF, SVG up to 10MB
                    </Text>
                </Stack>
            </Flex>
            {files}
        </Box>
    )
}