import { BigNumber } from "ethers";
import { useMutation } from "react-query";
import useBuidlHub from "../useBuidlHub";
import { ProjectTypeEnum, ProjectSizeEnum, ProjectStateEnum } from "../useBuidlHub/types"

interface CreateProjectData {
    profileId: BigNumber | string | number,
    handle: string,
    metadataURI: string,
    to: string,
    projectType: ProjectTypeEnum,
    projectSize: ProjectSizeEnum,
    projectState: ProjectStateEnum
};

const useCreateProject = () => {
    const contract = useBuidlHub();

    return useMutation(async (projectData: CreateProjectData) => {
        await contract.createProject(projectData);
    })
}

export default useCreateProject;