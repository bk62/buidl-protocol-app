import { useQuery } from "react-query";
import useBuidlHub from "../useBuidlHub";

export const useProjectIdByHandle = (handle: string) => {
    const hub = useBuidlHub();

    return useQuery(
        ["projectId", handle], () => hub.getProjectIdByHandle(handle)
    )
}

const useProjectByHandle = (handle: string) => {
    const hub = useBuidlHub();

     return useQuery(
        ["project", handle], () => hub.getProjectByHandle(handle),
        {
            enabled: !!handle,
            retry: false
        }
    )
}


export default useProjectByHandle;