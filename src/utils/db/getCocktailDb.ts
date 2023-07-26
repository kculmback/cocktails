import { prisma } from './prisma'

export function getCocktailDb(id: string) {
  return prisma.cocktail.findFirst({
    where: { id },
    orderBy: { label: 'asc' },
    include: {
      ingredients: { orderBy: { ingredient: { label: 'asc' } }, include: { ingredient: true } },
      tags: { orderBy: { tag: { label: 'asc' } }, include: { tag: true } },
    },
  })
}
