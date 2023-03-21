import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const clientId = process.env.GOOGLE_ID ?? ''
const clientSecret = process.env.GOOGLE_SECRET ?? ''
const emailWhitelist = (process.env.EMAIL_WHITELIST ?? '').split(',').map((email) => email.trim())

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId,
      clientSecret,
    }),
  ],
  callbacks: {
    signIn(params) {
      return emailWhitelist.includes(params.user.email ?? '')
    },
  },
}

export default NextAuth(authOptions)
