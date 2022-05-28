import * as React from "react";
import { Link } from "@chakra-ui/react";
import Head from "next/head";

import { getSidebarLayout } from "../../../components/layout/Layout";
import FormContainer from "../../../components/common/FormContainer";
import CreateYieldTrust from "../../../components/profiles/CreateYieldTrust";


function CreateYieldTrustPage() {
    const desc = <>
        Create a Yield Trust.
        This information will be publicly and immutably stored on chain{' '}
    </>;

    return (
        <FormContainer title="Create a Yield Trust" description={desc}>
            <Head>
                <title>Create Yield Trust Vault</title>
            </Head>
            <CreateYieldTrust />
        </FormContainer>
    )
}

CreateYieldTrustPage.getLayout = getSidebarLayout

export default CreateYieldTrustPage