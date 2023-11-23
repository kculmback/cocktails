import { router } from '@/server/trpc/trpc'
import { listLocations } from './listLocations'
import { upsertLocation } from './upsertLocation'

export const locationRouter = router({
  list: listLocations,
  upsert: upsertLocation,
})
