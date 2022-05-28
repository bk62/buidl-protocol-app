import { useQuery } from "react-query";
import useBuidlHub from "../useBuidlHub";

const useProjects = (handle: string) => {
    const hub = useBuidlHub();
    const {data: profileId} = useQuery(
        ["profileId", handle], () => hub.getProfileIdByHandle(handle),
        {
            enabled: !!handle
        }
    )

    return useQuery(
        ["projects", handle], () => hub.getProjects({profileId}),
        {
            enabled: !!profileId,
            retry: false
        }
    )

}

export default useProjects;