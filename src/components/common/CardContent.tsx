import { Box, useStyleConfig } from '@chakra-ui/react'

function CardContent(props) {
    const { size, variant, ...rest } = props

    const styles = useStyleConfig('CardContent', { size, variant })

    // Pass the computed styles into the `__css` prop
    return <Box __css={styles} {...rest} />
}

export default CardContent;