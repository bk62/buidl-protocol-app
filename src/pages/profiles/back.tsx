import * as React from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { getSidebarLayout } from "../../components/layout/Layout";
import FormContainer from "../../components/common/FormContainer";
import BackProfile from "../../components/profiles/BackProfile";


const BackProfilePage = () => {
    const desc = <>
        Back this profile.
        Please choose the amount of MATIC or an approved ERC-20 token to contribute this profile.
    </>

    const router = useRouter();

    const { profileId, handle } = router.query;

    return (
        <FormContainer title="Back Profile" description={desc}>
            <Head>
                <title>Back Profile</title>
            </Head>
            <BackProfile handle={handle} />
        </FormContainer>
    )
}

BackProfilePage.getLayout = getSidebarLayout

export default BackProfilePage;