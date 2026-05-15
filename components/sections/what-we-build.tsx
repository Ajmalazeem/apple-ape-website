// components/sections/what-we-build.tsx
// `capability-card` rhythm: thin-line icons, 24px heading, body, text link.
// On light backgrounds the doc favors top-rule containment over full boxes.
import Link from "next/link";
import { Gamepad2, Boxes, Smartphone } from "lucide-react";

const PILLARS = [
  {
    icon: Gamepad2,
    eyebrow: "01",
    title: "Games",
    body: "Android-first titles across hyper-casual, arcade, and mid-core. Built in Unity, shipped with live ops.",
    href: "/games",
    cta: "Browse games",
  },
  {
    icon: Boxes,
    eyebrow: "02",
    title: "Web3",
    body: "dApps, NFT marketplaces, and on-chain games across EVM and Solana. Audit-ready by default.",
    href: "/web3",
    cta: "See Web3 work",
  },
  {
    icon: Smartphone,
    eyebrow: "03",
    title: "Apps",
    body: "Mobile utilities and consumer apps that respect attention and ship without dark patterns.",
    href: "/apps",
    cta: "Explore apps",
  },
];

export function WhatWeBuild() {
  return (
    <section className="container py-24 lg:py-36" aria-labelledby="pillars-heading">
      <div className="max-w-3xl">
        <span className="label-mono">What we build</span>
        <h2
          id="pillars-heading"
          className="mt-4 font-display text-h2 leading-tight tracking-[-0.01em] text-ink"
        >
          Three lines of product, one studio.
        </h2>
        <p className="mt-6 text-lead text-ink/80">
          Everything we ship is owned end-to-end — concept, code, art, distribution.
        </p>
      </div>

      <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
        {PILLARS.map((p) => (
          <article key={p.title} className="flex flex-col border-t border-hairline pt-8">
            <p.icon className="h-8 w-8 stroke-[1.25] text-ink" aria-hidden />
            <span className="mt-8 label-mono">{p.eyebrow}</span>
            <h3 className="mt-3 font-display text-h4 text-ink">{p.title}</h3>
            <p className="mt-4 text-base leading-relaxed text-ink/75">{p.body}</p>
            <Link
              href={p.href}
              className="mt-8 inline-flex items-center gap-1 text-sm text-ink underline underline-offset-4 hover:text-ink/70"
            >
              {p.cta} →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
