import { Suspense, use } from "react";
import ContentNavServer from "@/app/component/content-nav/ContentNav.server";

export default function Page(
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = use(params);
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ContentNavServer slugPromise={Promise.resolve(slug)} />
      </Suspense>
      <h1>{slug.join('/')}</h1>
    </div>
  );
}
