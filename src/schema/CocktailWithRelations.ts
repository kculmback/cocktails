import { z } from 'zod'
import { CocktailSchema } from './Cocktail'
import { CocktailIngredientSchema } from './Ingredient'
import { TagSchema } from './Tag'

export const CocktailWithRelationsSchema = CocktailSchema.and(
  z.object({
    inStock: z.boolean().default(true),
    tags: z.array(TagSchema),
    ingredients: z.array(CocktailIngredientSchema),
  })
)

export type CocktailWithRelations = z.infer<typeof CocktailWithRelationsSchema>
