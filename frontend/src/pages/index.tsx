import { CocktailsList } from '@/components'
import { trpc } from '@/utils/trpc'
import { Container, Heading, Stack } from '@chakra-ui/react'
import Head from 'next/head'

export default function Home() {
  const cocktails = trpc.getAllCocktails.useQuery({ filter: 'available' })

  return (
    <>
      <Head>
        <title>Cocktails</title>
      </Head>

      <main>
        <Container maxW="container.lg">
          <Stack spacing="4">
            <Heading as="h1" size="lg">
              Available Cocktails
            </Heading>
            <CocktailsList cocktails={cocktails.data ?? []} />
          </Stack>
        </Container>
      </main>
    </>
  )
}