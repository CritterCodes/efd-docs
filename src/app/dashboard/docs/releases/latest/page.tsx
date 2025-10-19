import React from 'react'
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Container
} from '@mui/material'
import { 
  NewReleases, 
  FiberNew, 
  BugReport, 
  Warning 
} from '@mui/icons-material'
import { RELEASE_NOTES } from '@/lib/releases'

export const metadata = {
  title: 'Release Notes - Engel Fine Design Documentation',
  description: 'Latest updates and changes to the Engel Fine Design platform'
}

export default function ReleaseNotesPage() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'major': return 'error'
      case 'minor': return 'success'  
      case 'patch': return 'warning'
      default: return 'default'
    }
  }

  const getTypeIcon = (itemType: string) => {
    switch (itemType) {
      case 'feature': return <FiberNew color="success" />
      case 'fix': return <BugReport color="warning" />
      case 'breaking': return <Warning color="error" />
      default: return <NewReleases />
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h1" component="h1" gutterBottom>
          Release Notes
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Stay up to date with the latest changes, features, and improvements to the 
          Engel Fine Design ecosystem.
        </Typography>

        <Box sx={{ mt: 4 }}>
          {RELEASE_NOTES.map((release, index) => (
            <Card key={release.version} sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="h4" component="h2">
                    {release.version}
                  </Typography>
                  <Chip 
                    label={release.type} 
                    color={getTypeColor(release.type) as any}
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(release.date).toLocaleDateString()}
                  </Typography>
                </Box>

                <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                  {release.summary}
                </Typography>

                {release.breaking.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" color="error" gutterBottom>
                      ⚠️ Breaking Changes
                    </Typography>
                    <List dense>
                      {release.breaking.map((item, idx) => (
                        <ListItem key={idx} sx={{ pl: 0 }}>
                          <ListItemIcon>
                            {getTypeIcon('breaking')}
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {release.features.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      ✨ New Features
                    </Typography>
                    <List dense>
                      {release.features.map((feature, idx) => (
                        <ListItem key={idx} sx={{ pl: 0 }}>
                          <ListItemIcon>
                            {getTypeIcon('feature')}
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {release.fixes.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      🐛 Bug Fixes
                    </Typography>
                    <List dense>
                      {release.fixes.map((fix, idx) => (
                        <ListItem key={idx} sx={{ pl: 0 }}>
                          <ListItemIcon>
                            {getTypeIcon('fix')}
                          </ListItemIcon>
                          <ListItemText primary={fix} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
              
              {index < RELEASE_NOTES.length - 1 && <Divider />}
            </Card>
          ))}
        </Box>

        {RELEASE_NOTES.length === 0 && (
          <Card>
            <CardContent>
              <Typography variant="body1" color="text.secondary">
                No release notes available yet.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  )
}