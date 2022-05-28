import Davatar from "@davatar/react";
import React from "react";
import { Button, Flex, Text, useColorModeValue, Box } from "@chakra-ui/react";
import TimeAgo from "react-timeago";

import { constants } from "ethers";

import Card from "../../common/Card";
import CardHeader from "../../common/CardHeader";
import CardContent from "../../common/CardContent";
import AccountName from "../../auth/AccountName";
import EmptyListCTA from "../../common/EmptyListCTA";


const Investor = ({ investor }) => {
    const { investor: address, timestamp } = investor;
    let addrDisplay = address || constants.AddressZero;
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
                        size={50}
                    />
                </Box>
                <Flex direction='column'>
                    <Text fontSize='sm' color="text" fontWeight='bold'>
                        <AccountName address={addrDisplay} />
                    </Text>
                    <Text fontSize='xs' color='gray.500' fontWeight='400'>
                        0.1 ETH and 100 LINK Tokens
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


const Investors = ({ investors, ...props }) => {
    // console.log(investors);
    return (
        <Card p="16px" shadow="xs" {...props}>
            <CardHeader p='12px 5px' mb='12px'>
                <Text fontSize='lg' color="text" fontWeight='bold'>
                    Investors
                </Text>
            </CardHeader>
            <CardContent px='5px'>
                <Flex direction='column' w='100%'>
                    {investors.map((investor, ix) => (
                        <Investor investor={investor} key={ix} />
                    ))}
                    {investors.length === 0 && (
                        <EmptyListCTA cta="No investors yet" icon={null} />
                    )}
                </Flex>
            </CardContent>
        </Card>
    )
}


export default Investors;