import type { User } from '@/types'

export interface NavigationItem {
  title: string
  path?: string
  icon?: string
  roles: User['role'][]
  children?: NavigationItem[]
}

export const DOC_SECTIONS = [
  {
    id: 'artisan',
    title: 'Artisan Guide',
    description: 'Complete guide for artisans to manage their profiles and galleries',
    roles: ['admin', 'artisan', 'dev'] as User['role'][],
    subsections: ['Overview', 'Application Process', 'Profile Management', 'Gallery Management']
  },
  {
    id: 'wholesale',
    title: 'Wholesale Guide',
    description: 'Documentation for wholesale partners and processes',
    roles: ['admin', 'wholesaler', 'dev'] as User['role'][],
    subsections: ['Getting Started', 'Repair Submission', 'Status Tracking', 'Printing Guide']
  },
  {
    id: 'admin',
    title: 'Admin Guide',
    description: 'Platform administration and management documentation',
    roles: ['admin', 'dev'] as User['role'][],
    subsections: ['Platform Management']
  },
  {
    id: 'developer',
    title: 'Developer Docs',
    description: 'Technical documentation and API references',
    roles: ['dev'] as User['role'][],
    subsections: ['API Reference', 'Development Setup']
  }
]

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: 'Dashboard',
    roles: ['admin', 'artisan', 'wholesaler', 'dev']
  },
  {
    title: 'Artisan Guide',
    icon: 'Palette',
    roles: ['admin', 'artisan', 'dev'],
    children: [
      {
        title: 'Overview',
        path: '/dashboard/guides/artisan',
        roles: ['admin', 'artisan', 'dev']
      },
      {
        title: 'Application Process',
        path: '/dashboard/guides/artisan/application-process',
        roles: ['admin', 'artisan', 'dev']
      },
      {
        title: 'Profile Management',
        path: '/dashboard/guides/artisan/profile-management',
        roles: ['admin', 'artisan', 'dev']
      },
      {
        title: 'Gallery Management',
        path: '/dashboard/guides/artisan/gallery-management',
        roles: ['admin', 'artisan', 'dev']
      }
    ]
  },
  {
    title: 'Wholesale Guide',
    icon: 'Business',
    roles: ['admin', 'wholesaler', 'dev'],
    children: [
      {
        title: 'Getting Started',
        path: '/dashboard/guides/wholesale/getting-started',
        roles: ['admin', 'wholesaler', 'dev']
      },
      {
        title: 'Repair Submission',
        path: '/dashboard/guides/wholesale/repair-submission',
        roles: ['admin', 'wholesaler', 'dev']
      },
      {
        title: 'Status Tracking',
        path: '/dashboard/guides/wholesale/status-tracking',
        roles: ['admin', 'wholesaler', 'dev']
      },
      {
        title: 'Printing Guide',
        path: '/dashboard/guides/wholesale/printing-guide',
        roles: ['admin', 'wholesaler', 'dev']
      }
    ]
  },
  {
    title: 'Admin Guide',
    icon: 'AdminPanelSettings',
    roles: ['admin', 'dev'],
    children: [
      {
        title: 'Platform Management',
        path: '/dashboard/guides/admin',
        roles: ['admin', 'dev']
      }
    ]
  },
  {
    title: 'Developer Docs',
    icon: 'Code',
    roles: ['dev'],
    children: [
      {
        title: 'API Reference',
        path: '/dashboard/docs/api',
        roles: ['dev']
      },
      {
        title: 'Development Setup',
        path: '/dashboard/docs/development',
        roles: ['dev']
      }
    ]
  },
  {
    title: 'Release Notes',
    path: '/dashboard/docs/releases/latest',
    icon: 'NewReleases',
    roles: ['admin', 'artisan', 'wholesaler', 'dev']
  }
]