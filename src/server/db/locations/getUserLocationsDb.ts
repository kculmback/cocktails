import { prisma } from '../prisma'

type GetUserLocationsDbProps = { userId: string }

export async function getUserLocationsDb({ userId }: GetUserLocationsDbProps) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    include: { locations: { orderBy: { name: 'asc' } } },
  })

  return user?.locations ?? []
}
