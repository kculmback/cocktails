import { CocktailWithRelations, Tag } from '@/schema'
import { trpc } from '@/utils/trpc'
import { Card, CardBody, FormControl, FormLabel, HStack, Input } from '@chakra-ui/react'
import { UseTRPCQueryResult } from '@trpc/react-query/shared'
import { Select } from 'chakra-react-select'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useMiniSearch } from 'react-minisearch'

export type UseSearchCocktailsProps = { cocktails: CocktailWithRelations[] | undefined }

export function useSearchCocktails({ cocktails: cocktailsProp }: UseSearchCocktailsProps) {
  const tags = trpc.getAllTags.useQuery()
  const [tag, setTag] = useState<Tag | null>(null)

  const cocktails = useMemo(() => cocktailsProp ?? [], [cocktailsProp])

  const { removeAll, addAll, search, searchResults } = useMiniSearch(cocktails, {
    fields: ['label', 'description'],
    searchOptions: {
      fuzzy: true,
      prefix: true,
    },
    idField: 'id',
  })

  const [removed, setRemoved] = useState(false)
  useEffect(() => {
    removeAll()
    setRemoved(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cocktails])
  useEffect(() => {
    if (!removed) {
      return
    }
    addAll(cocktails)
    setRemoved(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removed])

  const [query, setQuery] = useState('')
  useEffect(() => {
    if (!!query) {
      search(query)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return {
    cocktails,
    query,
    setQuery,
    searchResults,
    tag,
    setTag,
    tags,
  }
}

export type SearchCocktailsProps = {
  query: string
  setQuery: Dispatch<SetStateAction<string>>
  tags: UseTRPCQueryResult<Tag[], unknown>
  tag: Tag | null
  setTag: Dispatch<
    SetStateAction<{
      id: string
      label: string
    } | null>
  >
}

export function SearchCocktails({ query, setQuery, tag, tags, setTag }: SearchCocktailsProps) {
  return (
    <Card>
      <CardBody>
        <HStack>
          <FormControl id="tagField" maxW="72">
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
  )
}
