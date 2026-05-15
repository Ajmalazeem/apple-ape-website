// components/sections/latest-posts.tsx
import Link from "next/link";
import { PostCard } from "@/components/cards/post-card";
import type { Database } from "@/types/database.types";

type Post = Database["public"]["Tables"]["posts"]["Row"];

export function LatestPosts({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  return (
    <section className="container py-24 lg:py-32" aria-labelledby="latest-posts-heading">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="label-mono">Editorial</span>
          <h2
            id="latest-posts-heading"
            className="mt-4 font-display text-h2 leading-tight tracking-[-0.01em] text-ink"
          >
            Notes from the studio.
          </h2>
        </div>
        <Link href="/blog" className="text-sm text-ink underline underline-offset-4 hover:text-ink/70">
          All posts →
        </Link>
      </div>
      <ul className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
}
