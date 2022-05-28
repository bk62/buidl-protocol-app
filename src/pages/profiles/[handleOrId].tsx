import * as React from "react";
import { useColorModeValue, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Head from "next/head";

import ProfileDetail from "../../components/profiles/ProfileDetail";
import ProfileContainer from "../../components/common/ProfileContainer";


const ProfileDetailPage = () => {
    const router = useRouter();

    // handle by default
    const { handleOrId, isId: isIdStr } = router.query;
    const isId: boolean = !!isIdStr;
    let profileId, handle;
    if (!!isId) {
        profileId = handleOrId;
    } else {
        handle = handleOrId;
    }

    return (
        <ProfileContainer>
            <Head>
                <title>Profile</title>
            </Head>
            <ProfileDetail {...{ handle, profileId }} />
        </ProfileContainer>
    )
}


export default ProfileDetailPage;