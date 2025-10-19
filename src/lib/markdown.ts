import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content');

export function getMarkdownContent(filePath: string) {
  try {
    const fullPath = path.join(contentDirectory, filePath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      frontmatter: data,
      content,
    };
  } catch (error) {
    console.error(`Error reading markdown file: ${filePath}`, error);
    return {
      frontmatter: {},
      content: '# Content Not Found\n\nThe requested documentation could not be loaded.',
    };
  }
}

export function getAllMarkdownFiles(directory: string) {
  try {
    const fullPath = path.join(contentDirectory, directory);
    const files = fs.readdirSync(fullPath);
    
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = path.join(directory, file);
        const { frontmatter } = getMarkdownContent(filePath);
        
        return {
          slug: file.replace('.md', ''),
          filePath,
          ...frontmatter,
        };
      });
  } catch (error) {
    console.error(`Error reading directory: ${directory}`, error);
    return [];
  }
}