import { z } from 'zod'
import { procedure } from '../trpc'
import { removeIngredientFromDb } from '@/utils/dynamoDb'

export const RemoveIngredientSchema = z.object({ id: z.string() })

export const removeIngredient = procedure
  .input(RemoveIngredientSchema)
  .mutation(async ({ input }) => {
    const { id } = input

    await removeIngredientFromDb(id)
  })
