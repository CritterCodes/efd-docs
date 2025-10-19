'use client'

import { useState, useEffect, Suspense } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Card,
  CardContent,
} from '@mui/material'
import { Business } from '@mui/icons-material'

function SignInContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Check if we should use centralized auth
  const useCentralizedAuth = process.env.NEXT_PUBLIC_USE_CENTRALIZED_AUTH === 'true'
  
  useEffect(() => {
    // If centralized auth is enabled, redirect to admin immediately
    if (useCentralizedAuth && typeof window !== 'undefined') {
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
      const adminAuthUrl = `${process.env.NEXT_PUBLIC_ADMIN_URL}/auth/signin?callbackUrl=${encodeURIComponent(window.location.origin + callbackUrl)}`
      console.log('🔄 Redirecting to centralized auth:', adminAuthUrl)
      window.location.href = adminAuthUrl
      return
    }
  }, [useCentralizedAuth, searchParams])
  
  // Show loading screen while redirecting for centralized auth
  if (useCentralizedAuth) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Business sx={{ mr: 1 }} />
                <Typography variant="h5" component="h1">
                  EFD Documentation
                </Typography>
              </Box>
              <Typography variant="h6" gutterBottom>
                Redirecting to Authentication
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Please wait while we redirect you to the admin panel for authentication...
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </Box>
              <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center' }}>
                If you are not redirected automatically,{' '}
                <a 
                  href={`${process.env.NEXT_PUBLIC_ADMIN_URL}/auth/signin?callbackUrl=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin + (searchParams.get('callbackUrl') || '/dashboard') : '/dashboard')}`}
                  style={{ color: '#1976d2' }}
                >
                  click here
                </a>
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid credentials or insufficient permissions')
      } else {
        // Refresh session to get updated user data
        await getSession()
        router.push('/dashboard')
      }
    } catch (err) {
      setError('An error occurred during sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Business sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom>
                EFD Documentation
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Internal documentation hub for Engel Fine Design
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoFocus
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
              Access is limited to internal roles: Admin, Artisan, Wholesaler, and Developer accounts only.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}