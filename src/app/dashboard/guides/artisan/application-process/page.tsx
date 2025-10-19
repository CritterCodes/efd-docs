import { getMarkdownContent } from '@/lib/markdown';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Box, Paper } from '@mui/material';

export const metadata = {
  title: 'Artisan Application Process - EFD Documentation',
  description: 'Step-by-step guide to applying for artisan partnership with Engel Fine Design.',
};

export default function ApplicationProcessPage() {
  const { content } = getMarkdownContent('artisan/application-process.md');

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, bgcolor: 'background.paper' }}>
        <MarkdownRenderer content={content} />
      </Paper>
    </Box>
  );
}