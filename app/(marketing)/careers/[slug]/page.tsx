// app/(marketing)/careers/[slug]/page.tsx
import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/sections/page-placeholder";

export const metadata: Metadata = { title: "Open role" };

export default async function CareerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <PagePlaceholder
      eyebrow="Open role"
      title={slug}
      description="Job description, requirements, perks, and an apply form (server action → job_applications) ship in Phase 3."
      phase="Phase 3"
    />
  );
}
