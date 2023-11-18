import { z } from 'zod'
import { procedure } from '../trpc'
import { getIngredientDb } from '../db'
import { IngredientWithRelations } from '../../schema'

export const getIngredient = procedure
  // using zod schema to validate and infer input values
  .input(
    z.object({
      id: z.string().uuid(),
    })
  )
  .query(async ({ input }) => {
    const ingredientDb = await getIngredientDb(input.id)

    if (!ingredientDb) return

    const ingredient: IngredientWithRelations = {
      ...ingredientDb,
      cocktails: ingredientDb.cocktails.map(({ cocktail }) => cocktail),
    }

    return ingredient
  })
