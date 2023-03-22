import { CocktailsList } from '@/components'
import { Tag } from '@/schema'
import { trpc } from '@/utils/trpc'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Card,
  CardBody,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Skeleton,
  Stack,
} from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import { range } from 'lodash-es'
import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import { useMiniSearch } from 'react-minisearch'

export default function Home() {
  const tags = trpc.getAllTags.useQuery()
  const [tag, setTag] = useState<Tag | null>(null)

  const cocktails = trpc.getAllCocktails.useQuery({ filter: 'inStock' })
  const tagCocktails = trpc.getCocktailsForTag.useQuery(
    { id: tag?.id ?? '' },
    { enabled: !!tag?.id }
  )

  const cocktailsData = useMemo(() => {
    return tagCocktails.data?.map(({ cocktail }) => cocktail) ?? cocktails.data ?? []
  }, [cocktails, tagCocktails])

  const { removeAll, addAll, search, searchResults } = useMiniSearch(cocktailsData, {
    fields: ['label', 'description'],
    searchOptions: {
      fuzzy: true,
      prefix: true,
    },
    idField: 'id',
  })

  useEffect(() => {
    removeAll()
    addAll(cocktailsData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cocktailsData])

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

            <Card>
              <CardBody>
                <HStack>
                  <FormControl maxW="72">
                    <FormLabel htmlFor="tag">Select Tag</FormLabel>
                    <Select
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.id ?? option.label}
                      isClearable
                      isLoading={tags.isLoading}
                      name="tag"
                      options={tags.data ?? []}
                      placeholder="Tag..."
                      value={tag}
                      onChange={(value) => setTag(value)}
                    />
                  </FormControl>

                  <FormControl flexGrow={1}>
                    <FormLabel htmlFor="query">Search Cocktails</FormLabel>
                    <Input
                      name="query"
                      placeholder="Whiskey..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </FormControl>
                </HStack>
              </CardBody>
            </Card>

            {cocktails.isLoading ? (
              range(0, 3).map((i) => <Skeleton key={i} borderRadius="md" h="44" />)
            ) : cocktails.isError ? (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle>Could not retrieve cocktails.</AlertTitle>
              </Alert>
            ) : !(!!query ? searchResults : cocktailsData)?.length ? (
              <Alert>
                <AlertIcon />
                <AlertTitle>No cocktails found.</AlertTitle>
              </Alert>
            ) : (
              <CocktailsList cocktails={(!!query ? searchResults : cocktailsData) ?? []} />
            )}
          </Stack>
        </Container>
      </main>
    </>
  )
}
