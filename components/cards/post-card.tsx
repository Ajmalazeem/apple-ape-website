// components/cards/post-card.tsx
import Image from "next/image";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { readingTimeMinutes } from "@/lib/content/mdx";
import type { Database } from "@/types/database.types";

type Post = Database["public"]["Tables"]["posts"]["Row"];

export function PostCard({ post, className }: { post: Post; className?: string }) {
  const minutes = readingTimeMinutes(post.content_mdx);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex flex-col gap-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue rounded-md",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-soft-stone">
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span className="label-mono">Studio</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3">
        {post.tags.length ? (
          <ul className="flex flex-wrap gap-2">
            {post.tags.slice(0, 2).map((tag) => (
              <li
                key={tag}
                className="rounded-pill border border-coral bg-canvas px-3 py-1 text-xs text-ink"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
        <h3 className="font-display text-h4 leading-tight text-ink group-hover:underline underline-offset-4">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="text-sm text-ink/70 line-clamp-2">{post.excerpt}</p>
        ) : null}
        <p className="label-mono">
          {post.published_at ? formatDate(post.published_at) : "Draft"} · {minutes} min read
        </p>
      </div>
    </Link>
  );
}
