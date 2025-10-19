'use client';

import { Typography, Box, Link, Divider } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  title?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, title }) => {
  const components: Components = {
    h1: ({ children }) => (
      <Typography variant="h3" component="h1" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
        {children}
      </Typography>
    ),
    h2: ({ children }) => (
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 3, mb: 2, fontWeight: 'semibold' }}>
        {children}
      </Typography>
    ),
    h3: ({ children }) => (
      <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 2, mb: 1, fontWeight: 'semibold' }}>
        {children}
      </Typography>
    ),
    h4: ({ children }) => (
      <Typography variant="h6" component="h4" gutterBottom sx={{ mt: 2, mb: 1 }}>
        {children}
      </Typography>
    ),
    p: ({ children }) => (
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, mb: 2 }}>
        {children}
      </Typography>
    ),
    ul: ({ children }) => (
      <Box component="ul" sx={{ pl: 3, mb: 2 }}>
        {children}
      </Box>
    ),
    ol: ({ children }) => (
      <Box component="ol" sx={{ pl: 3, mb: 2 }}>
        {children}
      </Box>
    ),
    li: ({ children }) => (
      <Typography component="li" variant="body1" sx={{ mb: 0.5 }}>
        {children}
      </Typography>
    ),
    blockquote: ({ children }) => (
      <Box sx={{ 
        borderLeft: 3, 
        borderColor: 'primary.main', 
        pl: 2, 
        py: 1, 
        bgcolor: 'grey.50',
        mb: 2,
        fontStyle: 'italic'
      }}>
        {children}
      </Box>
    ),
    code: ({ children, className }) => {
      const isInline = !className;
      
      if (isInline) {
        return (
          <Box component="code" sx={{ 
            bgcolor: 'grey.100', 
            px: 0.5, 
            py: 0.25, 
            borderRadius: 1, 
            fontFamily: 'monospace',
            fontSize: '0.875em'
          }}>
            {children}
          </Box>
        );
      }
      
      return (
        <Box sx={{ 
          bgcolor: 'grey.100', 
          p: 2, 
          borderRadius: 1, 
          mb: 2,
          overflow: 'auto'
        }}>
          <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '0.875em' }}>
            {children}
          </Box>
        </Box>
      );
    },
    a: ({ href, children }) => (
      <Link href={href} color="primary" sx={{ textDecoration: 'underline' }}>
        {children}
      </Link>
    ),
    hr: () => <Divider sx={{ my: 3 }} />,
    strong: ({ children }) => (
      <Box component="strong" sx={{ fontWeight: 'bold' }}>
        {children}
      </Box>
    ),
    em: ({ children }) => (
      <Box component="em" sx={{ fontStyle: 'italic' }}>
        {children}
      </Box>
    ),
  };

  return (
    <Box sx={{ maxWidth: '100%', '& > *:first-of-type': { mt: 0 } }}>
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownRenderer;