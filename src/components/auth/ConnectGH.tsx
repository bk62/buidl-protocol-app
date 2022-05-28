import { useState, useEffect } from 'react'
import {
    ArrowRightIcon
} from "@chakra-ui/icons"
import {
    Box,
    Grid,
    GridItem,
    Heading,
    Text,
    Flex,
    Button,
    useColorModeValue
} from "@chakra-ui/react"

import { supabase } from '../../utils/supabaseClient'
import Card from "../common/Card"
import CardContent from "../common/CardContent"


export default function ConnectGH() {
    const [loading, setLoading] = useState(false)
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        setSession(supabase.auth.session())

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

    }, [])

    const user = supabase.auth.user()

    const handleLogin = async () => {
        try {
            setLoading(true)
            const { user, session, error } = await supabase.auth.signIn({ provider: 'github', }, { redirectTo: 'http://localhost:3000/dashboard' })
            if (error) throw error
            console.log(user)
            console.log(session)
        } catch (error) {
            alert(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
        } catch (error) {
            alert(error.error_description || error.message)
        }
    }

    return (
        <Box>
            {!!!user && (
                <Card
                    mx={{ base: "auto", md: 10 }}
                    mt={4}
                    mb={{ base: 4, md: 4 }}
                    maxW={{ base: "95%", md: "md", lg: "3xl", xl: "4xl" }}
                    bgColor="bg.1"
                >
                    <CardContent
                        display="flex"
                        flexDirection="column"
                        justifyContent="baseline"
                        alignItems="stretch"
                        p={8}
                    >
                        <Text
                            color={"text.200"}
                            mb={2}
                            fontWeight="semibold"
                            fontSize="sm"
                        >
                            "Connect Github!"
                        </Text>
                        <Heading mb={8}>
                            "Please connect your Github account to enable file uploads."
                        </Heading>
                        <Text
                            fontWeight="thin"
                            lineHeight="5"
                            mb={10}
                            color={"text.200"}
                        >
                            Please connect your github account. We use it to log you in to BuidlProtocol using Supabase and
                            to add your verified github account as ERC-721 NFT metadata for your profiles and projects.
                            <br />
                            It'll only take a minute.
                        </Text>
                        <Button
                            variant="ghost"
                            rightIcon={<ArrowRightIcon />}
                            textAlign="left"
                            justifyContent="flex-start"
                            fontSize="md"
                            pl={``}
                            width="fit-content"
                            color={"text.cta"}
                            _hover={{
                                color: "text.cta.hover",
                            }}
                            isLoading={loading}
                            loadingText="Connecting to GH"
                            onClick={(e) => { e.preventDefault(); handleLogin(); }}
                        >
                            Start buidling!
                        </Button>
                    </CardContent>
                </Card>
            )}
            {!!user && (
                <Text>Connected:
                    {/* {JSON.stringify(user, null, 2)} */}
                </Text>
            )}
        </Box>
    )
}