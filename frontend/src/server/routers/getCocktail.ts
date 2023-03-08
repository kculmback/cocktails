import { getAllIngredientsForCocktail, getCocktail as getDbCocktail } from '@/utils/dynamoDb'
import { z } from 'zod'
import { procedure } from '../trpc'

export const getCocktail = procedure
  // using zod schema to validate and infer input values
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input }) => {
    const cocktail = await getDbCocktail(input.id)
    const ingredients = await getAllIngredientsForCocktail(input.id)

    return { ...cocktail, ingredients }
  })
