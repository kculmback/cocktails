import { z } from 'zod'

export const CocktailSchema = z.object({
  id: z.string(),
  label: z.string(),
  link: z.string().optional(),
  steps: z.array(z.string()).optional(),
  inStock: z.boolean().default(true),
})

export type Cocktail = z.infer<typeof CocktailSchema>
