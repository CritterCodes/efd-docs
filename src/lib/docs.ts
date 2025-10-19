import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { DocContent, ReleaseNote } from '@/types'

const docsDirectory = path.join(process.cwd(), 'docs')
const ecosystemChangelogPath = path.join(process.cwd(), '../ECOSYSTEM_CHANGELOG.md')

export async function getDocContent(slug: string): Promise<DocContent | null> {
  try {
    const fullPath = path.join(docsDirectory, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      title: data.title || 'Untitled',
      description: data.description || '',
      content,
      lastUpdated: data.lastUpdated || new Date().toISOString(),
      version: data.version || '1.0.0',
      roles: data.roles || ['admin'],
      category: data.category || 'guide',
      tags: data.tags || [],
      author: data.author,
      relatedDocs: data.relatedDocs || []
    }
  } catch (error) {
    console.error('Error reading doc content:', error)
    return null
  }
}

export async function getAllDocSlugs(): Promise<string[]> {
  try {
    if (!fs.existsSync(docsDirectory)) {
      return []
    }

    const fileNames = fs.readdirSync(docsDirectory, { recursive: true })
    return fileNames
      .filter((name) => typeof name === 'string' && name.endsWith('.md'))
      .map((name) => (name as string).replace(/\.md$/, ''))
  } catch (error) {
    console.error('Error reading doc slugs:', error)
    return []
  }
}

export async function getReleaseNotes(): Promise<ReleaseNote[]> {
  try {
    if (!fs.existsSync(ecosystemChangelogPath)) {
      return []
    }

    const fileContents = fs.readFileSync(ecosystemChangelogPath, 'utf8')
    const releases: ReleaseNote[] = []
    
    // Parse changelog markdown to extract release information
    const lines = fileContents.split('\n')
    let currentRelease: Partial<ReleaseNote> | null = null
    let currentComponent = ''
    
    for (const line of lines) {
      // Match version headers like ## [1.0.0] - 2025-10-18
      const versionMatch = line.match(/^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})/)
      if (versionMatch) {
        if (currentRelease) {
          releases.push(currentRelease as ReleaseNote)
        }
        currentRelease = {
          version: versionMatch[1],
          date: versionMatch[2],
          type: 'minor', // Default, could be enhanced to detect from version
          components: [],
          changes: []
        }
        continue
      }
      
      // Match component headers like ### Shop (efd-shop)
      const componentMatch = line.match(/^### (Shop|Admin|Database|Shared)/)
      if (componentMatch && currentRelease) {
        currentComponent = componentMatch[1].toLowerCase()
        if (!currentRelease.components?.includes(currentComponent as any)) {
          currentRelease.components?.push(currentComponent as any)
        }
        continue
      }
      
      // Match change items like - Added new feature
      const changeMatch = line.match(/^- (.+)/)
      if (changeMatch && currentRelease && currentComponent) {
        const existingChange = currentRelease.changes?.find(c => c.component === currentComponent)
        if (existingChange) {
          existingChange.items.push(changeMatch[1])
        } else {
          currentRelease.changes?.push({
            component: currentComponent,
            items: [changeMatch[1]]
          })
        }
      }
    }
    
    if (currentRelease) {
      releases.push(currentRelease as ReleaseNote)
    }
    
    return releases
  } catch (error) {
    console.error('Error reading release notes:', error)
    return []
  }
}

export function searchDocs(query: string, docs: DocContent[]): DocContent[] {
  if (!query.trim()) return docs
  
  const searchTerm = query.toLowerCase()
  
  return docs.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm) ||
    doc.description.toLowerCase().includes(searchTerm) ||
    doc.content.toLowerCase().includes(searchTerm) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}

export function filterDocsByRole(docs: DocContent[], userRole: string): DocContent[] {
  return docs.filter(doc => 
    doc.roles.includes(userRole as any) ||
    doc.roles.includes('admin' as any) ||
    userRole === 'admin' ||
    userRole === 'dev'
  )
}