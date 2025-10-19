import { auth } from '../../../auth.js'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/DashboardLayout'

const USE_CENTRALIZED_AUTH = process.env.NEXT_PUBLIC_USE_CENTRALIZED_AUTH === 'true'

export default async function DashboardLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  // When using centralized auth, skip server-side auth check
  // The client-side provider will handle authentication
  if (!USE_CENTRALIZED_AUTH) {
    const session = await auth()
    
    if (!session) {
      redirect('/auth/signin')
    }
  }

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}