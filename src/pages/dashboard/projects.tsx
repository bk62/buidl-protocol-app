import ProjectGallery from "../../components/projects/ProjectGallery"
import { useAccount } from "wagmi";
import ProfileContainer from "../../components/common/ProfileContainer";
import { getSidebarLayout } from "../../components/layout/Layout";


function MyProjects() {
    const accountQuery = useAccount();

    const accountConnected = !!accountQuery.data && !!accountQuery.data?.address;
    const connectedAddress = accountConnected ? accountQuery.data?.address : null;


    return (
        <ProfileContainer>
            <ProjectGallery filters={{ creator: connectedAddress }} />
        </ProfileContainer>
    )
}

MyProjects.getLayout = getSidebarLayout


export default MyProjects