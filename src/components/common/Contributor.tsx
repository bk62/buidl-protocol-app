import Davatar from "@davatar/react";
import React from "react";
import { Button, Flex, Text, useColorModeValue, Box, StyleProps } from "@chakra-ui/react";
import TimeAgo from "react-timeago";

import { utils, constants } from "ethers";

import Card from "./Card";
import CardHeader from "./CardHeader";
import CardContent from "./CardContent";
import AccountName from "../auth/AccountName";
import EmptyListCTA from "./EmptyListCTA";
import useBuidlHub from "../../hooks/useBuidlHub";
import { useQueries } from "react-query";


const valueDisplayTmpl = (val, symbol) => `${val} ${symbol}`


export const Contributor = ({ contributorAddressKey = "contributor", profileOwner = "", value, erc20s, amounts, timestamp, ...rest }) => {
    let addrDisplay = rest[contributorAddressKey] || constants.AddressZero;

    const hub = useBuidlHub()

    const queries = useQueries(
        erc20s.map((erc20Addr) => {
            return {
                queryKey: ["erc20_metadata", erc20Addr],
                queryFn: async () => {
                    return hub.getERC20Metadata(erc20Addr);
                },
                staleTime: 10e100 // never expires
            }
        })
    )


    let valuesDisplay = "";

    if (queries.reduce((done, query) => done && !!query.data, true)) {
        const values: string[] = [];
        for (let i = 0; i < erc20s.length; i++) {
            values.push(valueDisplayTmpl(utils.formatEther(amounts[i]), queries[i].data.symbol));
        }
        if (parseFloat(value) > 0) {
            values.push(valueDisplayTmpl(utils.formatEther(value), 'MATIC'))
        }
        valuesDisplay = values.join(", ")
    }

    return (
        <Flex justifyContent='space-between' mb='21px'>
            <Flex align='center'>
                <Box
                    w='50px'
                    h='50px'
                    me='10px'
                >
                    <Davatar
                        address={addrDisplay}
                        size={42}
                    />
                </Box>
                <Flex direction='column'>
                    <Text fontSize='sm' color="text" fontWeight='bold'>
                        <AccountName address={addrDisplay} />
                    </Text>
                    <Text fontSize='xs' color='gray.500' fontWeight='400'>
                        {valuesDisplay}
                        <Text color="gray.200" fontSize="sm">
                            <TimeAgo date={timestamp * 1000} />
                        </Text>
                    </Text>
                </Flex>
            </Flex>
            {/* <Button p='0px' bg='transparent' variant='no-hover'>
                <Text
                    fontSize='sm'
                    fontWeight='600'
                    color='teal.300'
                    alignSelf='center'>
                    REPLY
                </Text>
            </Button> */}
        </Flex>
    )
}

export type ContributorsProps = { contributorAddressKey?: string, contributors: any[], title?: string, empty?: null | React.ReactElement } & StyleProps;

const Contributors = ({ contributorAddressKey = "contributor", contributors, title = "", empty = null, ...props }: ContributorsProps) => {
    return (
        <Card p="16px"  {...props} shadow="0" bg="bg.2">
            <CardHeader p='12px 5px' mb='12px'>
                <Text fontSize='lg' color="text" fontWeight='bold'>
                    {title || "Contributors"}
                </Text>
            </CardHeader>
            <CardContent px='5px'>
                <Flex direction='column' w='100%'>
                    {/* {JSON.stringify(contributors, null, 2)} */}
                    {!!contributors && contributors.map((c) => (
                        <Contributor contributorAddressKey={contributorAddressKey} {...c} />
                    ))}
                    {contributors.length === 0 && (
                        !!empty
                            ? (
                                <>
                                    {empty}
                                </>
                            )
                            : (
                                <EmptyListCTA cta="No contributors yet" />
                            )
                    )}
                </Flex>
            </CardContent>
        </Card>
    )
}


export default Contributors;