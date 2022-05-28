import { Box, Text, Heading, useColorModeValue } from "@chakra-ui/react"


export default function PageContainer({ title = "", description = "", children, showHeading = false, ...props }) {
    return (
        <Box
            bg={'bg.0'}
            height={"full"}
            px={8}
            py={6}
            {...props}
        >
            {showHeading && (
                <Box px={[4, 0]}>
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
                </Box>
            )}
            <Box mt={5}>
                {children}
            </Box>
        </Box>
    )
}
