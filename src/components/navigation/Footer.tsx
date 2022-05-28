import NextLink from "next/link"
import {
  Box,
  chakra,
  Container,
  Link,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import { FaDiscord, FaGithub, FaTelegram, FaTwitter } from 'react-icons/fa';
import { ReactNode } from 'react';

import Logo from "../Logo"

const SocialButton = ({
  children,
  label,
  href
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      target="_blank"
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}>
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export function Footer() {
  return (
    <Box
      as="footer"
      transition="3s ease"
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      borderTop={1}
      borderStyle={'solid'}
      borderColor={useColorModeValue('gray.200', 'gray.900')}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        fontSize="sm"
        py={4}
        spacing={4}
        justify={'center'}
        align={'center'}>
        <Logo />
        <Stack direction={'row'} spacing={6} flexWrap="wrap">
          <NextLink href="/" passHref>
            <Link>Home</Link>
          </NextLink>
          <NextLink href="/profiles" passHref>
            <Link>Profiles</Link>
          </NextLink>
          <NextLink href="/projects" passHref>
            <Link>Projects</Link>
          </NextLink>
          <NextLink href="/about" passHref>
            <Link>About</Link>
          </NextLink>
          <NextLink href="/vision" passHref>
            <Link>Vision</Link>
          </NextLink>
          <NextLink href="/vision" passHref>
            <Link>Partnerships</Link>
          </NextLink>
        </Stack>
      </Container>

      <Box
        borderTopWidth={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.700')}>
        <Container
          as={Stack}
          maxW={'6xl'}
          py={4}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ base: 'center', md: 'space-between' }}
          align={{ base: 'center', md: 'center' }}>
          <Text fontSize={"sm"}>© 2022 Buidl Protocol. All rights reserved</Text>
          <Stack direction={'row'} spacing={6}>
            <SocialButton label={'Twitter'} href={'https://twitter.com/buidlprotocol'}>
              <FaTwitter />
            </SocialButton>
            <SocialButton label={'Discord'} href={'https://discord.gg'}>
              <FaDiscord />
            </SocialButton>
            <SocialButton label={'Telegram'} href={'https://telegram.com'}>
              <FaTelegram />
            </SocialButton>
            <SocialButton label={'Github'} href={'https://github.com/buidlprotocol'}>
              <FaGithub />
            </SocialButton>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
