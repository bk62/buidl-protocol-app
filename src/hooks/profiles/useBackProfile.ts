import { useMutation } from "react-query";
import useBuidlHub, { BackProfileData } from "../useBuidlHub";

function checkErc20sAmounts(erc20s, amounts) {
    return !!erc20s && !!amounts && erc20s.length !== 0 && erc20s.length === amounts.length;
}

const useBackProfile = () => {
    const contract = useBuidlHub();

    return useMutation(async (backProfileData: BackProfileData) => {
        const { erc20s, amounts } = backProfileData;
        if (!!erc20s && !!amounts && erc20s.length !== 0 && erc20s.length === amounts.length) {
            await contract.approveERC20(erc20s[0], amounts[0])
        }
        await contract.back(backProfileData);
    })
}

export default useBackProfile;