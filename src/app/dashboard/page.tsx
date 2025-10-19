'use client'

import { useSession } from 'next-auth/react'
import { useSession as useCentralizedSession } from '@/app/providers/CentralizedSessionProvider'
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Skeleton,
} from '@mui/material'

const USE_CENTRALIZED_AUTH = process.env.NEXT_PUBLIC_USE_CENTRALIZED_AUTH === 'true'

// Debug logging for environment variables
console.log('🔍 [DOCS DEBUG] NEXT_PUBLIC_USE_CENTRALIZED_AUTH:', process.env.NEXT_PUBLIC_USE_CENTRALIZED_AUTH)
console.log('🔍 [DOCS DEBUG] USE_CENTRALIZED_AUTH:', USE_CENTRALIZED_AUTH)
console.log('🔍 [DOCS DEBUG] NEXT_PUBLIC_ADMIN_URL:', process.env.NEXT_PUBLIC_ADMIN_URL)

import {
  PlayArrow,
  NewReleases,
  Search,
  BookmarkBorder,
  TrendingUp,
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { DOC_SECTIONS } from '@/lib/constants'
import { getRecentUpdates } from '@/lib/releases'
import type { User } from '@/types'

export default function DashboardPage() {
  // Use appropriate session hook based on centralized auth setting
  const legacySession = USE_CENTRALIZED_AUTH ? { data: null, status: 'unauthenticated' as const } : useSession()
  const centralizedSession = USE_CENTRALIZED_AUTH ? useCentralizedSession() : null
  
  // Get session data from appropriate source
  const session = USE_CENTRALIZED_AUTH ? centralizedSession?.data : legacySession?.data
  const status = USE_CENTRALIZED_AUTH ? centralizedSession?.status : legacySession?.status
  
  const router = useRouter()
  const user = session?.user as User

  console.log('🔍 [DOCS DASHBOARD] Auth system:', USE_CENTRALIZED_AUTH ? 'CENTRALIZED' : 'LOCAL')
  console.log('🔍 [DOCS DASHBOARD] Session status:', status)
  console.log('🔍 [DOCS DASHBOARD] Session data:', session)
  console.log('🔍 [DOCS DASHBOARD] User role:', session?.user?.role)
  console.log('🔍 [DOCS DASHBOARD] User details:', session?.user)

  // Check for session and redirect to admin if not authenticated
  if (status === 'unauthenticated' || (!session?.user && status !== 'loading')) {
    console.log('❌ [DOCS DASHBOARD] No session found, redirecting to admin login')
    if (typeof window !== 'undefined') {
      const adminLoginUrl = `http://localhost:3001/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`
      window.location.href = adminLoginUrl
    }
    return <div>Redirecting to authentication...</div>
  }

  if (status === 'loading') {
    console.log('⏳ [DOCS DASHBOARD] Loading session...')
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width={300} height={60} />
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 2 }} />
      </Box>
    )
  }

  const hasAccess = (roles: User['role'][]) => {
    if (!user?.role) return false
    return roles.includes(user.role) || user.role === 'admin' || user.role === 'dev'
  }

  // Get individual documentation pages based on user role
  const getAvailableDocuments = () => {
    const documents = []
    
    if (hasAccess(['admin', 'artisan', 'dev'])) {
      documents.push(
        {
          id: 'artisan-overview',
          title: 'Artisan Overview',
          description: 'Complete guide to being an EFD artisan',
          path: '/dashboard/guides/artisan'
        },
        {
          id: 'artisan-application',
          title: 'Application Process',
          description: 'Understanding the artisan application workflow',
          path: '/dashboard/guides/artisan/application-process'
        },
        {
          id: 'artisan-profile',
          title: 'Profile Management',
          description: 'Learn how to optimize your artisan profile',
          path: '/dashboard/guides/artisan/profile-management'
        },
        {
          id: 'artisan-gallery',
          title: 'Gallery Management',
          description: 'Best practices for showcasing your work',
          path: '/dashboard/guides/artisan/gallery-management'
        }
      )
    }
    
    if (hasAccess(['admin', 'wholesaler', 'dev'])) {
      documents.push(
        {
          id: 'wholesale-getting-started',
          title: 'Getting Started',
          description: 'Wholesaler Portal overview and quick start guide',
          path: '/dashboard/guides/wholesale/getting-started'
        },
        {
          id: 'wholesale-repair-submission',
          title: 'Repair Submission',
          description: 'Complete process for submitting repair requests',
          path: '/dashboard/guides/wholesale/repair-submission'
        },
        {
          id: 'wholesale-status-tracking',
          title: 'Status Tracking',
          description: 'Understanding repair statuses and progress tracking',
          path: '/dashboard/guides/wholesale/status-tracking'
        },
        {
          id: 'wholesale-printing-guide',
          title: 'Printing Guide',
          description: 'Generate repair tickets, receipts, and documentation',
          path: '/dashboard/guides/wholesale/printing-guide'
        }
      )
    }
    
    if (hasAccess(['admin', 'dev'])) {
      documents.push({
        id: 'admin-guide',
        title: 'Admin Guide',
        description: 'Platform administration and management documentation',
        path: '/dashboard/guides/admin'
      })
    }
    
    if (hasAccess(['dev'])) {
      documents.push(
        {
          id: 'api-docs',
          title: 'API Reference',
          description: 'Complete API reference and examples',
          path: '/dashboard/docs/api'
        },
        {
          id: 'dev-setup',
          title: 'Development Setup',
          description: 'Local development environment setup',
          path: '/dashboard/docs/development'
        }
      )
    }
    
    return documents
  }

  const availableDocuments = getAvailableDocuments()
  const recentUpdates = getRecentUpdates(3) // Get last 3 updates

  const getRoleGuideInfo = () => {
    switch (user?.role) {
      case 'artisan':
        return {
          title: 'Artisan Guide',
          description: 'Complete guide for managing your artisan profile and gallery',
          path: '/dashboard/guides/artisan'
        }
      case 'wholesaler':
        return {
          title: 'Wholesale Guide',
          description: 'Documentation for wholesale partners and processes',
          path: '/dashboard/guides/wholesale'
        }
      case 'admin':
        return {
          title: 'Admin Guide',
          description: 'Platform administration and management documentation',
          path: '/dashboard/guides/admin'
        }
      case 'dev':
        return {
          title: 'Developer Docs',
          description: 'Technical documentation and API references',
          path: '/dashboard/docs/api'
        }
      default:
        return {
          title: 'Documentation',
          description: 'Platform documentation and guides',
          path: '/dashboard'
        }
    }
  }

  const roleGuide = getRoleGuideInfo()

  const quickStartItems = [
    roleGuide,
    {
      title: 'Latest Release Notes',
      description: 'See what\'s new in the latest update',
      path: '/dashboard/docs/releases/latest',
      roles: ['admin', 'artisan', 'wholesaler', 'dev']
    }
  ].filter((item: any) => !item.roles || hasAccess(item.roles))

  return (
    <Box>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to EFD Documentation
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Your central hub for Engel Fine Design ecosystem documentation
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label={`Version ${process.env.NEXT_PUBLIC_ECOSYSTEM_VERSION || '1.0.0'}`}
            color="primary"
            variant="outlined"
          />
          <Chip 
            label={user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)} Access` : 'Unknown Role'}
            color="secondary"
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Quick Start */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PlayArrow color="primary" />
              Quick Start
            </Typography>
            <Grid container spacing={2}>
              {quickStartItems.map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        onClick={() => router.push(item.path)}
                        endIcon={<PlayArrow />}
                      >
                        Get Started
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Documentation Sections */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BookmarkBorder color="primary" />
              Available Documentation
            </Typography>
            <Grid container spacing={2}>
              {availableDocuments.map((document) => (
                <Grid item xs={12} sm={6} md={4} key={document.id}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: 2,
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s ease-in-out'
                      }
                    }}
                    onClick={() => router.push(document.path)}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {document.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {document.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Recent Updates */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NewReleases color="primary" />
              Recent Updates
            </Typography>
            <List dense>
              {recentUpdates.map((update, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <TrendingUp color={update.type === 'feature' ? 'success' : update.type === 'fix' ? 'warning' : 'error'} />
                  </ListItemIcon>
                  <ListItemText
                    primary={update.title}
                    secondary={`${update.version} - ${update.description}`}
                  />
                </ListItem>
              ))}
            </List>
            <Button 
              variant="outlined" 
              size="small" 
              fullWidth 
              sx={{ mt: 2 }}
              onClick={() => router.push('/docs/releases/latest')}
            >
              View All Updates
            </Button>
          </Paper>

          {/* Search */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Search color="primary" />
              Need Help?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Can't find what you're looking for? Try browsing by category or contact the development team.
            </Typography>
            <Button 
              variant="contained" 
              size="small" 
              fullWidth
              onClick={() => router.push('/docs/search')}
            >
              Search Documentation
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}