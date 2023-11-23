import { router } from '../trpc'
import { locationRouter } from './locations'

// export const appRouter = router({
//   getAllCocktails,
//   getAllIngredients,
//   getAllTags,
//   getCocktail,
//   getIngredient,
//   removeCocktail,
//   removeIngredient,
//   upsertCocktail,
//   upsertIngredient,
//   upsertTag,
// })

export const appRouter = router({
  locations: locationRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
