import { Button } from "@chakra-ui/react";
import NextLink from "next/link"


export default function GalleryActionButton({ href, icon, children, ...props }) {
    return (
        <NextLink href={href} passHref>
            <Button
                variant="link"
                colorScheme="blue"
                fontSize="xs"
                height={6}
                leftIcon={icon}
                {...props}
            >
                {children}
            </Button>
        </NextLink>
    )
}