import { LocationSchema } from '@/schema'
import { upsertLocationDb } from '@/server/db'
import { getUserFromSessionIdDb } from '@/server/db/users/getUserDb'
import { procedure } from '@/server/trpc/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const UpsertLocationSchema = LocationSchema.omit({ id: true }).and(
  z.object({
    id: z.string().uuid().optional(),
  })
)

export const upsertLocation = procedure
  .input(UpsertLocationSchema)
  .mutation(async ({ input, ctx }) => {
    const id = ctx.session?.user?.id
    console.log(id)
    if (!id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
      })
    }

    return upsertLocationDb({ location: input, userId: id })
  })

export type UpsertLocation = z.infer<typeof UpsertLocationSchema>
