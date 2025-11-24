'use client';

import { use } from 'react';
import Link from 'next/link';
import { FileNode } from '@/app/lib/get-files';

export default function ContentNavClient(
  { filesPromise }: { filesPromise: Promise<FileNode[]> }
) {
  const files = use(filesPromise);
  const link = (path: string) => `/learn/${path}`.replace(/\.mdx?$/, '');
  return (
    <div>
      <ul>
        {files.map((file) => (
          <li key={file.path}>
            <Link href={link(file.path)}>{file.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
