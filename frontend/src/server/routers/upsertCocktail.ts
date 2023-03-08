import {
  Cocktail,
  CocktailIngredient,
  CocktailSchema,
  Ingredient,
  IngredientSchema,
} from '@/schema'
import { putCocktail, putCocktailIngredients } from '@/utils/dynamoDb'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'
import { procedure } from '../trpc'

export const UpsertCocktailSchema = CocktailSchema.omit({ id: true, inStock: true }).and(
  z.object({
    id: z.string().optional(),
    ingredients: z.array(IngredientSchema.and(z.object({ amount: z.string().min(1) }))),
  })
)

export const upsertCocktail = procedure.input(UpsertCocktailSchema).mutation(async ({ input }) => {
  const { ingredients, ...cocktail } = input

  const cocktailWithId: Cocktail = {
    ...cocktail,
    id: cocktail.id ?? uuid(),
    inStock: ingredients.every(({ inStock }) => inStock),
  }
  const ingredientsWithId: (Ingredient & Pick<CocktailIngredient, 'amount'>)[] = ingredients.map(
    (ingredient) => ({
      ...ingredient,
      id: ingredient.id ?? uuid(),
    })
  )

  const dbCocktail = await putCocktail(cocktailWithId)

  await putCocktailIngredients(dbCocktail, ingredientsWithId)

  return {
    ...cocktailWithId,
    ingredients: ingredientsWithId,
  }
})

export type UpsertCocktail = z.infer<typeof UpsertCocktailSchema>
