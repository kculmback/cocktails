// import { BaseIngredientSchema, IngredientSchema } from '../../schema'
// import { upsertIngredientDb } from '../db'
// import { z } from 'zod'
// import { procedure } from '../trpc'

// export const UpsertIngredientSchema = IngredientSchema.omit({ id: true }).and(
//   z.object({
//     id: z.string().uuid().optional(),
//     alternateIngredients: z.array(BaseIngredientSchema),
//   })
// )

// export const upsertIngredient = procedure
//   .input(UpsertIngredientSchema)
//   .mutation(async ({ input: { alternateIngredients, ...ingredient } }) => {
//     return upsertIngredientDb({
//       ingredient,
//       alternateIngredientsIds: alternateIngredients.map(({ id }) => id),
//     })
//   })

// export type UpsertIngredient = z.infer<typeof UpsertIngredientSchema>
