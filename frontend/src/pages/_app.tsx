import { ButtonLink } from '@/components'
import { ChakraProvider, HStack } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { trpc } from '../utils/trpc'

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <HStack mb="6" px="4" py="2" shadow="md">
        <ButtonLink href="/" size="sm">
          Home
        </ButtonLink>
        <ButtonLink href="/cocktails" size="sm">
          All Cocktails
        </ButtonLink>
        <ButtonLink href="/cocktails/create" size="sm">
          Create Cocktail
        </ButtonLink>
        <ButtonLink href="/ingredients" size="sm">
          Ingredients
        </ButtonLink>
      </HStack>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default trpc.withTRPC(App)
