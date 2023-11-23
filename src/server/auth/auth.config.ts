import { prisma } from '@/server/db/prisma'
import { env } from '@/server/env'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const clientId = env.GOOGLE_ID
const clientSecret = env.GOOGLE_SECRET

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId,
      clientSecret,
    }),
  ],
  pages: {
    signIn: '/auth/sign-in',
  },
  callbacks: {
    // session: async ({ session, token }) => {
    //   console.log('session', JSON.stringify(session, null))
    //   console.log('token', token)
    //   if (session?.user) {
    //     session.user.id = token.sub
    //   }
    //   return session
    // },
    async session({ session, token }) {
      // expose user id
      return Promise.resolve({ ...session, user: { ...session.user, id: token.sub } })
    },
  },
  session: {
    strategy: 'jwt',
  },
}
