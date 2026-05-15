// app/(marketing)/about/page.tsx
import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/sections/page-placeholder";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PagePlaceholder
      eyebrow="About"
      title="A small studio building product for play."
      description="Studio story, mission, leadership, and full team grid (sourced from team_members)."
    />
  );
}
