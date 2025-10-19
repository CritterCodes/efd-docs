import { getMarkdownContent } from '@/lib/markdown';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Box, Paper } from '@mui/material';

export const metadata = {
  title: 'Profile Management - EFD Documentation',
  description: 'Learn how to manage and optimize your artisan profile on the EFD platform.',
};

export default function ProfileManagementPage() {
  const { content } = getMarkdownContent('artisan/profile-management.md');

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, bgcolor: 'background.paper' }}>
        <MarkdownRenderer content={content} />
      </Paper>
    </Box>
  );
}