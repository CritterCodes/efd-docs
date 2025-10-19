import { auth } from '../../../auth.js'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/DashboardLayout'

export default async function DashboardLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}