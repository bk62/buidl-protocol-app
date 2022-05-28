import { Badge } from "@chakra-ui/react"
import { timestampIsNew } from "../../utils/helpers";
// import { getProjectTypeBadge } from "../../utils/badgeHelpers";
import { ProjectTypeEnum, ProjectSizeEnum, ProjectStateEnum } from "../../hooks/useBuidlHub/types";


export default function ProfileBadges({ timestamp = null, projectType, projectSize, projectState, ...props }) {
    // const { typeName, typeColor, typeVariant } = getProjectTypeBadge(profileType);
    const type = ProjectTypeEnum[projectType]
    const size = ProjectSizeEnum[projectSize]
    const state = ProjectStateEnum[projectState]


    return (
        <>
            {!!timestamp && timestampIsNew(timestamp) &&
                <Badge rounded="full" px="2" colorScheme="teal" {...props}>New</Badge>
            }

            {/* <Badge rounded="full" px="2" colorScheme={typeColor} variant={typeVariant} ml={2} {...props}>{typeName}</Badge> */}

            <Badge rounded="full" px="2" colorScheme="cyan" variant="subtle" ml={2}  {...props}>{type}</Badge>
            <Badge rounded="full" px="2" colorScheme="gray" variant="subtle" ml={2}  {...props}>{size}</Badge>
            <Badge rounded="full" px="2" colorScheme="teal" variant="outline" ml={2}  {...props}>{state}</Badge>

            {/* <Box
                color="gray.500"
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                textTransform="uppercase"
                ml="2"
            >
                 {placeholder.numBackers} investors
            </Box> */}
        </>
    )
}