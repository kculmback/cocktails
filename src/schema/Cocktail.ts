import { z } from 'zod'

export const CocktailSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(2),
  url: z.string().nullable().default(null),
  image: z.string().nullable().default(null),
  description: z.string().nullable().default(null),
  instructions: z.string().nullable().default(null),
  inStock: z.boolean().default(true),
})

export type Cocktail = z.infer<typeof CocktailSchema>
