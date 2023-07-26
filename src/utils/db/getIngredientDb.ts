import { prisma } from './prisma'

export function getIngredientDb(id: string) {
  return prisma.ingredient.findFirst({
    where: { id },
    orderBy: { label: 'asc' },
    include: {
      cocktails: { orderBy: { cocktail: { label: 'asc' } }, include: { cocktail: true } },
    },
  })
}
