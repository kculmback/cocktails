import { StockFilter } from '@/schema'
import { prisma } from './prisma'

export async function getAllCocktailsDb(stockFilter: StockFilter = 'all') {
  return prisma.cocktail.findMany({
    where: {
      ingredients:
        stockFilter === 'all'
          ? undefined
          : stockFilter === 'inStock'
          ? { every: { ingredient: { inStock: true } } }
          : { some: { ingredient: { inStock: false } } },
    },
    orderBy: {
      label: 'asc',
    },
    include: {
      ingredients: { orderBy: { ingredient: { label: 'asc' } }, include: { ingredient: true } },
      tags: { orderBy: { tag: { label: 'asc' } }, include: { tag: true } },
    },
  })
}
