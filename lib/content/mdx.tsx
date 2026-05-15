// lib/content/mdx.ts
// Server-side MDX renderer for posts stored in posts.content_mdx.
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import { cn } from "@/lib/utils";

// Reading time — naive words/200 estimate, good enough for blog post chips.
export function readingTimeMinutes(mdx: string): number {
  const words = mdx.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// Editorial typography baked into the rendered MDX tree.
const mdxComponents: MDXRemoteProps["components"] = {
  h1: ({ className, ...p }) => (
    <h1 className={cn("font-display text-h2 mt-12 mb-6 text-ink tracking-[-0.01em]", className)} {...p} />
  ),
  h2: ({ className, ...p }) => (
    <h2 className={cn("font-display text-h3 mt-12 mb-5 text-ink tracking-[-0.01em]", className)} {...p} />
  ),
  h3: ({ className, ...p }) => (
    <h3 className={cn("font-display text-h4 mt-10 mb-4 text-ink", className)} {...p} />
  ),
  p: ({ className, ...p }) => (
    <p className={cn("text-base leading-[1.6] text-ink/85 mb-5", className)} {...p} />
  ),
  a: ({ className, ...p }) => (
    <a className={cn("text-action-blue underline underline-offset-4 hover:text-action-blue/80", className)} {...p} />
  ),
  ul: ({ className, ...p }) => (
    <ul className={cn("list-disc pl-6 mb-5 text-ink/85 space-y-2", className)} {...p} />
  ),
  ol: ({ className, ...p }) => (
    <ol className={cn("list-decimal pl-6 mb-5 text-ink/85 space-y-2", className)} {...p} />
  ),
  blockquote: ({ className, ...p }) => (
    <blockquote className={cn("border-l-2 border-ink pl-5 italic text-ink/80 my-8", className)} {...p} />
  ),
  code: ({ className, ...p }) => (
    <code className={cn("font-mono text-sm bg-soft-stone rounded-xs px-1.5 py-0.5", className)} {...p} />
  ),
  hr: ({ className, ...p }) => (
    <hr className={cn("my-12 border-hairline", className)} {...p} />
  ),
};

export function RenderedPost({ source }: { source: string }) {
  return (
    <div className="font-body">
      <MDXRemote source={source} components={mdxComponents} />
    </div>
  );
}
