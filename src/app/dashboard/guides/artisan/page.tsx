import { getMarkdownContent } from '@/lib/markdown';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Box, Typography, Paper } from '@mui/material';

export const metadata = {
  title: 'Artisan Guide - EFD Documentation',
  description: 'Comprehensive guide for EFD artisan partners covering application, profile management, and gallery features.',
};

export default function ArtisanGuidePage() {
  const { content } = getMarkdownContent('artisan/index.md');

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, bgcolor: 'background.paper' }}>
        <MarkdownRenderer content={content} />
      </Paper>
    </Box>
  );
}