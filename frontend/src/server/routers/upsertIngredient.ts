import { IngredientSchema } from '@/schema'
import { putIngredient } from '@/utils/dynamoDb'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'
import { procedure } from '../trpc'

export const UpsertIngredientSchema = IngredientSchema.omit({ id: true }).and(
  z.object({
    id: z.string().optional(),
  })
)

export const upsertIngredient = procedure
  .input(UpsertIngredientSchema)
  .mutation(async ({ input }) => {
    const ingredientWithId = {
      ...input,
      id: input.id ?? uuid(),
    }

    await putIngredient(ingredientWithId)

    return ingredientWithId
  })

export type UpsertIngredient = z.infer<typeof UpsertIngredientSchema>
