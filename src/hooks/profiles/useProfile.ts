import { useQuery } from "react-query";
import useBuidlHub from "../useBuidlHub";

export const useProfileIdByHandle = (handle: string) => {
    const hub = useBuidlHub();

    return useQuery(
        ["profileId", handle], () => hub.getProfileIdByHandle(handle),
        { enabled: !!handle }
    )
}


const useProfileByHandle = (handle: string) => {
    const hub = useBuidlHub();

    return useQuery(
        ["profile", handle], () => hub.getProfileByHandle(handle),
        {
            enabled: !!handle,
            retry: false
        }
    )
}


const useProfile = (handle: string | null | undefined, profileId: string | null | undefined) => {
    const hub = useBuidlHub();

    return useQuery(
        ["profile", handle, profileId], () => {
            if (!!handle) {
                return hub.getProfileByHandle(handle)
            } else if (!!profileId) {
                return hub.getProfileById(profileId)
            } else {
                // no info given
                throw new Error("Profile not found: not given handle or id.")
            }
        },
        {
            enabled: !!handle || !!profileId,
            retry: false
        }
    )
}

export default useProfile;