import { authOptions } from '@/server/auth/auth.config'
import nextAuth from 'next-auth'

export default nextAuth(authOptions)
