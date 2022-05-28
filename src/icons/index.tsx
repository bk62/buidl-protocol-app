import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandHoldingDollar, faEye, faVault, faWallet, faMoneyBillTrendUp, faPeopleGroup, faLightbulb, faRocket, faShuttleSpace, faArrowRight, faCarrot, faHorseHead, faQuestionCircle, faCopy, faUpload, faDownload } from '@fortawesome/free-solid-svg-icons'
import { Box } from '@chakra-ui/react'

export function BackIcon(props) {
    return <FontAwesomeIcon icon={faHandHoldingDollar} {...props} />
}

export function ViewIcon(props) {
    return <FontAwesomeIcon icon={faEye} {...props} />
}


export function VaultIcon(props) {
    return <Box as="span" color="blue.500"  {...props}><FontAwesomeIcon icon={faVault} /></Box>
}


export function WalletIcon(props) {
    return <FontAwesomeIcon icon={faWallet} {...props} />
}

export function InvestIcon(props) {
    return <FontAwesomeIcon icon={faMoneyBillTrendUp} {...props} />
}

export function DAO(props) {
    return <FontAwesomeIcon icon={faPeopleGroup} {...props} />
}

export function Idea(props) {
    return <FontAwesomeIcon icon={faLightbulb} {...props} />
}

export function Rocket(props) {
    return <FontAwesomeIcon icon={faRocket} {...props} />
}

export function Shuttle(props) {
    return <FontAwesomeIcon icon={faShuttleSpace} {...props} />
}

export function ArrowRight(props) {
    return <FontAwesomeIcon icon={faArrowRight} {...props} />
}

export function Carrot(props) {
    return <Box as="span" color="orange.500"  {...props}><FontAwesomeIcon icon={faCarrot} {...props} /></Box>
}

export function Horse(props) {
    return <Box as="span" color="orange.800" {...props}><FontAwesomeIcon icon={faHorseHead} {...props} /></Box>
}

export function Help(props) {
    return <FontAwesomeIcon icon={faQuestionCircle} {...props} />
}

export function Copy(props) {
    return <FontAwesomeIcon icon={faCopy} {...props} />
}

export function Upload(props) {
    return <FontAwesomeIcon icon={faUpload} {...props} />
}

export function Download(props) {
    return <FontAwesomeIcon icon={faDownload} {...props} />
}