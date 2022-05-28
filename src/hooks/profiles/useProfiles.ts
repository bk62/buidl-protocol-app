import { useQuery } from "react-query";
import useBuidlHub from "../useBuidlHub";

const useProfiles = ({ filters }) => {
    const hub = useBuidlHub();
    return useQuery(
        ["profiles", filters], () => hub.getProfiles(filters)
    )
}

export default useProfiles;