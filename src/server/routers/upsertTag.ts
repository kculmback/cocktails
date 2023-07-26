import { TagSchema } from '@/schema'
import { upsertTagDb } from '@/utils/db'
import { z } from 'zod'
import { procedure } from '../trpc'

export const UpsertTagSchema = TagSchema.omit({ id: true }).and(
  z.object({
    id: z.string().optional(),
  })
)

export const upsertTag = procedure.input(UpsertTagSchema).mutation(async ({ input }) => {
  return upsertTagDb(input)
})

export type UpsertTag = z.infer<typeof UpsertTagSchema>
