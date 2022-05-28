import React from "react";
import {
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    Center,
    Spinner,
    Link,
    useColorModeValue,
    VStack,
    Button
} from "@chakra-ui/react";
import truncateMiddle from "truncate-middle";
import moment from "moment";

import AccountName from "../auth/AccountName";
import useBackers from "../../hooks/profiles/useBackers";
import GalleryActionButton from "../common/GalleryActionButton";
import { ViewIcon, Copy } from "../../icons";

const columns = [
    {
        Header: "Profile",
        accessor: "profileId"
    },
    {
        Header: "Backed at",
        accessor: "timestamp"
    },
    {
        Header: "Details",
        accessor: "profileType"
    },
    // {
    //     Header: "Backed Module Details",
    //     accessor: "moduleData"
    // // },
    // {
    //     Header: "Backed NFT",
    //     accessor: "metadataURI"
    // },
    {
        Header: "Actions",
        accessor: ""
    }
];

type Props = {
    filters?: any;
    empty?: React.ReactElement;
}

export default function BackedProfilesTable(props: Props) {
    const { filters, empty } = props;

    const query = useBackers({ filters });

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
        <Table>
            <Thead>
                <Tr>
                    {columns.map((column, ix) => (
                        <Th key={ix}>{column.Header}</Th>
                    ))}
                </Tr>
            </Thead>
            <Tbody>
                {profiles.map((profile, ix) => (
                    <Tr key={profile.profileId}>
                        {
                            columns.map((column, ix) => {
                                if (column.Header === "Actions") {
                                    return <Td key={ix}>
                                        <GalleryActionButton href={`/profiles/${profile.profileId}?isId=true`} icon={<ViewIcon />} colorScheme="blue">View</GalleryActionButton>
                                    </Td>;

                                    // } else if (column.Header === "Metadata URI") {
                                    //     return <Td key={ix}>
                                    //         <Link isExternal href={profile[column.accessor]}>
                                    //             {truncateMiddle(profile[column.accessor] || "", 14, 14, "...")}
                                    //         </Link>
                                    //         <GalleryActionButton href={profile[column.accessor]} onClick={() => { navigator.clipboard.writeText(profile[column.accessor]); }} icon={<Copy />} colorScheme="gray"> </GalleryActionButton>
                                    //     </Td>
                                } else if (column.Header === "Backed at") {
                                    return (
                                        <Td key={ix}>
                                            <Text color={timeColor} fontSize="xs">
                                                <time dateTime={moment.unix(parseInt(profile.timestamp || "")).format()}>{moment.unix(parseInt(profile.timestamp || "")).fromNow()}</time>
                                            </Text>
                                        </Td>
                                    )
                                } else if (column.Header === "Details") {
                                    return (
                                        <Td key={ix}>
                                            <VStack align="center" justify="center">
                                                <Text fontSize='sm' color="text" fontWeight='bold'>
                                                    Back NFT Contract: <AccountName address={profile.backNft.toString()} />
                                                    <Button size="sm" variant="link" ml={1} onClick={() => { navigator.clipboard.writeText(profile.backNft.toString()); }} leftIcon={<Copy />} colorScheme="gray"> </Button>
                                                </Text>
                                                <Text fontSize='xs' color='gray.500' fontWeight='400'>
                                                    Back NFT Token Id: {profile.backNftTokenId.toString()}
                                                </Text>

                                            </VStack>
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