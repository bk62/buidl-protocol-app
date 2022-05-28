import { useMutation } from "react-query";
import useBuidlHub, { BackModuleInitData } from "../useBuidlHub";
import { ProfileTypeEnum } from "../useBuidlHub/types"

interface CreateProfileData {
    handle: string,
    metadataURI: string,
    to: string,
    profileType: ProfileTypeEnum,
    githubUsername: string,

    backModuleInitData: BackModuleInitData | null,
};

const useCreateProfile = () => {
    const contract = useBuidlHub();

    return useMutation(async (profileData: CreateProfileData) => {
        await contract.createProfile(profileData);
    })
}

export default useCreateProfile;