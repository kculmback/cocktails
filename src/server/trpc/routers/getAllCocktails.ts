// import { z } from 'zod'
// import { CocktailWithRelations, StockFilterSchema } from '../../schema'
// import { getAllCocktailsDb } from '../db'
// import { procedure } from '../trpc'

// export const getAllCocktails = procedure
//   .input(
//     z.object({
//       locationId: z.string(),
//       filter: StockFilterSchema.optional(),
//     })
//   )
//   .query(async ({ input, ctx: { session } }) => {
//     console.log('session', session)
//     // console.log('serverSession', serverSession)

//     const cocktails = await getAllCocktailsDb(input?.filter)

//     const mappedCocktails: CocktailWithRelations[] = cocktails.map(
//       ({ ingredients: ingredientsDb, tags, ...cocktail }) => {
//         const ingredients = ingredientsDb.map(({ ingredient, amount }) => ({
//           ...ingredient,
//           amount,
//         }))

//         return {
//           ...cocktail,
//           inStock: ingredients.every(
//             ({ inStock, alternateIngredients }) =>
//               inStock || alternateIngredients.some(({ inStock }) => inStock)
//           ),
//           ingredients,
//           tags,
//         }
//       }
//     )

//     return mappedCocktails
//   })
