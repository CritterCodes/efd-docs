import { redirect } from 'next/navigation'
import { auth } from '../../auth.js'

export default async function HomePage() {
  const session = await auth()
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Redirect to dashboard
  redirect('/dashboard')
}