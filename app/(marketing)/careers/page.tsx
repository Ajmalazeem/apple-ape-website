// app/(marketing)/careers/page.tsx
import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/sections/page-placeholder";

export const metadata: Metadata = { title: "Careers" };

export default function CareersPage() {
  return (
    <PagePlaceholder
      eyebrow="Careers"
      title="Build product with us."
      description="Open roles (sourced from job_openings), values, and perks."
    />
  );
}
