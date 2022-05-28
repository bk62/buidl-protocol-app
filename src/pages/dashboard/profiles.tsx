import ProfileGallery from "../../components/profiles/ProfileGallery"
import { useAccount } from "wagmi";
import GalleryContainer from "../../components/common/GalleryContainer";
import { getSidebarLayout } from "../../components/layout/Layout";



function ProfilesIndex() {
    const accountQuery = useAccount();

    const accountConnected = !!accountQuery.data && !!accountQuery.data?.address;
    const connectedAddress = accountConnected ? accountQuery.data?.address : null;

    return (
        <GalleryContainer>
            <ProfileGallery filters={{ to: connectedAddress }} />
        </GalleryContainer>
    )
}

ProfilesIndex.getLayout = getSidebarLayout

export default ProfilesIndex