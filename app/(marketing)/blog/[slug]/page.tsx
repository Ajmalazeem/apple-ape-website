// app/(marketing)/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/sections/page-placeholder";

export const metadata: Metadata = { title: "Post" };

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <PagePlaceholder
      eyebrow="Post"
      title={slug}
      description="MDX rendering via next-mdx-remote/rsc, author, reading time, and share buttons ship in Phase 2."
    />
  );
}
