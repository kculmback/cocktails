// import { StockFilter } from '@/schema'
// import { prisma } from './prisma'

// export async function getAllIngredientsDb(stockFilter: StockFilter = 'all') {
//   return prisma.ingredient.findMany({
//     where: {
//       inStock: stockFilter === 'all' ? undefined : stockFilter === 'inStock',
//     },
//     orderBy: { label: 'asc' },
//     include: {
//       mainIngredients: { orderBy: { label: 'asc' } },
//       alternateIngredients: { orderBy: { label: 'asc' } },
//       cocktails: { orderBy: { cocktail: { label: 'asc' } }, include: { cocktail: true } },
//     },
//   })
// }
