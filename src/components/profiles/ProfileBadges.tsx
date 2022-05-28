import { Badge } from "@chakra-ui/react"
import { timestampIsNew } from "../../utils/helpers";
import { getProfileTypeBadge } from "../../utils/badgeHelpers";


export default function ProfileBadges({ timestamp = null, profileType, ...props }) {
    const { typeName, typeColor, typeVariant } = getProfileTypeBadge(profileType);

    return (
        <>
            {!!timestamp && timestampIsNew(timestamp) &&
                <Badge rounded="full" px="2" colorScheme="teal" {...props}>New</Badge>
            }

            <Badge rounded="full" px="2" colorScheme={typeColor} variant={typeVariant} ml={2} {...props}>{typeName}</Badge>

            {/* <Box
                        color="gray.500"
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="xs"
                        textTransform="uppercase"
                        ml="2"
                    >
                        {placeholder.numProjects} projects &bull; {placeholder.numBackers} backers
                    </Box> */}
        </>
    )
}