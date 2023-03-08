import { router } from '../trpc'
import { getAllCocktails } from './getAllCocktails'
import { getAllIngredients } from './getAllIngredients'
import { getCocktail } from './getCocktail'
import { getIngredient } from './getIngredient'
import { upsertCocktail } from './upsertCocktail'
import { upsertIngredient } from './upsertIngredient'

export const appRouter = router({
  getAllCocktails,
  getAllIngredients,
  getCocktail,
  getIngredient,
  upsertCocktail,
  upsertIngredient,
})

// export type definition of API
export type AppRouter = typeof appRouter
