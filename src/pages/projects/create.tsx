import * as React from "react";
import Head from "next/head";

import FormContainer from "../../components/common/FormContainer";
import CreateProject from "../../components/projects/CreateProject";
import { getSidebarLayout } from "../../components/layout/Layout"


function CreateProjectPage() {
    const desc = `Edit your project information.
    This information will be publicly stored on the blockchain and on IPFS!`;

    return (
        <FormContainer title="Project" description={desc}>
            <Head>
                <title>Create Project</title>
            </Head>
            <CreateProject />
        </FormContainer>
    )
}

CreateProjectPage.getLayout = getSidebarLayout;

export default CreateProjectPage