import { CocktailsList, SearchCocktails, useSearchCocktails } from '@/components'
import { trpc } from '@/utils/trpc'
import { Alert, AlertIcon, AlertTitle, Container, Heading, Skeleton, Stack } from '@chakra-ui/react'
import { range } from 'lodash-es'
import Head from 'next/head'

export default function AllCocktails() {
  const cocktailsQuery = trpc.getAllCocktails.useQuery({ filter: 'all' })

  const { cocktails, query, setQuery, searchResults, tag, setTag, tags } = useSearchCocktails({
    cocktailsQuery,
  })

  return (
    <>
      <Head>
        <title>Cocktails - All</title>
      </Head>

      <main>
        <Container maxW="container.lg">
          <Stack>
            <Stack spacing="4">
              <Heading as="h1" size="lg">
                All Cocktails
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
                  includeActions
                />
              )}
            </Stack>
          </Stack>
        </Container>
      </main>
    </>
  )
}
