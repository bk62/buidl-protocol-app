import React, { ReactElement, useMemo } from "react";
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

import ProjectBadges from "../projects/ProjectBadges";

import useProjectsGallery from "../../hooks/projects/useProjectsGallery";
import GalleryActionButton from "../common/GalleryActionButton";
import { ViewIcon, Copy } from "../../icons";


const columns = [
    {
        Header: "Handle",
        accessor: "handle"
    },
    // {
    //     Header: "Name",
    //     accessor: "name"
    // },
    {
        Header: "Created",
        accessor: "timestamp"
    },
    {
        Header: "Project Type",
        accessor: "projectType"
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

type ProjectsTableProps = {
    filters?: any;
    empty?: ReactElement;
}

export default function ProjectsTable(props: ProjectsTableProps) {
    const { filters, empty } = props;

    const query = useProjectsGallery({ filters });

    const timeColor = useColorModeValue("gray.500", "gray.300");



    let { data: projects } = query;

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
                {projects.map((project, ix) => (
                    <Tr key={project.handle}>
                        {
                            columns.map((column, ix) => {
                                if (column.Header === "Actions") {
                                    return <Td key={ix}>
                                        <GalleryActionButton href={`/projects/${project.handle}`} icon={<ViewIcon />} colorScheme="blue">View</GalleryActionButton>
                                    </Td>;
                                } else if (column.Header === "Metadata URI") {
                                    return <Td key={ix}>
                                        <Link isExternal href={project[column.accessor]}>
                                            {truncateMiddle(project[column.accessor] || "", 4, 4, "...")}
                                        </Link>
                                        <GalleryActionButton onClick={() => { navigator.clipboard.writeText(project[column.accessor]); }} href={`#`} icon={<Copy />} colorScheme="gray"> </GalleryActionButton>
                                    </Td>
                                } else if (column.Header === "Created") {
                                    return (
                                        <Td key={ix}>
                                            <Text color={timeColor} fontSize="xs">
                                                {/* <TimeAgo date={Number(timestamp) * 1000} /> */}
                                                <time dateTime={moment.unix(parseInt(project[column.accessor] || "")).format()}>{moment.unix(parseInt(project[column.accessor] || "")).fromNow()}</time>
                                            </Text>
                                        </Td>
                                    )
                                } else if (column.Header === "Project Type") {
                                    return (
                                        <Td key={ix}>
                                            <ProjectBadges
                                                {...{
                                                    timestamp: project.timestamp,
                                                    projectType: project.projectType,
                                                    projectSize: project.projectSize,
                                                    projectState: project.projectState
                                                }}
                                                fontSize="xs"
                                                fontWeight="thin"
                                            />
                                        </Td>
                                    )
                                }
                                else {
                                    return <Td key={ix}>{project[column.accessor]}</Td>
                                }
                            })
                        }
                        {/* {JSON.stringify(project, null, 2)} */}
                    </Tr>
                ))}
            </Tbody>
        </Table>
    )
}