import { UpsertLocationSchema } from '@/schema/Location'
import { upsertLocationDb } from '@/server/db'
import { procedure } from '@/server/trpc/trpc'
import { TRPCError } from '@trpc/server'

export const upsertLocation = procedure
  .input(UpsertLocationSchema)
  .mutation(async ({ input, ctx }) => {
    const id = ctx.session?.user?.id

    if (!id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
      })
    }

    return upsertLocationDb({ location: input, userId: id })
  })
