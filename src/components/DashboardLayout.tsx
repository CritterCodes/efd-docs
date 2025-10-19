'use client'

import { useState } from 'react'
import { Box, AppBar, Toolbar, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material'
import { Menu, ExitToApp } from '@mui/icons-material'
import { signOut } from 'next-auth/react'
import { DocumentationSidebar } from '@/components/DocumentationSidebar'

interface Props {
  children: React.ReactNode
}

export function DashboardLayout({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' })
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - 280px)` },
          ml: { md: '280px' },
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <Menu />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            EFD Documentation Hub
          </Typography>

          <IconButton
            color="inherit"
            onClick={handleSignOut}
            aria-label="sign out"
          >
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <DocumentationSidebar 
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - 280px)` },
          mt: '64px', // AppBar height
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: 'background.default',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}