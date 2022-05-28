import * as React from "react";
import { Link } from "@chakra-ui/react";
import Head from "next/head";

import { getSidebarLayout } from "../../components/layout/Layout";
import FormContainer from "../../components/common/FormContainer";
import CreateProfile from "../../components/profiles/CreateProfile";


function CreateProfilePage() {
    const desc = <>
        Create your profile.
        This information will be publicly and immutably stored on the blockchain and on FileCoin + IPFS using{' '}
        <Link isExternal href="https://nft.storage/" textColor="blue.500">NFT.storage</Link>!
    </>;

    return (
        <FormContainer title="Create Profile" description={desc}>
            <Head>
                <title>Create Profile</title>
            </Head>
            <CreateProfile />
        </FormContainer>
    )
}

CreateProfilePage.getLayout = getSidebarLayout

export default CreateProfilePage