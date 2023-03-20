import { router } from '../trpc'
import { getAllCocktails } from './getAllCocktails'
import { getAllIngredients } from './getAllIngredients'
import { getAllTags } from './getAllTags'
import { getCocktail } from './getCocktail'
import { getIngredient } from './getIngredient'
import { getTagsForCocktail } from './getTagsForCocktail'
import { upsertCocktail } from './upsertCocktail'
import { upsertIngredient } from './upsertIngredient'
import { upsertTag } from './upsertTag'

export const appRouter = router({
  getAllCocktails,
  getAllIngredients,
  getAllTags,
  getCocktail,
  getIngredient,
  getTagsForCocktail,
  upsertCocktail,
  upsertIngredient,
  upsertTag,
})

// export type definition of API
export type AppRouter = typeof appRouter
