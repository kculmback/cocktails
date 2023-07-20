export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/cocktails',
    '/cocktails/(.*)',
    '/ingredients',
    '/ingredients/(.*)',
    '/api/trpc/upsert(.*)',
    '/api/trpc/remove(.*)',
  ],
}
