import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'
import { QueryClient, QueryClientProvider, QueryCache } from "react-query";
import { Toaster, toast } from "react-hot-toast";
import { Provider as WagmiProvider, createClient } from "wagmi";
import { providers } from 'ethers';

import theme from '../theme'
import { getLayout } from '../components/layout/Layout';

// Wagmi client
const client = createClient({
  autoConnect: true,
  // provider used when there isn't a signer aka connected wallet
  provider: () => providers.getDefaultProvider("http://localhost:8545")
});

// react-query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchInterval: 30 * 60 * 1000, // 30 mins -- TODO for dev only, default 0,
      // retry: 2, // default 3
      staleTime: 30 * 60 * 1000, // 30 mins -- TODO for dev only, default 0
      cacheTime: 15 * 60 * 1000, // TODO for dev only, default 5mins
    },
  },
  queryCache: new QueryCache({
    onError: (err) => {
      console.log(err);
      throw err; // TODO debug
      toast.error(
        `Error ${err}`
      );
      // : Is MetaMask connected to the correct network?
    },
  }),
});

// Next Layouts
type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

// APP
// const defaultLayout = (page) => (
//   <Layout>
//     {page}
//   </Layout>
// )

function App({ Component, pageProps }: AppPropsWithLayout) {

  const _getLayout = Component.getLayout ?? getLayout;

  return (
    <WagmiProvider client={client}>
      <ChakraProvider resetCSS theme={theme}>
        <QueryClientProvider client={queryClient}>
          {
            _getLayout(
              <Component {...pageProps} />
            )
          }
          <Toaster position="bottom-right" />
        </QueryClientProvider>
      </ChakraProvider>
    </WagmiProvider>
  )
}

export default App
