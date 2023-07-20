import { z } from 'zod'
import { procedure } from '../trpc'
import { removeCocktailFromDb } from '@/utils/dynamoDb'

export const RemoveCocktailSchema = z.object({ id: z.string() })

export const removeCocktail = procedure.input(RemoveCocktailSchema).mutation(async ({ input }) => {
  const { id } = input

  await removeCocktailFromDb(id)
})