import { initTRPC } from '@trpc/server'
import { Context } from './context'

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  errorFormatter({ shape }) {
    return shape
  },
})

const sessionInfo = t.middleware(({ next, ctx }) => {
  return next({
    ctx: {
      // Infers the `session` as non-nullable
      session: ctx.session,
    },
  })
})

// Base router and procedure helpers
export const middleware = t.middleware
export const router = t.router
export const procedure = t.procedure.use(sessionInfo)
