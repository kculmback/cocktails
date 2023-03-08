import { z } from 'zod'

export const IngredientSchema = z.object({
  id: z.string().min(2),
  label: z.string().min(2),
  description: z.string().optional().nullable(),
  inStock: z.boolean().default(true),
})

export type Ingredient = z.infer<typeof IngredientSchema>
