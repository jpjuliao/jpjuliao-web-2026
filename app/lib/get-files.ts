import fs from 'fs';
import path from 'path';

export type FileNode = {
  name: string;
  path: string;
  kind: 'file' | 'directory';
  children?: FileNode[];
};

export function getFiles(
  baseDir: string, depth: number = 0):
  FileNode[] {

  const files = fs.readdirSync(baseDir);

  const result = files.map((file): FileNode => {
    const filePath = path.join(baseDir, file);
    const stat = fs.statSync(filePath);
    const relativePath = path.relative(baseDir, filePath);

    if (stat.isDirectory() && depth > 0) {
      return {
        name: file,
        path: relativePath,
        kind: 'directory' as const,
        children: getFiles(filePath, depth - 1),
      };
    } else {
      return {
        name: file,
        path: relativePath,
        kind: (stat.isFile() ? 'file' : 'directory') as 'file' | 'directory',
      };
    }
  })

  return result;
}
