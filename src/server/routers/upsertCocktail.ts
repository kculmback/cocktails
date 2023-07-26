import { CocktailSchema, CocktailWithRelations, IngredientSchema, TagSchema } from '@/schema'
import { upsertCocktailDb } from '@/utils/db/upsertCocktailDb'
import { z } from 'zod'
import { procedure } from '../trpc'

export const UpsertCocktailSchema = CocktailSchema.omit({ id: true, inStock: true }).and(
  z.object({
    id: z.string().uuid().optional(),
    ingredients: z.array(IngredientSchema.and(z.object({ amount: z.string().min(1) }))),
    tags: z.array(TagSchema).optional(),
  })
)

export const upsertCocktail = procedure.input(UpsertCocktailSchema).mutation(async ({ input }) => {
  const { ingredients, tags = [], ...cocktail } = input

  // cocktail
  const dbCocktail = await upsertCocktailDb({ cocktail, ingredients, tags })

  // // tags
  // const tagsWithId: Tag[] = tags.map((tag) => ({
  //   ...tag,
  //   id: tag.id ?? uuid(),
  // }))
  // const currentTags = await getAllTagsForCocktail(dbCocktail.id)
  // const removedTags = differenceBy(currentTags, tagsWithId, (item) =>
  //   'id' in item ? item.id : item.tag.id
  // ).map(({ tag }) => tag.id)

  // await putCocktailTagsToDb(dbCocktail.id, tagsWithId, removedTags)

  const updatedIngredients = dbCocktail.ingredients.map(({ ingredient, amount }) => ({
    ...ingredient,
    amount,
  }))

  const updatedTags = dbCocktail.tags.map(({ tag }) => tag)

  const updatedCocktail: CocktailWithRelations = {
    ...dbCocktail,
    inStock: updatedIngredients.every(({ inStock }) => inStock),
    ingredients: updatedIngredients,
    tags: updatedTags,
  }

  return updatedCocktail
})

export type UpsertCocktail = z.infer<typeof UpsertCocktailSchema>
