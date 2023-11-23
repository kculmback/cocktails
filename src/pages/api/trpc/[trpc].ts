import { appRouter, createContext } from '@/server/trpc'
import * as trpcNext from '@trpc/server/adapters/next'

// export API handler
// @see https://trpc.io/docs/api-handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext,
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting

      // eslint-disable-next-line no-console
      console.error('Something went wrong', error)
    }
  },
})
