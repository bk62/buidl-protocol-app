import { Stack, Text } from "@chakra-ui/react"

export default function InfoRow({ title, value }) {
    return (
        <Stack direction="row" mb={1}>
            <Text
                color={"text.200"}
                fontSize="md"
                fontWeight="bold"
                me={2}
                textTransform="capitalize"
            >
                {title}: {" "}
            </Text>
            <Text
                color="text"
                fontSize="md"
                fontWeight="thin"
            >
                {value}
            </Text>
        </Stack>
    )
}
