
import * as React from "react";
import truncateMiddle from "truncate-middle";
import { useEnsName } from "wagmi";
import { Text, TextProps } from "@chakra-ui/react";

interface AccountNameProps extends TextProps {
    address: string;
    resolveENS?: boolean;
    start?: number;
    end?: number;
}

const AccountName: React.FunctionComponent<AccountNameProps> = ({ resolveENS = false, address, start = 4, end = 4, ...props }) => {
    let ensName: boolean | string = false;
    if (resolveENS) {
        const query = useEnsName({ address });
        ensName = query.data ? query.data : false;
    }
    return (
        <Text
            display="inline"
            textTransform={ensName ? "none" : "lowercase"}
            {...props}
        >
            {ensName || truncateMiddle(address || "", start, end, "...")}
        </Text>
    )

}

export default AccountName;