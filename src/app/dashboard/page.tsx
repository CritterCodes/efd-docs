'use client'

import { useSession } from 'next-auth/react'
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
  const { data: session, status } = useSession()
  const router = useRouter()
  const user = session?.user as User

  if (status === 'loading') {
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
      documents.push({
        id: 'wholesale-guide',
        title: 'Wholesale Guide',
        description: 'Documentation for wholesale partners and processes',
        path: '/dashboard/guides/wholesale'
      })
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