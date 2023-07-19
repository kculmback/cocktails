import { getAllCocktailsForIngredientFromDb } from '@/utils/dynamoDb'
import { z } from 'zod'
import { procedure } from '../trpc'

export const getCocktailsForIngredient = procedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input }) => {
    return await getAllCocktailsForIngredientFromDb(input.id)
  })
