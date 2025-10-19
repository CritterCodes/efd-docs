'use client'

import { Container, Paper, Typography, Button, Box } from '@mui/material'
import { Error } from '@mui/icons-material'
import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'CredentialsSignin':
        return 'Invalid email or password. Please check your credentials and try again.'
      case 'AccessDenied':
        return 'Access denied. This documentation is only available to internal users (Admin, Artisan, Wholesaler, Developer).'
      case 'Configuration':
        return 'Server configuration error. Please contact the development team.'
      default:
        return 'An unexpected error occurred during authentication.'
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
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Error sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          
          <Typography variant="h4" component="h1" gutterBottom>
            Authentication Error
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error ? getErrorMessage(error) : 'An authentication error occurred.'}
          </Typography>

          <Button
            component={Link}
            href="/auth/signin"
            variant="contained"
            size="large"
          >
            Try Again
          </Button>
        </Paper>
      </Box>
    </Container>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <Container maxWidth="sm">
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}