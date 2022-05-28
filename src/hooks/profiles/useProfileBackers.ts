import { useQuery } from "react-query";
import useBuidlHub from "../useBuidlHub";

const useProfileBackers = (handle: string | null | undefined, profileId: string | number | null | undefined) => {
    const hub = useBuidlHub();

    // Only query when handle defined and not profile id
    const { data: profileId2 } = useQuery(
        ["profileId", handle], () => hub.getProfileIdByHandle(handle || ""),
        {
            enabled: !!handle && !!!profileId
        }
    )
    if (!!!profileId && !!profileId2) {
        profileId = profileId2;
    }

    return useQuery(
        ["backers", handle], () => hub.getBackers({ profileId }),
        {
            enabled: !!profileId,
            retry: false
        }
    )

}

export default useProfileBackers;