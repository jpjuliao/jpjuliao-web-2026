import { getContentFiles, getFileTitle } from '../lib/content';
import Link from 'next/link';
import path from 'path';

interface FolderStructure {
  [key: string]: FolderStructure | null;
}


export default function ContentNav() {
  const contentDir = path.join(process.cwd(), 'content');
  const files = getContentFiles();

  const buildStructure = (files: string[]): FolderStructure => {
    const structure: FolderStructure = {};

    files.forEach(file => {
      console.log(file);
      const slug = file.replace(contentDir, '');
      const parts = slug.split('/');

      let current = structure;
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          current[part] = null;
        } else {
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part] as FolderStructure;
        }
      });
    });

    return structure;
  };

  const renderStructure = (structure: FolderStructure, basePath: string = '') => {
    return (
      <ul>
        {Object.keys(structure).map(key => {
          const isFolder = structure[key] !== null;
          const fullPath = basePath ? `${basePath}/${key}` : key;
          const title = isFolder ? key : getFileTitle(path.join(contentDir, fullPath));

          return (
            <li key={fullPath}>
              {isFolder ? (
                <>
                  <span>{key}</span>
                  {renderStructure(structure[key] as FolderStructure, fullPath)}
                </>
              ) : (
                <Link href={`/learn/${fullPath.replace('.md', '')}`}>{title}</Link>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  const structure = buildStructure(files);
  console.log('build structure', structure);

  return (
    <nav>
      {renderStructure(structure)}
    </nav>
  );
}