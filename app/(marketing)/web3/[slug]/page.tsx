// app/(marketing)/web3/[slug]/page.tsx
import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/sections/page-placeholder";

export const metadata: Metadata = { title: "Web3 Project" };

export default async function Web3DetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <PagePlaceholder
      eyebrow="Web3 project"
      title={slug}
      description="Live URL, contract addresses (copy-to-clipboard), supported wallets, and audit links ship in Phase 2."
    />
  );
}
