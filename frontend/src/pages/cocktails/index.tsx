import { CocktailsList } from '@/components'
import { trpc } from '@/utils/trpc'
import { Alert, AlertIcon, AlertTitle, Container, Heading, Skeleton, Stack } from '@chakra-ui/react'
import { range } from 'lodash-es'
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

              {cocktails.isLoading ? (
                range(0, 3).map((i) => <Skeleton key={i} borderRadius="md" h="44" />)
              ) : cocktails.isError ? (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle>Could not retrieve cocktails.</AlertTitle>
                </Alert>
              ) : !cocktails.data?.length ? (
                <Alert>
                  <AlertIcon />
                  <AlertTitle>No cocktails found.</AlertTitle>
                </Alert>
              ) : (
                <CocktailsList cocktails={cocktails.data ?? []} includeActions />
              )}
            </Stack>
          </Stack>
        </Container>
      </main>
    </>
  )
}
