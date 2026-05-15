// app/(marketing)/legal/privacy/page.tsx
import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/sections/page-placeholder";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <PagePlaceholder
      eyebrow="Legal"
      title="Privacy policy"
      description="Static legal copy. Replace this body with reviewed legal text before launch."
    />
  );
}
