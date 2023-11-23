import { getUserLocationsDb } from '@/server/db'
import { procedure } from '@/server/trpc/trpc'
import { TRPCError } from '@trpc/server'

export const listLocations = procedure.query(async ({ ctx }) => {
  const id = ctx.session?.user?.id
  if (!id) {
    throw new TRPCError({
      code: 'FORBIDDEN',
    })
  }

  const locations = await getUserLocationsDb({ userId: id })

  return locations
})
