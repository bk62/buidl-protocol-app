import * as React from "react";
import { useColorModeValue, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";

import Layout from "../../components/layout/Layout";
import ProjectDetail from "../../components/projects/ProjectDetail";
import ProfileContainer from "../../components/common/ProfileContainer";
import Head from "next/head";


const ProjectDetailPage = () => {
    const router = useRouter();

    // handle by default
    const { handleOrId, isId: isIdStr } = router.query;
    const isId: boolean = !!isIdStr;
    let projectId, handle;
    if (!!isId) {
        projectId = handleOrId;
    } else {
        handle = handleOrId;
    }

    return (
        <ProfileContainer>
            <Head>
                <title>Project Profile</title>
            </Head>

            <ProjectDetail {...{ handle, projectId }} />
        </ProfileContainer>
    )
}


export default ProjectDetailPage;