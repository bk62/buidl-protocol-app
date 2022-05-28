import { Box, Text, Heading, useColorModeValue } from "@chakra-ui/react"

export default function ProfileContainer({ children, ...rest }) {
    return (
        <Box
            bg={'bg.0'}
            height={"full"}
            px={{ base: 2, sm: 4, md: 6, lg: 8, xl: 10 }}
            py={0}
            // mt={-5}
            // shadow="base"
            // rounded={[null, "md"]}
            {...rest}
        >
            {/* <Box px={[4, 0]}>
                <Heading fontSize="lg" fontWeight="md" lineHeight="6">
                    {title}
                </Heading>
                <Text
                    mt={1}
                    fontSize="sm"
                    color={"text.50"}
                >

                    {description}
                </Text>
            </Box> */}
            < Box
                // px={8}
                bg={"bg.2"}
                // pt={1}
                shadow="base"
                rounded={[null, "md"]}
                px={0}
                // mt={5}
                pb={4}
                mb={4}
                mx={1}
            >
                {children}
            </Box >
        </Box >
    )
}
