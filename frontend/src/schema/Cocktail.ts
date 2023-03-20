import { z } from 'zod'

export const CocktailSchema = z.object({
  id: z.string().min(2),
  label: z.string().min(2),
  url: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  steps: z.array(z.string().min(2)).optional().nullable(),
  inStock: z.boolean().default(true),
})

export type Cocktail = z.infer<typeof CocktailSchema>
