import { CocktailsList } from '@/components'
import { trpc } from '@/utils/trpc'
import { Container, FormControl, FormLabel, Heading, Input, Stack } from '@chakra-ui/react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useMiniSearch } from 'react-minisearch'

export default function Home() {
  const cocktails = trpc.getAllCocktails.useQuery({ filter: 'available' })

  const { removeAll, addAll, search, searchResults } = useMiniSearch(cocktails.data ?? [], {
    fields: ['label', 'description'],
    searchOptions: {
      fuzzy: true,
      prefix: true,
    },
    idField: 'id',
  })

  useEffect(() => {
    removeAll()
    addAll(cocktails.data ?? [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cocktails])

  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!!query) {
      search(query)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

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

            <FormControl>
              <FormLabel htmlFor="query">Search Cocktails</FormLabel>
              <Input
                name="query"
                placeholder="Whiskey..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </FormControl>

            <CocktailsList cocktails={(!!query ? searchResults : cocktails.data) ?? []} />
          </Stack>
        </Container>
      </main>
    </>
  )
}
