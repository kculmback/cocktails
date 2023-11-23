import { Location } from '@prisma/client'
import { SetOptional } from 'type-fest'
import { prisma } from '../prisma'

type UpsertLocationDbProps = {
  location: SetOptional<Location, 'createdAt' | 'id' | 'updatedAt' | 'invitationCode'>
  userId: string
}

export async function upsertLocationDb({ location, userId }: UpsertLocationDbProps) {
  const dbLocation = location.id
    ? await prisma.location.update({
        data: {
          ...location,
          users: {
            connect: [{ id: userId }],
          },
        },
        where: { id: location.id },
      })
    : await prisma.location.create({
        data: {
          ...location,
          users: {
            connect: [{ id: userId }],
          },
        },
      })

  return dbLocation
}
