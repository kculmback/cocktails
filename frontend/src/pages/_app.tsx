import { Navigation } from '@/components'
import { theme } from '@/utils/theme'
import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { trpc } from '../utils/trpc'

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <Navigation />
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  )
}

export default trpc.withTRPC(App)
