import { StockFilterSchema } from '@/schema'
import { getAllIngredients as getAllDbIngredients } from '@/utils/dynamoDb'
import { z } from 'zod'
import { procedure } from '../trpc'

export const getAllIngredients = procedure
  .input(
    z
      .object({
        filter: StockFilterSchema.optional(),
      })
      .optional()
  )
  .query(async ({ input }) => {
    return await getAllDbIngredients(input?.filter)
  })
