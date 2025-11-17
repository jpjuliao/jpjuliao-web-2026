import { getContentFiles, getFileTitle } from '../lib/content';
import Link from 'next/link';

export default function ContentNav() {
  const files = getContentFiles();

  return (
    <nav>
      <ul>
        {files.map(file => {
          const slug = file.replace(/.*\/content\//, '').replace(/\.\w+$/, '');
          const title = getFileTitle(file);
          return (
            <li key={slug}>
              <Link href={`/learn/${slug}`}>{title}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
