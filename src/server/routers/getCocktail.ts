import { z } from 'zod'
import { procedure } from '../trpc'
import { getCocktailDb } from '@/utils/db'
import { CocktailWithRelations } from '@/schema'

export const getCocktail = procedure
  .input(
    z.object({
      id: z.string().uuid(),
    })
  )
  .query(async ({ input }) => {
    const cocktailDb = await getCocktailDb(input.id)

    if (!cocktailDb) return

    const ingredients = cocktailDb.ingredients.map(({ ingredient, amount }) => ({
      ...ingredient,
      amount,
    }))

    const cocktail: CocktailWithRelations = {
      ...cocktailDb,
      inStock: ingredients.every(({ inStock }) => inStock),
      ingredients,
      tags: cocktailDb.tags.map(({ tag }) => tag),
    }

    return cocktail
  })
