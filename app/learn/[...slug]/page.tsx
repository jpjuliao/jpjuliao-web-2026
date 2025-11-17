import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDir = path.join(process.cwd(), 'content');

async function getContentFromSlug(slugArray: string[]) {
  const slugPath = slugArray.join('/');
  const fullPath = path.join(contentDir, `${slugPath}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    data,
    contentHtml,
  };
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const { slug } = await params;
  const { data, contentHtml } = await getContentFromSlug(slug);

  return (
    <main>
      <h1>{data.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </main>
  );
}
