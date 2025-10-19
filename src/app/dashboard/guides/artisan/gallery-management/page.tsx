import { getMarkdownContent } from '@/lib/markdown';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Box, Paper } from '@mui/material';

export const metadata = {
  title: 'Gallery Management - EFD Documentation',
  description: 'Master the EFD gallery system to showcase your portfolio and attract customers.',
};

export default function GalleryManagementPage() {
  const { content } = getMarkdownContent('artisan/gallery-management.md');

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, bgcolor: 'background.paper' }}>
        <MarkdownRenderer content={content} />
      </Paper>
    </Box>
  );
}