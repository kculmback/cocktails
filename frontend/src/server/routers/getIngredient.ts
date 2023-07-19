import {
  getAllCocktailsForIngredientFromDb,
  getIngredientFromDb as getDbIngredient,
} from '@/utils/dynamoDb'
import { z } from 'zod'
import { procedure } from '../trpc'

export const getIngredient = procedure
  // using zod schema to validate and infer input values
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input }) => {
    const ingredient = await getDbIngredient(input.id)
    const cocktails = await getAllCocktailsForIngredientFromDb(input.id)

    return { ...ingredient, cocktails }
  })
