import { Navigation } from '@/components'
import { theme } from '@/utils/theme'
import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { trpc } from '../utils/trpc'

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <meta content="Cocktails" name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <SessionProvider session={session}>
        <ChakraProvider theme={theme}>
          <Navigation />
          <Component {...pageProps} />
        </ChakraProvider>
      </SessionProvider>
    </>
  )
}

export default trpc.withTRPC(App)
