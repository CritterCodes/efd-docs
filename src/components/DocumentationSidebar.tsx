'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Dashboard,
  Palette,
  Business,
  AdminPanelSettings,
  Code,
  NewReleases,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material'
import { useSession } from 'next-auth/react'
import { useSession as useCentralizedSession } from '@/app/providers/CentralizedSessionProvider'
import { useRouter, usePathname } from 'next/navigation'
import { NAVIGATION_ITEMS, type NavigationItem } from '@/lib/constants'

const USE_CENTRALIZED_AUTH = process.env.NEXT_PUBLIC_USE_CENTRALIZED_AUTH === 'true'
import type { User } from '@/types'

const DRAWER_WIDTH = 280

const iconMap = {
  Dashboard,
  Palette,
  Business,
  AdminPanelSettings,
  Code,
  NewReleases,
}

interface Props {
  mobileOpen: boolean
  onMobileClose: () => void
}

export function DocumentationSidebar({ mobileOpen, onMobileClose }: Props) {
  // Use appropriate session hook based on centralized auth setting
  const legacySession = USE_CENTRALIZED_AUTH ? null : useSession()
  const centralizedSession = USE_CENTRALIZED_AUTH ? useCentralizedSession() : null
  
  // Get session data from appropriate source
  const session = USE_CENTRALIZED_AUTH ? centralizedSession?.data : legacySession?.data
  
  const router = useRouter()
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  // Auto-expand sections based on current path
  const getInitialExpandedItems = () => {
    const expanded: string[] = []
    NAVIGATION_ITEMS.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => child.path && pathname.startsWith(child.path))
        if (hasActiveChild) {
          expanded.push(item.path || item.title)
        }
      }
    })
    return expanded
  }
  
  const [expandedItems, setExpandedItems] = useState<string[]>(getInitialExpandedItems)
  
  // Update expanded items when pathname changes
  useEffect(() => {
    setExpandedItems(getInitialExpandedItems())
  }, [pathname])
  
  const user = session?.user as User

  const toggleExpanded = (path: string) => {
    setExpandedItems(prev => 
      prev.includes(path) 
        ? prev.filter(item => item !== path)
        : [...prev, path]
    )
  }

  const handleNavigation = (path: string) => {
    router.push(path)
    if (isMobile) {
      onMobileClose()
    }
  }

  const hasAccess = (roles: User['role'][]) => {
    if (!user?.role) return false
    return roles.includes(user.role) || user.role === 'admin' || user.role === 'dev'
  }

  const filteredNavItems = NAVIGATION_ITEMS.filter(item => hasAccess(item.roles))

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          EFD Documentation
        </Typography>
        <Chip 
          label={`v${process.env.ECOSYSTEM_VERSION || '1.0.0'}`}
          size="small" 
          color="primary"
          sx={{ mt: 1 }}
        />
      </Box>

      {/* User Info */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary">
          Signed in as
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {user?.name || user?.email}
        </Typography>
        <Chip 
          label={user?.role || 'Unknown'}
          size="small"
          variant="outlined"
          sx={{ mt: 0.5, textTransform: 'capitalize' }}
        />
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List>
          {filteredNavItems.map((item) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap]
            const itemKey = item.path || item.title
            const isExpanded = expandedItems.includes(itemKey)
            const isActive = item.path ? pathname === item.path : false
            const hasChildren = item.children && item.children.length > 0
            const filteredChildren = item.children?.filter(child => hasAccess(child.roles))

            return (
              <Box key={itemKey}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      if (hasChildren && filteredChildren && filteredChildren.length > 0) {
                        toggleExpanded(itemKey)
                      } else if (item.path) {
                        handleNavigation(item.path)
                      }
                    }}
                    sx={{
                      bgcolor: isActive ? 'primary.main' : 'transparent',
                      color: isActive ? 'primary.contrastText' : 'text.primary',
                      '&:hover': {
                        bgcolor: isActive ? 'primary.dark' : 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit' }}>
                      {IconComponent && <IconComponent />}
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
                    {hasChildren && filteredChildren && filteredChildren.length > 0 && (
                      isExpanded ? <ExpandLess /> : <ExpandMore />
                    )}
                  </ListItemButton>
                </ListItem>

                {hasChildren && filteredChildren && filteredChildren.length > 0 && (
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {filteredChildren.map((child) => {
                        const isChildActive = pathname === child.path
                        return (
                          <ListItem key={child.path} disablePadding>
                            <ListItemButton
                              sx={{
                                pl: 4,
                                bgcolor: isChildActive ? 'primary.main' : 'transparent',
                                color: isChildActive ? 'primary.contrastText' : 'text.primary',
                                '&:hover': {
                                  bgcolor: isChildActive ? 'primary.dark' : 'action.hover',
                                },
                              }}
                              onClick={() => child.path && handleNavigation(child.path)}
                            >
                              <ListItemText primary={child.title} />
                            </ListItemButton>
                          </ListItem>
                        )
                      })}
                    </List>
                  </Collapse>
                )}
              </Box>
            )
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          Last updated: {new Date().toLocaleDateString()}
        </Typography>
      </Box>
    </Box>
  )

  return (
    <Box
      component="nav"
      sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  )
}