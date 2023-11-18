import { z } from 'zod'
import { CocktailSchema } from './Cocktail'

export const BaseIngredientSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(2),
  description: z.string().optional().nullable().default(null),
  inStock: z.boolean().default(true),
})

export const IngredientSchema = BaseIngredientSchema.merge(
  z.object({
    alternateIngredients: BaseIngredientSchema.array(),
  })
)

export type Ingredient = z.infer<typeof IngredientSchema>

export const CocktailIngredientSchema = IngredientSchema.and(z.object({ amount: z.string() }))

export type CocktailIngredient = z.infer<typeof CocktailIngredientSchema>

export const IngredientWithRelationsSchema = IngredientSchema.and(
  z.object({
    mainIngredients: z.array(BaseIngredientSchema),
    alternateIngredients: z.array(BaseIngredientSchema),
    cocktails: z.array(CocktailSchema.omit({ inStock: true })),
  })
)

export type IngredientWithRelations = z.infer<typeof IngredientWithRelationsSchema>
