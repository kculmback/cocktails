import { IngredientWithRelations, StockFilterSchema } from '@/schema'
import { z } from 'zod'
import { procedure } from '../trpc'
import { getAllIngredientsDb } from '@/utils/db'

export const getAllIngredients = procedure
  .input(
    z
      .object({
        filter: StockFilterSchema.optional(),
      })
      .optional()
  )
  .query(async ({ input }) => {
    const ingredientsDb = await getAllIngredientsDb(input?.filter)
    const ingredients: IngredientWithRelations[] = ingredientsDb.map(
      ({ cocktails: cocktailsDb, ...ingredient }) => {
        const cocktails = cocktailsDb.map(({ cocktail }) => cocktail)

        return { ...ingredient, cocktails }
      }
    )

    return ingredients
  })
