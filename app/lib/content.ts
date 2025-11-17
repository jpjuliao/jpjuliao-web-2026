import fs from 'fs';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content');

export function getContentFiles() {
  const files: string[] = [];

  function readDir(dir: string) {
    const entries = fs.readdirSync(dir);
    entries.forEach(entry => {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        readDir(fullPath);
      } else if (entry.endsWith('.md') || entry.endsWith('.txt')) {
        files.push(fullPath);
      }
    });
  }

  readDir(contentDir);
  return files;
}

export function getFileTitle(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : path.basename(filePath, path.extname(filePath));
}

export function getContentBySlug(slug: string) {
  const filePath = path.join(contentDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf-8');
}