import Link from "next/link";

export default function Home() {
  return (
    <main>
      <ul className="flex gap-5 p-5 uppercase font-bold justify-center">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/learn">Learn</Link>
        </li>
        <li>
          <Link href="/blog">Blog</Link>
        </li>
      </ul>
    </main>
  );
}