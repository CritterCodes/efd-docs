'use client'

import { useState, useEffect } from 'react'
import { Box, Typography, Paper, Skeleton } from '@mui/material'
import ReactMarkdown from 'react-markdown'

interface Props {
  contentPath: string
  title: string
}

export function DocumentationPage({ contentPath, title }: Props) {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true)
        // In a real implementation, you'd fetch from an API or import the markdown
        // For now, let's create a placeholder
        const response = await fetch(`/api/content${contentPath}`)
        if (response.ok) {
          const text = await response.text()
          setContent(text)
        } else {
          // Fallback content for development
          setContent(`# ${title}\n\nContent is being loaded from \`${contentPath}\`.\n\nThis page will display the wholesale documentation content.`)
        }
      } catch (err) {
        console.error('Error loading content:', err)
        setError('Failed to load content')
        // Fallback content
        setContent(`# ${title}\n\nContent is being loaded from \`${contentPath}\`.\n\nThis page will display the wholesale documentation content.`)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [contentPath, title])

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="80%" />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="rectangular" height={200} />
        </Box>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </Paper>
    </Box>
  )
}