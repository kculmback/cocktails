import {
  getAllIngredientsForCocktailFromDb,
  getCocktailFromDb as getDbCocktail,
} from '@/utils/dynamoDb'
import { z } from 'zod'
import { procedure } from '../trpc'

export const getCocktail = procedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input }) => {
    const cocktail = await getDbCocktail(input.id)
    if (!cocktail) return

    const ingredients = await getAllIngredientsForCocktailFromDb(input.id)

    return { ...cocktail, ingredients }
  })
