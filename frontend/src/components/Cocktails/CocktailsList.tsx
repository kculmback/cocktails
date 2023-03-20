import { Cocktail } from '@/schema'
import { Stack } from '@chakra-ui/react'
import { CocktailCard } from './CocktailCard'

export type CocktailsListProps = {
  cocktails: Cocktail[]
  includeActions?: boolean
}

export function CocktailsList({ cocktails, includeActions }: CocktailsListProps) {
  return (
    <Stack spacing="4">
      {cocktails.map((cocktail) => (
        <CocktailCard key={cocktail.id} cocktail={cocktail} includeActions={includeActions} />
      ))}
    </Stack>
  )
}
