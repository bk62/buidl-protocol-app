import { useAccount, useNetwork } from "wagmi";


const useWalletConnected = () => {
    const accountQuery = useAccount();
    const { activeChain } = useNetwork();


    const { data, isSuccess } = accountQuery;

    const walletConnected = isSuccess && !!data && !!data?.address;
    const walletAddress = walletConnected ? data?.address : "";

    return { walletConnected, accountData: data, walletAddress, activeChain, ...accountQuery };
}

export default useWalletConnected;