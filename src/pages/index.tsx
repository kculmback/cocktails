import { CocktailsList, SearchCocktails, useSearchCocktails } from '@/components'
import { trpc } from '@/utils/trpc'
import { Alert, AlertIcon, AlertTitle, Container, Heading, Skeleton, Stack } from '@chakra-ui/react'
import { range } from 'lodash-es'
import { useSession } from 'next-auth/react'
import Head from 'next/head'

export default function Home() {
  const cocktailsQuery = trpc.getAllCocktails.useQuery({ filter: 'inStock' })

  const { cocktails, query, setQuery, searchResults, tag, setTag, tags } = useSearchCocktails({
    cocktails: cocktailsQuery.data,
  })

  const { status } = useSession()

  const isLoggedIn = status === 'authenticated'

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

            <SearchCocktails
              query={query}
              setQuery={setQuery}
              setTag={setTag}
              tag={tag}
              tags={tags}
            />

            {cocktailsQuery.isLoading ? (
              range(0, 3).map((i) => <Skeleton key={i} borderRadius="md" h="44" />)
            ) : cocktailsQuery.isError ? (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle>Could not retrieve cocktails.</AlertTitle>
              </Alert>
            ) : !(!!query ? searchResults : cocktails)?.length ? (
              <Alert>
                <AlertIcon />
                <AlertTitle>No cocktails found.</AlertTitle>
              </Alert>
            ) : (
              <CocktailsList
                cocktails={(!!query ? searchResults : cocktails) ?? []}
                includeActions={isLoggedIn}
              />
            )}
          </Stack>
        </Container>
      </main>
    </>
  )
}
