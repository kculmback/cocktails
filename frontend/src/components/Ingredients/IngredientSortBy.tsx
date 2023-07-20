import { CocktailIngredient, Ingredient } from '@/schema'
import { FormControl, FormLabel, HStack, Icon, IconButton, Select } from '@chakra-ui/react'
import { corrupt } from 'exhaustive'
import { startCase } from 'lodash-es'
import { useMemo, useState } from 'react'
import {
  HiSortAscending as SortAscendingIcon,
  HiSortDescending as SortDescendingIcon,
} from 'react-icons/hi'

export const ingredientSortByOptions = ['alphabetically', 'cocktails'] as const

type IngredientSortByOption = (typeof ingredientSortByOptions)[number]

export function useIngredientSortBy(
  baseIngredients: (Ingredient & { cocktails: CocktailIngredient['cocktail'][] })[]
) {
  const [sortBy, setSortBy] = useState<IngredientSortByOption>(ingredientSortByOptions[0])
  const [isAscending, setIsAscending] = useState(true)

  const sortedIngredients = useMemo(() => {
    const ingredients = [...baseIngredients]

    switch (sortBy) {
      case 'alphabetically':
        ingredients.sort((a, b) => {
          const [first, second] = isAscending ? [a, b] : [b, a]
          return first.label.localeCompare(second.label)
        })
        break

      case 'cocktails':
        ingredients.sort((a, b) => {
          const [first, second] = isAscending ? [a, b] : [b, a]
          return first.cocktails.length - second.cocktails.length
        })
        break

      default:
        corrupt(sortBy)
        break
    }

    return ingredients
  }, [baseIngredients, isAscending, sortBy])

  return { sortBy, setSortBy, isAscending, setIsAscending, sortedIngredients }
}

type IngredientSortByProps = Omit<ReturnType<typeof useIngredientSortBy>, 'sortedIngredients'>

export function IngredientSortBy({
  isAscending,
  setIsAscending,
  sortBy,
  setSortBy,
}: IngredientSortByProps) {
  return (
    <HStack alignItems="flex-end" spacing="1">
      <FormControl>
        <FormLabel>Sort By</FormLabel>
        <Select
          bg="white"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as IngredientSortByOption)}
        >
          {ingredientSortByOptions.map((value) => (
            <option key={value} value={value}>
              {startCase(value)}
            </option>
          ))}
        </Select>
      </FormControl>

      <IconButton
        aria-label={isAscending ? 'Sort descending' : 'Sort ascending'}
        icon={<Icon as={isAscending ? SortAscendingIcon : SortDescendingIcon} boxSize="5" />}
        onClick={() => setIsAscending((v) => !v)}
      />
    </HStack>
  )
}
