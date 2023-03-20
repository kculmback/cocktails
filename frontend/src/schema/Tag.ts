import { z } from 'zod'

export const TagSchema = z.object({
  id: z.string().min(2),
  label: z.string().min(2),
})

export type Tag = z.infer<typeof TagSchema>
