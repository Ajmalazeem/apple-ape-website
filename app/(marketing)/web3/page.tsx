// app/(marketing)/web3/page.tsx
import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/sections/page-placeholder";

export const metadata: Metadata = { title: "Web3" };

export default function Web3Page() {
  return (
    <PagePlaceholder
      eyebrow="Web3"
      title="dApps, NFT projects, and on-chain games."
      description="Portfolio surface with chain badges across EVM, Solana, and beyond."
    />
  );
}
