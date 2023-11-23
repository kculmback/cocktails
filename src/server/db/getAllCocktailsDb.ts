// import { StockFilter } from '@/schema'
// import { prisma } from './prisma'
// import { exhaustive } from 'exhaustive'

// export async function getAllCocktailsDb(stockFilter: StockFilter = 'all') {
//   return prisma.cocktail.findMany({
//     where: getWhereInput(stockFilter),
//     orderBy: {
//       label: 'asc',
//     },
//     include: {
//       ingredients: {
//         orderBy: { ingredient: { label: 'asc' } },
//         include: { ingredient: { include: { alternateIngredients: true } } },
//       },
//       tags: { orderBy: { label: 'asc' } },
//       // tags: { orderBy: { tag: { label: 'asc' } }, include: { tag: true } },
//     },
//   })
// }

// const getWhereInput = (filter: StockFilter) =>
//   exhaustive(filter, {
//     all: () => undefined,
//     inStock: () => ({
//       ingredients: {
//         every: {
//           OR: [
//             { ingredient: { inStock: true } },
//             { ingredient: { alternateIngredients: { some: { inStock: true } } } },
//           ],
//         },
//       },
//     }),
//     outOfStock: () => ({
//       ingredients: {
//         some: {
//           OR: [
//             { ingredient: { inStock: false } },
//             { ingredient: { alternateIngredients: { every: { inStock: false } } } },
//           ],
//         },
//       },
//     }),
//   })
