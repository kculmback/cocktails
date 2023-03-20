import { TagSchema } from '@/schema'
import { putTag } from '@/utils/dynamoDb'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'
import { procedure } from '../trpc'

export const UpsertTagSchema = TagSchema.omit({ id: true }).and(
  z.object({
    id: z.string().optional(),
  })
)

export const upsertTag = procedure.input(UpsertTagSchema).mutation(async ({ input }) => {
  const tagWithId = {
    ...input,
    id: input.id ?? uuid(),
  }

  await putTag(tagWithId)

  return tagWithId
})

export type UpsertTag = z.infer<typeof UpsertTagSchema>
