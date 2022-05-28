import axios from "axios";
import moment from "moment";

export function isValidIpfsUrl(url) {
    return /^ipfs:\/\/[a-zA-Z0-9\/\.]+$/.test(url)
}

export function ipfsUrlToNftStorageUrl(url) {
    const ipfsUrl = new URL(url);
    const cid = ipfsUrl.host;
    const path = ipfsUrl.pathname;
    return `https://nftstorage.link/ipfs/${cid}${path}`
}


export async function readMetadataJSON(ipfsUrl) {
    console.log("Read metadata json called", ipfsUrl);
    if (!isValidIpfsUrl(ipfsUrl)) return { httpUrl: null, data: null }
    const httpUrl = ipfsUrlToNftStorageUrl(ipfsUrl);
    console.log("httpUrl is ", httpUrl);
    try {
        const res = await axios.get(httpUrl);
        console.log("success");
        return { httpUrl, data: res.data };
    } catch (e) {
        console.log("Error reading IPFS metdata: ", httpUrl, ipfsUrl);
        throw e;
    }
}



export function addERC20ToMetamask(address, symbol, decimals = 18) {
    return window.ethereum && window.ethereum
        .request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: address,
                    symbol: symbol,
                    decimals: decimals,
                    // image: 'https://foo.io/token-image.svg',
                },
            },
        })
        .then((success) => {
            if (success) {
                console.log(`ERC-20 ${symbol} successfully added to wallet!`);
            } else {
                throw new Error(`Something went wrong while adding ERC-20 ${symbol} to wallet.`);
            }
        })
        .catch((e) => { console.error(e); throw e; });
}



export function timestampIsNew(timestamp) {
    return moment.unix(parseInt(timestamp || "")).isAfter(moment().subtract(1, "months"));
}