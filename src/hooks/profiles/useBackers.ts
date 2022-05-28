import { useQuery } from "react-query";
import useBuidlHub from "../useBuidlHub";

const useBackers = ({ filters }) => {
    const hub = useBuidlHub();

    return useQuery(
        ["backers", filters], () => hub.getBackers(filters)
    )

}

export default useBackers;