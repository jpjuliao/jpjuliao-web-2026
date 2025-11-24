import { use, Suspense } from "react";
import ContentNavClient from "./ContentNav.client";

export default function ContentNavServer({ slugPromise = Promise.resolve([]) }: { slugPromise: Promise<string[]> }) {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const url = new URL(`${baseUrl}/api/contents`);
  const slug = use(slugPromise);
  url.searchParams.set('slug', slug.join('/'));
  const filesPromise = fetch(url).then((res) => res.json());
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ContentNavClient filesPromise={filesPromise} />
      </Suspense>
    </div>
  );
}