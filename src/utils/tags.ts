
export type Tag = {
    value: string;
    label: string;
}

const tag_values = [
    'Chainlink',
    'Polygon',
    'IPFS',
    'Filecoin',
    'Python',
    'Brownie',
    'Javascript',
    'Typescript',
    'Next JS',
    'React JS',
    'Hardhat',
    'Solidity',
    'Ethereum',
    'Metamask',
    'The Graph',
    'DEFI',
    'NFT',
    'Art',
    'Music',
    'Public Good'
]

const Tags = tag_values.map((tag) => {
    return {
        label: tag,
        value: tag.replaceAll(' ', '').toLowerCase()
    }
})

export default Tags;