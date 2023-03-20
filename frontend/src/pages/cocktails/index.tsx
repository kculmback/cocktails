import { CocktailsList } from '@/components'
import { trpc } from '@/utils/trpc'
import { Container, Heading, Stack } from '@chakra-ui/react'
import Head from 'next/head'

export default function AllCocktails() {
  const cocktails = trpc.getAllCocktails.useQuery({ filter: 'all' })

  return (
    <>
      <Head>
        <title>Cocktails</title>
      </Head>

      <main>
        <Container maxW="container.lg">
          <Stack>
            <Stack spacing="4">
              <Heading as="h1" size="lg">
                All Cocktails
              </Heading>
              <CocktailsList cocktails={cocktails.data ?? []} includeActions />
            </Stack>
          </Stack>
        </Container>
      </main>
    </>
  )
}
