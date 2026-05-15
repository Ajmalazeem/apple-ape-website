// app/(marketing)/games/page.tsx
import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/sections/page-placeholder";

export const metadata: Metadata = { title: "Games" };

export default function GamesPage() {
  return (
    <PagePlaceholder
      eyebrow="Games"
      title="Android & mobile games we have shipped."
      description="A grid of every title we have released, with filters for genre, platform, and status."
    />
  );
}
