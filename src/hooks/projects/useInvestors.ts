import { useQuery } from "react-query";
import useBuidlHub from "../useBuidlHub";

const useInvestors = ({ filters }) => {
    const hub = useBuidlHub();

    return useQuery(
        ["investors", filters], () => hub.getInvestors(filters)
    )

}

export default useInvestors;