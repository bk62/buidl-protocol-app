import { useQuery } from "react-query";
import useBuidlHub from "../useBuidlHub";

const useYieldTrusts = ({ filters }) => {
    const hub = useBuidlHub();
    return useQuery(
        ["yield_trusts", filters], () => hub.getYieldTrusts(filters)
    )
}

export default useYieldTrusts;