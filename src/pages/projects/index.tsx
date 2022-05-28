import { Box, Heading } from "@chakra-ui/react"
import Head from "next/head";
import ProjectGallery from "../../components/projects/ProjectGallery"
import ProfileContainer from "../../components/common/ProfileContainer";


function ProjectsIndex() {
    return (
        <ProfileContainer>
            <Head>
                <title>Project Gallery</title>
            </Head>
            <ProjectGallery />
        </ProfileContainer>
    )
}

export default ProjectsIndex