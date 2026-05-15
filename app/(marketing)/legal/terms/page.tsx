// app/(marketing)/legal/terms/page.tsx
import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/sections/page-placeholder";

export const metadata: Metadata = { title: "Terms of service" };

export default function TermsPage() {
  return (
    <PagePlaceholder
      eyebrow="Legal"
      title="Terms of service"
      description="Static legal copy. Replace this body with reviewed legal text before launch."
    />
  );
}
