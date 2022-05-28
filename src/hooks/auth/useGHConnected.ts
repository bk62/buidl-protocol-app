import * as React from "react";
import { supabase } from "../../utils/supabaseClient";

export default function useGHConnected() {
    // connected to gh?
    const [session, setSession] = React.useState<any>(null);

    React.useEffect(() => {
        setSession(supabase.auth.session())

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

    }, [])

    const user = session === null ? null : session.user;
    const loggedIn = !!user;
    const ghUsername = loggedIn ? user.user_metadata.user_name : "";

    return { session, user, loggedIn, ghUsername };
}