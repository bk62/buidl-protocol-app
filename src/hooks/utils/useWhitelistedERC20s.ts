import { useQuery } from "react-query";
import useBuidlHub from "../useBuidlHub";


function sortERC20Events(ev1, ev2) {
    return ev1.timestamp - ev2.timestamp;
}

const useWhitelistedERC20s = (filters = {}) => {
    const hub = useBuidlHub();

    const query = useQuery(
        ["erc20s"], async () => {
            const events = await hub.getWhitelistedERC20s(filters);
            // handle whitelist toggling
            const erc20s = {};
            // assuming events are pre-sorted by timestamps
            for (const evt of events) {
                erc20s[evt.currency] = evt;
            }
            return Object.values(erc20s);
        }
    )

    return query;


}



export default useWhitelistedERC20s;