import { getAllCocktailsForTag } from '@/utils/dynamoDb'
import { z } from 'zod'
import { procedure } from '../trpc'

export const getCocktailsForTag = procedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input }) => {
    return await getAllCocktailsForTag(input.id)
  })
