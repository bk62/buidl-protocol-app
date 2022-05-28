import React, { useMemo } from "react";
import {
    Flex,
    Progress,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    Center,
    Spinner,
    HStack,
    Link
} from "@chakra-ui/react";
import truncateMiddle from "truncate-middle";
import moment from "moment";


import ProfileBadges from "../profiles/ProfileBadges";

import useProfiles from "../../hooks/profiles/useProfiles";
import GalleryActionButton from "../common/GalleryActionButton";
import { ViewIcon, Copy } from "../../icons";

const columns = [
    {
        Header: "Handle",
        accessor: "handle"
    },
    {
        Header: "Created",
        accessor: "timestamp"
    },
    {
        Header: "Profile Type",
        accessor: "profileType"
    },
    {
        Header: "Metadata URI",
        accessor: "metadataURI"
    },
    {
        Header: "Actions",
        accessor: ""
    }
];

type Props = {
    filters?: any;
    empty?: React.ReactElement;
}

export default function ProfilesTable(props: Props) {
    const { filters, empty } = props;

    const query = useProfiles({ filters });

    const timeColor = useColorModeValue("gray.500", "gray.300");


    let { data: profiles } = query;

    if (query.isLoading) {
        return (
            <Center p={8}>
                <Spinner />
            </Center>
        );
    }

    if (query.isSuccess && query.data.length === 0) {
        if (!!empty) {
            return (
                <>
                    {empty}
                </>
            )
        }
        return (

            <Center p={8}>
                <Text color="text" fontSize="lg" fontWeight="thin">
                    Nothing to see here.
                </Text>
            </Center>

        )
    }

    return (
        <Table fontSize="sm" variant='striped' colorScheme='gray'>
            <Thead>
                <Tr>
                    {columns.map((column, ix) => (
                        <Th key={ix}>{column.Header}</Th>
                    ))}
                </Tr>
            </Thead>
            <Tbody>
                {profiles.map((profile, ix) => (
                    <Tr key={profile.handle}>
                        {
                            columns.map((column, ix) => {
                                if (column.Header === "Actions") {
                                    return <Td key={ix}>
                                        <GalleryActionButton href={`/profiles/${profile.handle}`} icon={<ViewIcon />} colorScheme="blue">View</GalleryActionButton>
                                    </Td>;

                                } else if (column.Header === "Metadata URI") {
                                    return <Td key={ix}>
                                        <Link isExternal href={profile[column.accessor]}>
                                            {truncateMiddle(profile[column.accessor] || "", 14, 14, "...")}
                                        </Link>
                                        <GalleryActionButton href={profile[column.accessor]} onClick={() => { navigator.clipboard.writeText(profile[column.accessor]); }} icon={<Copy />} colorScheme="gray"> </GalleryActionButton>
                                    </Td>
                                } else if (column.Header === "Created") {
                                    return (
                                        <Td key={ix}>
                                            <Text color={timeColor} fontSize="xs">
                                                {/* <TimeAgo date={Number(timestamp) * 1000} /> */}
                                                <time dateTime={moment.unix(parseInt(profile[column.accessor] || "")).format()}>{moment.unix(parseInt(profile[column.accessor] || "")).fromNow()}</time>
                                            </Text>
                                        </Td>
                                    )
                                } else if (column.Header === "Profile Type") {
                                    return (
                                        <Td key={ix}>
                                            <ProfileBadges profileType={profile[column.accessor]} fontSize="xs" fontWeight="thin" />
                                        </Td>
                                    )
                                }
                                else {
                                    return <Td key={ix}>{profile[column.accessor]}</Td>
                                }
                            })
                        }
                        {/* {JSON.stringify(profile, null, 2)} */}
                    </Tr>
                ))}
            </Tbody>
        </Table>
    )
}