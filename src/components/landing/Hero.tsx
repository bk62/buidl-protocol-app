import Head from 'next/head';
import {
  Flex,
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  createIcon,
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import NextLink from "next/link";


export function Hero() {
  return (
    <>
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}>
          <Heading
            // fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            fontWeight={{ base: 'bold', sm: 'semibold', md: 'extrabold' }}
            lineHeight={'110%'}>
            Get paid to{" "}
            <Text as={'span'} color={'green.400'}>
              build your awesome Web3 projects
            </Text>
          </Heading>
          <Text color={'gray.500'}>
            We help you raise funds at every stage of your Web3 #BUIDL projects so you can focus on learning, building cool projects and your community.
          </Text>
          <Stack
            direction={'row'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}>
            <NextLink href={"/dashboard"} passHref>
              <Button
                colorScheme={'green'}
                bg={'green.400'}
                size={'lg'}
                px={5}
                py={3}
                border="solid transparent"
                rounded="md"
                shadow="md"
                _hover={{
                  bg: 'green.500',
                }}
                rightIcon={<ArrowForwardIcon />}
                fontWeight="bold"
              >
                Buidl to Earn
              </Button>
            </NextLink>
            <Button
              size={'lg'}
              px={5}
              py={3}
              border="solid transparent"
              rounded="md"
              shadow="md"
              fontWeight="bold"
            >
              How it works
            </Button>
          </Stack>
          <br /><br />
          <Text color={'gray.500'}>
            1. Learn to Earn: RabbitHole and Pointer
          </Text>
          <Text color={'gray.500'}>
            2. Build your own projects to Earn: Buidl Protocol!
          </Text>
          <Text color={'gray.500'}>
            3. Develop to Earn: Gitcoin
          </Text>
        </Stack>
      </Container>
    </>
  );
}
