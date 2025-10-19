import type { Metadata } from 'next'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { SessionProvider } from './providers/SessionProvider'
import { CentralizedSessionProvider } from './providers/CentralizedSessionProvider'
import TokenHandler from '../components/TokenHandler'
import { theme } from './theme'
import './globals.css'

export const metadata: Metadata = {
  title: 'EFD Documentation',
  description: 'Internal documentation hub for Engel Fine Design ecosystem',
  robots: 'noindex, nofollow', // Internal use only
}

const USE_CENTRALIZED_AUTH = process.env.NEXT_PUBLIC_USE_CENTRALIZED_AUTH === 'true'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const AuthProvider = USE_CENTRALIZED_AUTH ? CentralizedSessionProvider : SessionProvider
  
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              {USE_CENTRALIZED_AUTH && <TokenHandler />}
              {children}
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}