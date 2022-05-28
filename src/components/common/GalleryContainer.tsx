import { Box, Text, Heading, useColorModeValue } from "@chakra-ui/react"

import PageContainer from "./PageContainer"
export default function GalleryContainer({ showHeading = false, children, ...rest }) {
    return (
        <PageContainer showHeading={showHeading} children={children} pt={1} {...rest} />
    )
}
