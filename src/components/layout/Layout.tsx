import { Box, Grid, GridItem } from "@chakra-ui/react"
import Navbar from "../navigation/Navbar"
import { Footer } from "../navigation/Footer"
import { ReactElement } from "react"
import Breadcrumbs from "../navigation/Breadcrumbs";
import Sidebar from "../navigation/Sidebar";


// simple default layout
export default function DefaultLayout({ breadcrumbsProps, showSidebar = false, children }): ReactElement {
    return (
        // Sticky footer
        <Box minH="100vh" display="grid" gridTemplateRows="auto 1fr auto">
            <Navbar />
            <Box as="main">
                <Breadcrumbs {...breadcrumbsProps} />
                {children}
            </Box>
            <Footer />
        </Box>
    )
}

export const getLayout = (page: ReactElement): ReactElement => (
    <DefaultLayout breadcrumbsProps={{ rootCrumb: { label: 'Home', href: "/" } }}>
        {page}
    </DefaultLayout>
)


// sidebar layout for dashboard and form pages
export function SidebarLayout({ breadcrumbsProps, children }): ReactElement {
    return (
        // Sticky footer
        <Box minH="100vh" display="grid" gridTemplateRows="auto 1fr auto">
            <Navbar />

            <Box as="main"
                display="grid"
                gridTemplateColumns={{ md: "auto 1fr" }}
                gridTemplateAreas={{
                    base: `"sidebar" "content"`,
                    md: `"sidebar content"`
                }}
            >
                <GridItem gridArea={"sidebar"}>
                    <Sidebar />
                </GridItem>
                <GridItem as="section" gridArea={"content"}>
                    <Breadcrumbs {...breadcrumbsProps} />
                    {children}
                </GridItem>
            </Box>
            <Footer />
        </Box>
    )
}

export const getSidebarLayout = (page: ReactElement) => (
    <SidebarLayout breadcrumbsProps={{ rootCrumb: { label: 'Dashboard', href: "/dashboard" } }}>
        {page}
    </SidebarLayout>
)

