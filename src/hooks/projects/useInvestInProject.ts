import { useMutation } from "react-query";
import useBuidlHub, { InvestInProjectData } from "../useBuidlHub";

const useInvestInProject = () => {
    const contract = useBuidlHub();

    return useMutation(async (investInProjectData: InvestInProjectData) => {
        const { erc20s, amounts } = investInProjectData;
        if (!!erc20s && !!amounts && erc20s.length !== 0 && erc20s.length === amounts.length) {
            await contract.approveERC20(erc20s[0], amounts[0])
        }
        await contract.invest(investInProjectData);
    })
}

export default useInvestInProject;