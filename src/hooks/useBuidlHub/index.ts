import * as wagmi from "wagmi"
import { useProvider, useSigner } from "wagmi"
import { BigNumber, constants, utils } from "ethers"
import { AbiCoder } from "ethers/lib/utils";

// import ABI TODO npm etc
import ERC20 from "../../../../buidl-protocol/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json";
import BuidlHub from "../../../../buidl-protocol/artifacts/contracts/core/BuidlHub.sol/BuidlHub.json";
import YieldTrustVault from "../../../../buidl-protocol/artifacts/contracts/defi/YieldTrustVault.sol/YieldTrustVault.json";
import Events from "../../../../buidl-protocol/artifacts/contracts/libraries/Events.sol/Events.json";
import addresses from "../../../../buidl-protocol/addresses.json";
import { DataTypes } from "../../../../buidl-protocol/typechain/BuidlHub";
import { ethers } from "ethers";
import { timeStamp } from "console";
import ProfilesIndex from "../../pages/profiles";
import { parseEther } from "ethers/lib/utils";


export const YieldTrustVaultContract = YieldTrustVault;

export type BackProfileData = {
    handle?: string,
    moduleData?: string,
    value: string,
    erc20s?: string[],
    amounts?: string[]
    walletAddress?: string
}

export type InvestInProjectData = {
    handle?: string,
    moduleData?: string,
    value: string,
    erc20s?: string[],
    amounts?: string[]
}



function convertBNArray(bnArray) {
    return bnArray.map((bn) => bn.toString())
}

export type BackModuleInitData = {
    name: string, symbol: string, tokenPrice: string
}

const useBuidlHub = () => {
    const { data: signer } = useSigner();
    const provider = useProvider();

    const hubContract = wagmi.useContract({
        addressOrName: addresses["hub"],
        contractInterface: BuidlHub.abi,
        signerOrProvider: signer || provider,
    });

    const eventsContract = wagmi.useContract({
        addressOrName: addresses["hub"],
        contractInterface: Events.abi,
        signerOrProvider: signer || provider
    });



    type ProfilesFilter = {
        profileId?: BigNumber | string | number | null;
        creator?: string | null,
        to?: string | null
    }

    const getAccountNumProfiles = async (address) => {
        // return profile NFT balance of address
        return await hubContract.balanceOf(address);
    }

    const getProfiles = async (filters: ProfilesFilter = { profileId: null, creator: null, to: null }) => {
        console.log("getProfiles")
        const filter = eventsContract.filters.ProfileCreated(
            filters.profileId,
            filters.creator,
            filters.to,
            null, // uri
            null, // misc metadata
            null // timestamp
        )
        // console.log(filters)
        // console.log(filter);
        return eventsContract.queryFilter(filter).then(
            (events) => events.map(
                ({ args: [profileId, creator, to, handle, metadataURI, encodedProfile, moduleData, timestamp] }) => {
                    const metadata = ethers.utils.defaultAbiCoder.decode(["tuple(uint8 type, address backModule) metadata"], encodedProfile);
                    return ({
                        profileId: profileId.toString(),
                        creator,
                        to,
                        handle,
                        metadataURI, metadata: metadata[0],
                        moduleData,
                        timestamp: timestamp.toString(),
                        profileType: metadata[0][0].toString()
                    })
                }
            )
        )
    }

    const isProfileCreatorWhitelisted = async ({ account }): Promise<boolean> => {
        return await hubContract.isProfileCreatorWhitelisted(account);
    }

    const createProfile = async ({ to, handle, metadataURI, profileType, backModule = null, backModuleInitData = null, githubUsername }:
        { to: string, handle: string, metadataURI: string, profileType: string | number, backModule?: string | null, backModuleInitData: BackModuleInitData | null, githubUsername: string }
    ): Promise<void> => {

        let encodedBackModuleInitData = constants.AddressZero;
        if (!!backModuleInitData) {
            const abiCoder = new AbiCoder();
            encodedBackModuleInitData = abiCoder.encode(
                // name, symbol, tokenPriceInUsd 
                ["string", "string", "uint256"],
                // [`profile-${profileIx}-bucks`, `P${profileIx}`, utils.parseEther("1")]
                [backModuleInitData.name, backModuleInitData.symbol, utils.parseEther(backModuleInitData.tokenPrice)]
            )
            backModule = addresses["backErc20IcoModule"];
            // alert(JSON.stringify([backModuleInitData.name, backModuleInitData.symbol, utils.parseEther(backModuleInitData.tokenPrice).toString()], null, 2))
        }
        const profileData: DataTypes.CreateProfileDataStruct = {
            to,
            handle,
            metadataURI,
            profileType,
            backModule: backModule ?? constants.AddressZero,
            backModuleInitData: encodedBackModuleInitData,
            githubUsername
        };
        // console.log(JSON.stringify(profileData, null, 2));
        const tx = await hubContract.createProfile(profileData);
        await tx.wait(1);
    }

    const getProfileIdByHandle = async (handle: string) => {
        // alert(`Get id by handle ${handle}`)
        try {
            return await hubContract
                .getProfileIdByHandle(handle)
            // .then((idBN: BigNumber) => idBN.toString());
        } catch (e) {
            if (/ProfileNotFound/.test(e.error?.data?.message)) {
                throw new Error("ProfileNotFound");
            } else {
                throw e;
            }
        }

    }

    const getProfileById = async (id: string | number): Promise<DataTypes.ProfileStructStruct> => {
        return await hubContract.getProfile(id);
    }

    const getProfileByHandle = async (handle: string): Promise<DataTypes.ProfileStructStruct> => {
        try {
            return await hubContract.getProfileByHandle(handle);
        } catch (e) {
            if (/ProfileNotFound/.test(e.error?.data?.message)) {
                throw new Error("ProfileNotFound");
            } else {
                throw e;
            }
        }
    }

    const getProfileBackModule = async (profileId: string | number) => {
        // TODO assuming only one module -- or just returning last one
        const filter = eventsContract.filters.BackModuleSet(profileId);
        return eventsContract.queryFilter(filter).then(
            (events) => events.map(
                ({ args: [profileId, backModule, moduleReturnData, timestamp] }) => {
                    // TODO assuming only one type of back module
                    // alert(`got return data ${JSON.stringify([profileId, backModule], null, 2)} ${moduleReturnData}`)
                    const abiCoder = new AbiCoder();
                    const metadata = abiCoder.decode(["string", "string", "uint256", "address"], moduleReturnData);
                    // alert(JSON.stringify(metadata, null, 2))
                    return ({
                        profileId: profileId.toString(),
                        backModule,
                        decodedModuleReturnData: metadata[0],
                        moduleReturnData,
                        timestamp: timestamp.toString(),
                        name: metadata[0].toString(),
                        symbol: metadata[1].toString(),
                        tokenPriceInUsd: utils.formatEther(metadata[2]),
                        erc20Address: metadata[3],
                    })
                }
            )
        )
    }

    const getProfileOwner = async (profileId) => {
        return await hubContract.ownerOf(profileId);
    }

    const getProjects = async ({ profileId = null, creator = null, }: { profileId?: null | number, creator?: string | null }) => {
        if (typeof profileId === "string") {
            profileId = parseInt(profileId)
        }
        const filter = eventsContract.filters.ProjectCreated(profileId, null, creator, null);

        return eventsContract.queryFilter(filter).then(
            (events) => events.map(
                ({ args: [profileId, projectId, creator, handle, metadataURI, encodedMetadata, moduleData, timestamp] }) => {
                    const metadata = ethers.utils.defaultAbiCoder.decode(["tuple(uint8 type, uint8 size, uint8 state) metadata"], encodedMetadata);
                    return ({
                        profileId: profileId.toString(),
                        projectId: projectId.toString(),
                        creator,
                        handle,
                        metadataURI,
                        metadata: metadata[0],
                        moduleData,
                        timestamp: timestamp.toString(),
                        projectType: metadata[0][0].toString(),
                        projectSize: metadata[0][1].toString(),
                        projectState: metadata[0][2].toString()
                    })
                }
            )
        )
    }

    const createProject = async ({ profileId, metadataURI, handle, projectSize, projectType, projectState, githubRepoName, investModule = null }) => {
        const projectData: DataTypes.CreateProjectDataStruct = {
            profileId,
            metadataURI,
            handle,
            projectSize,
            projectType,
            projectState,
            investModule: investModule ?? constants.AddressZero,
            investModuleInitData: constants.AddressZero,
            githubRepoName
        };
        // console.log(projectData)
        const tx = await hubContract.createProject(projectData);
        await tx.wait(1);
    }

    const getProjectById = async (profileId, projectId) => {
        const tx = await hubContract.getProject(profileId, projectId);
        return tx.wait();
    }

    const getProjectIdByHandle = async (handle) => {
        return hubContract.getProjectIdsByHandle(handle);
    }

    const getProjectByHandle = async (handle) => {
        return hubContract.getProjectByHandle(handle);
    }

    const getBackers = async ({ profileId = null, backer = null, profileOwner = null }: {
        profileId: string | null | number,
        backer: string | null,
        profileOwner: string | null
    }) => {
        if (typeof profileId === "string") {
            profileId = parseInt(profileId)
        }
        const filter = eventsContract.filters.Backed(backer, profileId, profileOwner);
        return eventsContract.queryFilter(filter).then(
            (events) => events.map(
                ({ args: [backer, profileId, profileOwner, moduleData, value, erc20s, amounts, tokenId, backNft, timestamp] }) =>
                ({
                    backer, profileId: profileId.toString(), profileOwner, moduleData, value: value.toString(),
                    erc20s: convertBNArray(erc20s), amounts: convertBNArray(amounts), timestamp: timestamp.toString(),
                    backNftTokenId: tokenId, backNft
                })
            )
        )
    }


    const back = async ({ handle, value = '0', erc20s = [], amounts = [], walletAddress }: BackProfileData) => {
        // alert(`backing erc20 for amounts ${amounts}, ${amounts.map((value) => utils.parseEther(value).toString())
        //     }`);
        const profileId = await hubContract.getProfileIdByHandle(handle);
        // console.log(profileId, handle, value, utils.parseEther(value).toString());

        const abiCoder = new AbiCoder();
        const valueBN = utils.parseEther(value)
        const native = valueBN.gt("0")
        const moduleData = abiCoder.encode(
            // paymentCurrency, bool isMatic, amount , receiver
            ["address", "bool", "uint256", "address"],
            // [erc20 address if applicable or address 0, is  matic amount > 0, amount]
            [native ? constants.AddressZero : erc20s[0], native, native ? valueBN : parseEther(amounts[0]), walletAddress]
        )
        const tx = await hubContract.back(
            profileId,
            moduleData,
            erc20s,
            amounts.map((value) => utils.parseEther(value)),
            { value: utils.parseEther(value) }
        );
        const rc = tx.wait(1);
        return await rc;
    }

    const getInvestors = async ({ profileId = null, projectId = null, investor = null }: {
        profileId: string | number | null, projectId: string | number | null, investor: string | null
    }) => {
        if (typeof profileId === "string") {
            profileId = parseInt(profileId)
        }
        if (typeof projectId === "string") {
            projectId = parseInt(projectId)
        }
        const filter = eventsContract.filters.Invested(investor, profileId, projectId);
        return eventsContract.queryFilter(filter).then(
            (events) => events.map(
                ({ args: [investor, profileId, projectId, profileOwner, moduledata, value, erc20s, amounts, investNftTokenId, timestamp] }) =>
                ({
                    investor, profileId: profileId.toString(), projectId: projectId.toString(), profileOwner, moduledata, value: value.toString(),
                    erc20s: convertBNArray(erc20s), amounts: convertBNArray(amounts), timestamp: timestamp.toString(),
                    investNftTokenId: investNftTokenId.toString()
                })
            )
        )
    }

    const invest = async ({ handle, moduleData = constants.AddressZero, value = '0', erc20s = [], amounts = []
    }: InvestInProjectData) => {
        const [profileId, projectId] = await hubContract.getProjectIdsByHandle(handle);
        const tx = await hubContract.invest(
            profileId,
            projectId,
            moduleData,
            erc20s,
            amounts.map((value) => utils.parseEther(value)),
            { value: utils.parseEther(value) }
        );
        const rc = tx.wait(1);
        return await rc;
    }

    const getWhitelistedERC20s = async ({ erc20 = null }) => {
        // might be whitelisted or de-whitelisted events
        const filter = eventsContract.filters.ERC20Whitelisted(erc20);
        return eventsContract.queryFilter(filter).then(
            (events) => events.map(
                ({ args: [erc20, whitelisted, timestamp] }) =>
                    ({ erc20, whitelisted, timestamp })
            )
        )
    }

    const getERC20Metadata = async (addr) => {
        const erc20 = new ethers.Contract(addr, ERC20.abi, signer || provider);
        return await Promise.all([erc20.name(), erc20.symbol(), erc20.decimals()]).then(([name, symbol, decimals]) => {
            console.log(name, symbol, decimals);
            return { name, symbol, decimals };
        });
    }

    const approveERC20 = async (erc20Addr, amount) => {
        // alert(`Approving erc20 for amount ${amount}, ${utils.parseEther(amount)}`);
        const erc20 = new ethers.Contract(erc20Addr, ERC20.abi, signer || provider);
        const tx = await erc20.approve(addresses['hub'], utils.parseEther(amount));
        return await tx.wait(1);
    }

    const getYieldTrusts = async ({ profileId = null, erc20 = null, recipient = null }:
        { profileId: null | string | number, erc20: null | string, recipient: string | null }) => {
        if (typeof profileId === "string") {
            profileId = parseInt(profileId)
        }
        const filter = eventsContract.filters.YieldTrustCreated(profileId, erc20, recipient);
        return eventsContract.queryFilter(filter).then(
            (events) => events.map(
                ({ args: [profileId, erc20, recipient, vault, creator, timestamp] }) => {
                    return ({ profileId: profileId.toString(), erc20, recipient, vault, creator, timestamp })
                }
            )
        )
    }

    const createYieldTrust = async ({ profileId, currency }) => {
        const yieldTrust: DataTypes.YieldTrustStructStruct = {
            profileId,
            currency,
            vault: constants.AddressZero // always 0 b/c created by hub after caling create
        };
        const tx = await hubContract.createYieldTrust(yieldTrust);
        await tx.wait(1);
    }

    const getYieldTrust = async (profileId, currency) => {
        const tx = await hubContract.getYieldTrust(profileId, currency);
        return tx.wait();
    }

    const getYieldTrustDeposits = async ({ profileId, currency, receiver = null }) => {
        if (typeof profileId === "string") {
            profileId = parseInt(profileId)
        }
        const filter = eventsContract.filters.YieldTrustDeposited(profileId, currency, null, receiver);
        return eventsContract.queryFilter(filter).then(
            (events) => events.map(
                ({ args: [profileId, erc20, amount, receiver, vault, timestamp] }) => {
                    return ({ profileId: profileId.toString(), erc20, amount: amount.toString(), receiver, vault, timestamp })
                }
            )
        )
    }


    return {
        // Contracts
        hubContract,
        eventsContract,

        // Profiles:
        getAccountNumProfiles,
        getProfiles,
        isProfileCreatorWhitelisted,
        createProfile,
        getProfileIdByHandle,
        getProfileById,
        getProfileByHandle,
        getProfileOwner,
        getProfileBackModule,
        // profile funding
        back,
        getBackers,

        // Projects:
        getProjects,
        createProject,
        getProjectIdByHandle,
        getProjectById,
        getProjectByHandle,
        // project funding
        invest,
        getInvestors,

        // erc 20s
        getWhitelistedERC20s,
        getERC20Metadata,
        approveERC20,

        // Yield Trusts:
        createYieldTrust,
        getYieldTrust,
        getYieldTrusts,
        getYieldTrustDeposits,
    }
}

export const useVault = (vaultAddr) => {
    const { data: signer } = useSigner();
    const provider = useProvider();

    const vaultContract = wagmi.useContract({
        addressOrName: vaultAddr,
        contractInterface: YieldTrustVault.abi,
        signerOrProvider: signer || provider,
    });

    const getVaultBalance = async (walletAddress) => {
        return vaultContract.balanceOf(walletAddress);
    }

    const approveERC20 = async (erc20Addr, amount) => {
        const erc20 = new ethers.Contract(erc20Addr, ERC20.abi, signer || provider);
        const tx = await erc20.approve(vaultAddr, utils.parseEther(amount));
        return tx.wait(1);
    }

    return {
        vaultContract,

        getVaultBalance,
        approveERC20,
    }
}


export default useBuidlHub;