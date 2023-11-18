import { Tag } from '@prisma/client'
import { SetOptional } from 'type-fest'
import { prisma } from './prisma'

export async function upsertTagDb(tag: SetOptional<Tag, 'createdAt' | 'id' | 'updatedAt'>) {
  if (tag.id) {
    return prisma.tag.update({
      data: tag,
      where: { id: tag.id },
    })
  }

  return prisma.tag.create({
    data: tag,
  })
}
