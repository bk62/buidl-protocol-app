import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Box,
    useColorModeValue
} from '@chakra-ui/react'

// https://stackoverflow.com/questions/64541235/breadcrumbs-and-nextjs


const convertBreadcrumb = string => {
    return string
        .replace(/-/g, ' ')
        // remove query params and fragments
        .split('#')[0]
        .split('?')[0];
};

type Crumb = { label: string, href: string }


const Breadcrumbs = ({ rootCrumb }: { rootCrumb?: Crumb }) => {
    const router = useRouter();

    const [crumbs, setCrumbs] = React.useState<Array<Crumb>>([]);

    React.useEffect(() => {
        if (router) {
            const linkPath = router.asPath.split('/');
            linkPath.shift();

            const pathArray = linkPath.map((path, i) => {
                return { label: convertBreadcrumb(path), href: '/' + linkPath.slice(0, i + 1).join('/') };
            });

            setCrumbs(pathArray);
        }
    }, [router]);

    if (!crumbs) {
        return null;
    }

    return (
        <Box
            // my={2}
            // mx={{ base: 8 }}
            py={2}
            px={8}
            fontSize="md"
            fontWeight="semiBold"
            color="gray.500"
            bg={useColorModeValue("gray.50", "inherit")}
        >
            {/* {"RootCrumb = " + JSON.stringify(rootCrumb, null, 2)} */}
            <Breadcrumb separator="/" >
                {rootCrumb && (
                    <BreadcrumbItem key={rootCrumb.href}>
                        <NextLink href={rootCrumb.href}>
                            <BreadcrumbLink textTransform="capitalize" letterSpacing="wide">
                                {rootCrumb.label}
                            </BreadcrumbLink >
                        </NextLink >
                    </BreadcrumbItem>
                )}
                {
                    crumbs.map((c, i) => {
                        return (
                            <BreadcrumbItem key={c.href} {...((i === crumbs.length - 1) ? { isCurrentPage: true } : {})}>
                                <NextLink href={c.href}>
                                    <BreadcrumbLink textTransform="capitalize" letterSpacing="wide">
                                        {c.label}
                                    </BreadcrumbLink >
                                </NextLink >
                            </BreadcrumbItem>
                        )
                    })
                }
            </Breadcrumb>
        </Box>
    );
}

export default Breadcrumbs;