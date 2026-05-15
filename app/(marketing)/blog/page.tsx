// app/(marketing)/blog/page.tsx
import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/sections/page-placeholder";

export const metadata: Metadata = { title: "Blog" };

export default function BlogIndexPage() {
  return (
    <PagePlaceholder
      eyebrow="Blog"
      title="Notes from the studio."
      description="Paginated list of posts with coral taxonomy chips and rule-separated rows."
    />
  );
}
