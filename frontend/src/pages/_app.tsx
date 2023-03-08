import { Link } from '@/components'
import { ChakraProvider, HStack } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { trpc } from '../utils/trpc'

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <HStack mb="6" px="4" py="2" shadow="md">
        <Link href="/">Home</Link>
        <Link href="/cocktails/create">Create Cocktail</Link>
        <Link href="/ingredients">Ingredients</Link>
      </HStack>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default trpc.withTRPC(App)
