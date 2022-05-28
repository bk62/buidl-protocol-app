import * as React from "react";
import { useRouter } from "next/router";

import { getSidebarLayout } from "../../components/layout/Layout";
import FormContainer from "../../components/common/FormContainer";
import InvestInProject from "../../components/projects/InvestInProject";


const InvestInProjectPage = () => {
    const desc = <>
        Invest in this project.
        Please choose the amount of MATIC and/or approved ERC-20 tokens to contribute this project.
    </>

    const router = useRouter();

    const { profileId, projectId, handle } = router.query;

    return (
        <FormContainer title="Invest in Project" description={desc}>
            <InvestInProject handle={handle} />
        </FormContainer>
    )
}

InvestInProjectPage.getLayout = getSidebarLayout

export default InvestInProjectPage;