import { IngredientSchema } from '@/schema'
import { upsertIngredientDb } from '@/utils/db/upsertIngredientDb'
import { z } from 'zod'
import { procedure } from '../trpc'

export const UpsertIngredientSchema = IngredientSchema.omit({ id: true }).and(
  z.object({
    id: z.string().uuid().optional(),
  })
)

export const upsertIngredient = procedure
  .input(UpsertIngredientSchema)
  .mutation(async ({ input }) => {
    return upsertIngredientDb(input)
  })

export type UpsertIngredient = z.infer<typeof UpsertIngredientSchema>
