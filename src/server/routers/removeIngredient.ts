import { z } from 'zod'
import { procedure } from '../trpc'

export const RemoveIngredientSchema = z.object({ id: z.string() })

export const removeIngredient = procedure
  .input(RemoveIngredientSchema)
  .mutation(async ({ input }) => {
    const { id } = input
  })
