import NextLink from "next/link"
import {
    Box,
    chakra,
    Container,
    Link,
    Stack,
    Text,
    useColorModeValue,
    useBreakpointValue
} from '@chakra-ui/react';

export default function Logo(props: { parentProps?: any, svgProps?: any, textProps?: any }) {
    const { parentProps, svgProps, textProps } = props
    return (
        <Stack direction="row" color={useColorModeValue('gray.800', 'gray.200')} alignItems="center" {...parentProps}>
            <svg id="SVGRoot" height="28" version="1.1" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                {...svgProps}
            >
                <g strokeWidth=".79567">
                    <path d="m14.762 39.644c0 2.7714 2.3252 5.0192 5.1935 5.0192 2.8682 0 5.1935-2.2478 5.1935-5.0192 0-2.032-3.0486-3.9437-3.0486-7.5288 0-3.2266 3.0486-5.4967 3.0486-7.5288 0-2.7714-2.3252-5.0192-5.1935-5.0192-2.8682 0-5.1935 2.2478-5.1935 5.0192 0 2.032 3.0487 4.3022 3.0486 7.5288 0 3.2266-3.0486 5.4968-3.0486 7.5288z" />
                    <path d="m39.987 8.8094c0-2.7715 2.3252-5.0192 5.1934-5.0192s5.1935 2.2477 5.1935 5.0192c0 0.87271-0.56243 1.7233-1.2041 2.6938-0.85235 1.2891-1.8445 2.7897-1.8445 4.835 0 1.7989 0.94769 3.3006 1.7863 4.6294 0.66554 1.0545 1.2624 2.0002 1.2624 2.8993 0 0.12046-4e-3 0.24006-0.01303 0.35841 0.0087 0.11843 0.01303 0.23795 0.01303 0.35849 0 0.87271-0.56243 1.7233-1.2041 2.6938-0.85235 1.289-1.8445 2.7897-1.8445 4.835 0 1.7989 0.94769 3.3006 1.7863 4.6294 0.66554 1.0545 1.2624 2.0003 1.2624 2.8993 0 0.12054-4e-3 0.24006-0.01303 0.35849 0.0087 0.11843 0.01303 0.23795 0.01303 0.35849 0 0.89915-0.59683 1.8448-1.2624 2.8993-0.83859 1.3288-1.7863 2.8305-1.7863 4.6294 0 2.0453 0.9922 3.546 1.8445 4.835 0.64167 0.97049 1.2041 1.8211 1.2041 2.6938 0 2.7715-2.3252 5.0192-5.1935 5.0192s-5.1934-2.2477-5.1934-5.0192c0-0.89907 0.59683-1.8448 1.2623-2.8993 0.83867-1.3288 1.7864-2.8305 1.7864-4.6295 0-1.7989-0.94769-3.3006-1.7864-4.6294-0.66546-1.0545-1.2623-2.0002-1.2623-2.8993 0-0.12046 4e-3 -0.24006 0.01303-0.35841-0.0087-0.1185-0.01303-0.23803-0.01303-0.35856 0-0.89907 0.59683-1.8448 1.2623-2.8993 0.83867-1.3288 1.7864-2.8305 1.7864-4.6294 0-1.799-0.94769-3.3006-1.7864-4.6295-0.66546-1.0545-1.2623-2.0002-1.2623-2.8993 0-0.12054 4e-3 -0.24006 0.01303-0.35849-0.0087-0.11835-0.01303-0.23787-0.01303-0.35841 0-0.89915 0.59683-1.8448 1.2623-2.8993 0.83867-1.3288 1.7864-2.8305 1.7864-4.6294 0-1.799-0.94769-3.3006-1.7864-4.6295-0.66546-1.0545-1.2623-2.0002-1.2623-2.8993z" />
                    <path d="m32.568 52.549c-2.8682 0-5.1934-2.2477-5.1934-5.0192 0-0.89907 0.59683-1.8448 1.2623-2.8993 0.83867-1.3288 1.7864-2.8304 1.7864-4.6294 0-1.7989-0.94769-3.3006-1.7864-4.6294-0.66546-1.0545-1.2623-2.0003-1.2623-2.8993 0-0.12054 4e-3 -0.24006 0.01303-0.35849-0.0087-0.11843-0.01303-0.23795-0.01303-0.35849 0-0.89915 0.59683-1.8448 1.2623-2.8993 0.83867-1.3288 1.7864-2.8305 1.7864-4.6294 0-1.799-0.94769-3.3007-1.7864-4.6295-0.66546-1.0545-1.2623-2.0002-1.2623-2.8993 0-2.7715 2.3252-5.0192 5.1934-5.0192s5.1935 2.2477 5.1935 5.0192c0 0.87271-0.56235 1.7233-1.2041 2.6938-0.85234 1.289-1.8445 2.7897-1.8445 4.835 0 1.7989 0.94769 3.3006 1.7863 4.6294 0.66554 1.0545 1.2624 2.0002 1.2624 2.8993 0 0.12046-4e-3 0.24006-0.01303 0.35841 0.0087 0.11843 0.01303 0.23803 0.01303 0.35857 0 0.89907-0.59683 1.8448-1.2624 2.8993-0.83859 1.3288-1.7863 2.8305-1.7863 4.6294 0 2.0453 0.9922 3.5459 1.8445 4.835 0.64175 0.97049 1.2041 1.8211 1.2041 2.6938 0 2.7715-2.3252 5.0192-5.1935 5.0192z" />
                </g>
            </svg>
            <Text fontFamily={'heading'}
                fontWeight="bold"
                textAlign={useBreakpointValue({ base: 'left', md: 'left' })}
                {...textProps}
            >Buidl Protocol</Text>
        </Stack>
    );
};