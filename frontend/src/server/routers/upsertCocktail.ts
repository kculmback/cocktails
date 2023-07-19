import {
  Cocktail,
  CocktailIngredient,
  CocktailSchema,
  Ingredient,
  IngredientSchema,
  Tag,
  TagSchema,
} from '@/schema'
import {
  getAllIngredientsForCocktailFromDb,
  getAllTagsForCocktail,
  putCocktailToDb,
  putCocktailIngredientsToDb,
  putCocktailTagsToDb,
} from '@/utils/dynamoDb'
import { differenceBy } from 'lodash-es'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'
import { procedure } from '../trpc'

export const UpsertCocktailSchema = CocktailSchema.omit({ id: true, inStock: true }).and(
  z.object({
    id: z.string().optional(),
    ingredients: z.array(IngredientSchema.and(z.object({ amount: z.string().min(1) }))),
    tags: z
      .array(TagSchema.omit({ id: true }).and(z.object({ id: z.string().min(2).optional() })))
      .optional(),
  })
)

export const upsertCocktail = procedure.input(UpsertCocktailSchema).mutation(async ({ input }) => {
  const { ingredients, tags = [], ...cocktail } = input

  // cocktail
  const cocktailWithId: Cocktail = {
    ...cocktail,
    id: cocktail.id ?? uuid(),
    inStock: ingredients.every(({ inStock }) => inStock),
  }

  const dbCocktail = await putCocktailToDb(cocktailWithId)

  // ingredients
  const ingredientsWithId: (Ingredient & Pick<CocktailIngredient, 'amount'>)[] = ingredients.map(
    (ingredient) => ({
      ...ingredient,
      id: ingredient.id ?? uuid(),
    })
  )
  const currentIngredients = await getAllIngredientsForCocktailFromDb(dbCocktail.id)
  const removedIngredients = differenceBy(currentIngredients, ingredientsWithId, (value) =>
    'id' in value ? value.id : value.ingredient.id
  ).map((ingredient) => ingredient.ingredient.id)

  await putCocktailIngredientsToDb(dbCocktail, ingredientsWithId, removedIngredients)

  // tags
  const tagsWithId: Tag[] = tags.map((tag) => ({
    ...tag,
    id: tag.id ?? uuid(),
  }))
  const currentTags = await getAllTagsForCocktail(dbCocktail.id)
  const removedTags = differenceBy(currentTags, tagsWithId, (item) =>
    'id' in item ? item.id : item.tag.id
  ).map(({ tag }) => tag.id)

  await putCocktailTagsToDb(dbCocktail.id, tagsWithId, removedTags)

  return {
    ...cocktailWithId,
    ingredients: ingredientsWithId,
  }
})

export type UpsertCocktail = z.infer<typeof UpsertCocktailSchema>
