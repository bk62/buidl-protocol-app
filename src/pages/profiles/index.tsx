import { Box, Heading } from "@chakra-ui/react"
import Head from "next/head";

import ProfileGallery from "../../components/profiles/ProfileGallery"
import ProfileContainer from "../../components/common/ProfileContainer";


function ProfilesIndex() {
    return (
        <ProfileContainer>
            <Head>
                <title>Profile Gallery</title>
            </Head>
            <ProfileGallery />
        </ProfileContainer>
    )
}



export default ProfilesIndex