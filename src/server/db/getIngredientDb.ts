// import { prisma } from './prisma'

// export function getIngredientDb(id: string) {
//   return prisma.ingredient.findFirst({
//     where: { id },
//     orderBy: { label: 'asc' },
//     include: {
//       alternateIngredients: { orderBy: { label: 'asc' } },
//       mainIngredients: { orderBy: { label: 'asc' } },
//       cocktails: { orderBy: { cocktail: { label: 'asc' } }, include: { cocktail: true } },
//     },
//   })
// }
