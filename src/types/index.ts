export interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: 'admin' | 'artisan' | 'wholesaler' | 'customer' | 'dev'
  artisanTypes?: string[]
  isActive?: boolean
}

export interface DocSection {
  id: string
  title: string
  description: string
  roles: User['role'][]
  icon: string
  order: number
  subsections?: DocSubsection[]
}

export interface DocSubsection {
  id: string
  title: string
  slug: string
  description: string
  roles: User['role'][]
  lastUpdated: string
  version?: string
  category: 'guide' | 'api' | 'release-notes' | 'policy' | 'troubleshooting'
}

export interface DocContent {
  title: string
  description: string
  content: string
  lastUpdated: string
  version: string
  roles: User['role'][]
  category: DocSubsection['category']
  tags: string[]
  author?: string
  relatedDocs?: string[]
}

export interface NavigationItem {
  title: string
  path: string
  icon?: string
  roles: User['role'][]
  children?: NavigationItem[]
}

export interface ReleaseNote {
  version: string
  date: string
  type: 'major' | 'minor' | 'patch' | 'hotfix'
  components: ('shop' | 'admin' | 'database' | 'docs')[]
  changes: {
    component: string
    items: string[]
  }[]
  breaking?: boolean
  migration?: string
}