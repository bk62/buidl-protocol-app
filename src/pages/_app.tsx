import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'

import theme from '../theme'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}


function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <ChakraProvider resetCSS theme={theme}>
      {
        getLayout(
          <Component {...pageProps} />
        )
      }
    </ChakraProvider>
  )
}

export default MyApp
