import { getAllTagsForCocktail } from '@/utils/dynamoDb'
import { z } from 'zod'
import { procedure } from '../trpc'

export const getTagsForCocktail = procedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input }) => {
    return await getAllTagsForCocktail(input.id)
  })
