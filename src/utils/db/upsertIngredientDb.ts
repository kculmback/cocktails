import { Ingredient } from '@prisma/client'
import { SetOptional } from 'type-fest'
import { prisma } from './prisma'

export async function upsertIngredientDb(
  ingredient: SetOptional<Ingredient, 'createdAt' | 'id' | 'updatedAt'>
) {
  if (ingredient.id) {
    return prisma.ingredient.update({
      data: ingredient,
      where: { id: ingredient.id },
    })
  }

  return prisma.ingredient.create({
    data: ingredient,
  })
}
