import { StockFilterSchema } from '@/schema'
import { getAllCocktails as getAllDbCocktails } from '@/utils/dynamoDb'
import { z } from 'zod'
import { procedure } from '../trpc'

export const getAllCocktails = procedure
  .input(
    z
      .object({
        filter: StockFilterSchema.optional(),
      })
      .optional()
  )
  .query(async ({ input }) => {
    return await getAllDbCocktails(input?.filter)
  })
