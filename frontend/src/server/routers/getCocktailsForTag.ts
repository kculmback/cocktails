import { z } from 'zod'
import { procedure } from '../trpc'
import { getAllCocktailsForTagFromDb } from '@/utils/dynamoDb'

export const getCocktailsForTag = procedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input }) => {
    return await getAllCocktailsForTagFromDb(input.id)
  })
