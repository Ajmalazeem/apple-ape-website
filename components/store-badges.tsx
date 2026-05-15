// components/store-badges.tsx
// Monochrome pill links to Play Store / App Store / Steam / chain explorers.
// Per design.md: trust-logo style — quiet, monochrome, no decorative chrome.
import Link from "next/link";
import { cn } from "@/lib/utils";

interface StoreBadgesProps {
  playStoreUrl?: string | null;
  appStoreUrl?: string | null;
  steamUrl?: string | null;
  className?: string;
}

function Badge({ href, label, sub }: { href: string; label: string; sub: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex min-h-12 items-center gap-3 rounded-pill border border-ink/15 px-5 py-3 text-ink hover:border-ink"
    >
      <span className="flex flex-col leading-tight">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">
          {sub}
        </span>
        <span className="font-body text-sm font-medium">{label}</span>
      </span>
      <span aria-hidden className="ml-auto text-ink/40 transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}

export function StoreBadges({ playStoreUrl, appStoreUrl, steamUrl, className }: StoreBadgesProps) {
  const items: { href: string; label: string; sub: string }[] = [];
  if (playStoreUrl) items.push({ href: playStoreUrl, label: "Google Play", sub: "Get it on" });
  if (appStoreUrl) items.push({ href: appStoreUrl, label: "App Store", sub: "Download on the" });
  if (steamUrl) items.push({ href: steamUrl, label: "Steam", sub: "Play on" });

  if (!items.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {items.map((item) => (
        <Badge key={item.href} {...item} />
      ))}
    </div>
  );
}

// Web3 chain chips — monochrome per design.md (assumption #3).
export function ChainBadges({ chains, className }: { chains: string[]; className?: string }) {
  if (!chains.length) return null;
  return (
    <ul className={cn("flex flex-wrap gap-2", className)} aria-label="Supported chains">
      {chains.map((chain) => (
        <li
          key={chain}
          className="inline-flex items-center rounded-pill border border-ink/20 bg-canvas px-3 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-ink"
        >
          {chain}
        </li>
      ))}
    </ul>
  );
}
