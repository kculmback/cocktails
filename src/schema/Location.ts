import { z } from 'zod'

export const LocationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  image: z.string().nullable().default(null),
  description: z.string().nullable().default(null),
})

export type Location = z.infer<typeof LocationSchema>

export const UpsertLocationSchema = LocationSchema.omit({ id: true }).and(
  z.object({
    id: z.string().uuid().optional(),
  })
)

export type UpsertLocation = z.infer<typeof UpsertLocationSchema>
