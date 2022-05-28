import { useMutation } from "react-query";
import useBuidlHub from "../useBuidlHub";


const useCreateYieldTrust = () => {
    const contract = useBuidlHub();

    return useMutation(async (data: { profileId: string, currency: string }) => {
        await contract.createYieldTrust(data);
    })
}

export default useCreateYieldTrust;