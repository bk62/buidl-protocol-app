import { useEffect, useState } from 'react'
import {

    Button,
} from "@chakra-ui/react"
import { FaGithub } from 'react-icons/fa';

import { supabase } from '../../utils/supabaseClient'


export default function ConnectGHButton({ redirectTo = "https://localhost:3000/dashboard", ...props }) {
    const [loading, setLoading] = useState(false)
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        setSession(supabase.auth.session())

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

    }, [])

    const user = session === null ? null : session.user;
    const loggedIn = !!user;

    const handleLogin = async () => {
        try {
            setLoading(true)
            // alert("Redirect to " + redirectTo);
            const { error } = await supabase.auth.signIn({ provider: 'github', }, { redirectTo: redirectTo })
            if (error) throw error;
        } catch (error) {
            alert(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signOut()
            if (error) throw error;
        } catch (error) {
            alert(error.error_description || error.message)
        } finally {
            setLoading(false);
        }
    }

    const buttonProps = {
        fontSize: "xs",
        w: "full",
        p: 0,
        m: 0,
        textDecoration: "none",
        fontWeight: "thin",
        ...props
    }

    if (!loggedIn) return (
        <Button
            onClick={(e) => { e.preventDefault(); handleLogin(); }}
            variant="link"
            leftIcon={<FaGithub />}
            isLoading={loading}
            {...buttonProps}
        >
            Connect Github
        </Button>
    )

    return (
        <Button
            onClick={(e) => { e.preventDefault(); handleLogout(); }}
            variant="link"
            leftIcon={<FaGithub />}
            isLoading={loading}
            {...buttonProps}
        >
            Disconnect Github
        </Button>
    )
}