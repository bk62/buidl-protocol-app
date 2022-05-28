import { Box, Text, Heading } from "@chakra-ui/react"
import PageContainer from "./PageContainer"

export default function FormContainer({ showHeading = true, children, ...rest }) {
    return (
        <PageContainer showHeading={showHeading} children={children} {...rest} />
    )
}
