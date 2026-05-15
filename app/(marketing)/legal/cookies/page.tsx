// app/(marketing)/legal/cookies/page.tsx
import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/sections/page-placeholder";

export const metadata: Metadata = { title: "Cookies" };

export default function CookiesPage() {
  return (
    <PagePlaceholder
      eyebrow="Legal"
      title="Cookie policy"
      description="Static legal copy. Replace this body with reviewed legal text before launch."
    />
  );
}
