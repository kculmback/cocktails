import { z } from 'zod'
import { CocktailSchema } from './Cocktail'
import { TagSchema } from './Tag'

export const CocktailTagSchema = z.object({
  cocktail: CocktailSchema.omit({ inStock: true }),
  tag: TagSchema,
})

export type CocktailTag = z.infer<typeof CocktailTagSchema>
