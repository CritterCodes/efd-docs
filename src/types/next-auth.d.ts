// Extend NextAuth types
import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'admin' | 'artisan' | 'wholesaler' | 'customer' | 'dev'
      artisanTypes?: string[]
      isActive?: boolean
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    role: 'admin' | 'artisan' | 'wholesaler' | 'customer' | 'dev'
    artisanTypes?: string[]
    isActive?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    artisanTypes?: string[]
    isActive?: boolean
  }
}