import { useQuery } from "react-query";
import useBuidlHub from "../useBuidlHub";

const useProjectInvestors = (handle: string) => {
    const hub = useBuidlHub();
    const { data: profileId } = useQuery(
        ["profileId", handle], () => hub.getProjectIdByHandle(handle),
        {
            enabled: !!handle
        }
    )

    return useQuery(
        ["investors", handle], () => hub.getInvestors({ profileId }),
        {
            enabled: !!profileId,
            retry: false
        }
    )

}

export default useProjectInvestors;