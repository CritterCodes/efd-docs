import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI!)
const clientPromise = client.connect()

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const email = credentials?.email as string
        const password = credentials?.password as string
        
        if (!email || !password) {
          return null
        }

        try {
          const client = await clientPromise
          const users = client.db(process.env.MONGODB_DB).collection('users')
          
          const user = await users.findOne({
            email: email.toLowerCase()
          })

          if (!user) {
            return null
          }

          // Check if user has access to documentation (internal roles only)
          const allowedRoles = ['admin', 'artisan', 'wholesaler', 'dev']
          if (!allowedRoles.includes(user.role)) {
            return null
          }

          const passwordMatch = await bcrypt.compare(password, user.password)
          
          if (!passwordMatch) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            artisanTypes: user.artisanTypes,
            isActive: user.isActive !== false
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.artisanTypes = user.artisanTypes
        token.isActive = user.isActive
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as 'admin' | 'artisan' | 'wholesaler' | 'customer' | 'dev'
        session.user.artisanTypes = token.artisanTypes as string[]
        session.user.isActive = token.isActive as boolean
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
})