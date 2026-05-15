// app/(marketing)/apps/page.tsx
import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/sections/page-placeholder";

export const metadata: Metadata = { title: "Apps" };

export default function AppsPage() {
  return (
    <PagePlaceholder
      eyebrow="Apps"
      title="Utilities and consumer apps."
      description="Non-game apps grid and detail surfaces."
    />
  );
}
