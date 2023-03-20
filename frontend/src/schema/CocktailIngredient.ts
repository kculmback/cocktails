import { z } from 'zod'
import { CocktailSchema } from './Cocktail'
import { IngredientSchema } from './Ingredient'

// export const CocktailIngredientSchema = z.object({
//   cocktailId: z.string().min(2),
//   cocktailLabel: z.string().min(2),
//   ingredientId: z.string().min(2),
//   ingredientLabel: z.string().min(2),
//   amount: z.string().min(1),
//   inStock: z.boolean().default(true),
// })

export const CocktailIngredientSchema = z.object({
  cocktail: CocktailSchema.omit({ inStock: true }),
  ingredient: IngredientSchema,
  amount: z.string().min(1),
})

export type CocktailIngredient = z.infer<typeof CocktailIngredientSchema>
