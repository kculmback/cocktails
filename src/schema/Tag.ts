import { z } from 'zod'
import { Cocktail } from './Cocktail'

export const TagSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(2),
})

export type Tag = z.infer<typeof TagSchema>

export type TagWithRelations = Tag & { cocktails: Cocktail[] }
