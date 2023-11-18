import { z } from 'zod'
import { procedure } from '../trpc'

export const RemoveCocktailSchema = z.object({ id: z.string() })

// export const removeCocktail = procedure.input(RemoveCocktailSchema).mutation(async ({ input }) => {
export const removeCocktail = procedure.input(RemoveCocktailSchema).mutation(async () => {
  // const { id } = input
  // await removeCocktailFromDb(id)
})
