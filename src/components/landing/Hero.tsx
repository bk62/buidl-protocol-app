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
            Make money from{" "}
            <Text as={'span'} color={'green.400'}>
              your audience
            </Text>
          </Heading>
          <Text color={'gray.500'}>
            Monetize your content by charging your most loyal readers and reward
            them loyalty points. Give back to your loyal readers by granting
            them access to your pre-releases and sneak-peaks.
          </Text>
          <Stack
            direction={'row'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}>
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
              Get Started
            </Button>
            <Button
              size={'lg'}
              px={5}
              py={3}
              border="solid transparent"
              rounded="md"
              shadow="md"
              fontWeight="bold"
            >
              Learn more
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
