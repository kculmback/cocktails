import { prisma } from '../prisma'

export async function getUserFromSessionIdDb(id: string) {
  const session = await prisma.session.findFirst({
    where: { id },
    include: {
      user: true,
    },
  })

  return session?.user
}

export async function getUserDb(id: string) {
  const user = await prisma.user.findFirst({
    where: { id },
  })

  return user
}
