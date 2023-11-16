import { CocktailWithRelations, StockFilterSchema } from '@/schema'
import { getAllCocktailsDb } from '@/utils/db'
import { z } from 'zod'
import { procedure } from '../trpc'

export const getAllCocktails = procedure
  .input(
    z
      .object({
        filter: StockFilterSchema.optional(),
      })
      .optional()
  )
  .query(async ({ input }) => {
    const cocktails = await getAllCocktailsDb(input?.filter)

    const mappedCocktails: CocktailWithRelations[] = cocktails.map(
      ({ ingredients: ingredientsDb, tags: tagsDb, ...cocktail }) => {
        const ingredients = ingredientsDb.map(({ ingredient, amount }) => ({
          ...ingredient,
          amount,
        }))
        const tags = tagsDb.map(({ tag }) => tag)

        return {
          ...cocktail,
          inStock: ingredients.every(
            ({ inStock, alternateIngredients }) =>
              inStock || alternateIngredients.some(({ inStock }) => inStock)
          ),
          ingredients,
          tags,
        }
      }
    )

    return mappedCocktails
  })
