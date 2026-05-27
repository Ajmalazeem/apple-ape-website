// components/sections/hero.tsx
// Centered hero: monumental headline, primary CTA + secondary text link,
// and the doc's `hero-photo-card` composition — a wide media card with a
// narrower companion card (here, a dark agent-console-style status panel).
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface HeroProps {
  eyebrow: string;
  title: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  mediaUrl?: string | null;
}

export function Hero({ eyebrow, title, body, primaryCta, secondaryCta, mediaUrl }: HeroProps) {
  const reduce = useReducedMotion();
  const initial = reduce ? false : { opacity: 0, y: 8 };
  const animate = reduce ? undefined : { opacity: 1, y: 0 };

  return (
    <section className="container pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-24 lg:pb-32">
      <motion.div
        initial={initial}
        animate={animate}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="label-mono">{eyebrow}</span>
      </motion.div>

      <motion.h1
        initial={initial}
        animate={animate}
        transition={{ delay: 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 max-w-5xl font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] tracking-[-0.02em] text-ink"
      >
        {title}
      </motion.h1>

      <motion.p
        initial={initial}
        animate={animate}
        transition={{ delay: 0.18, duration: 0.6 }}
        className="mt-10 max-w-2xl text-lead text-ink/80"
      >
        {body}
      </motion.p>

      <motion.div
        initial={initial}
        animate={animate}
        transition={{ delay: 0.26, duration: 0.6 }}
        className="mt-12 flex flex-wrap items-center gap-4"
      >
        <Button asChild>
          <Link href={primaryCta.href}>{primaryCta.label}</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href={secondaryCta.href}>{secondaryCta.label} →</Link>
        </Button>
      </motion.div>

      {/* hero-photo-card composition */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mt-16 grid gap-4 lg:grid-cols-[1.55fr_1fr]"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-soft-stone">
          {mediaUrl ? (
            <Image
              src={mediaUrl}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          ) : (
            // DESIGN: fallback panel keeps the hero structurally honest
            // (per "placeholder product frames are better than invented content")
            <div className="absolute inset-0 grid place-items-center">
              <span className="label-mono">Featured title</span>
            </div>
          )}
        </div>
        <div className="relative overflow-hidden rounded-lg bg-near-black p-6 text-canvas">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-coral">
            Studio · In Build
          </span>
          <p className="mt-4 font-display text-h4 leading-tight">
            Three titles in development.
          </p>
          <ul className="mt-6 space-y-3 text-xs text-canvas/70">
            <li className="flex items-center justify-between gap-3">
              <span>Gully Run</span>
              <span className="rounded-pill bg-canvas/10 px-2 py-0.5">In development</span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span>Treasure Hunter</span>
              <span className="rounded-pill bg-canvas/10 px-2 py-0.5">In development</span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span>Swades</span>
              <span className="rounded-pill bg-coral/20 px-2 py-0.5 text-coral">Coming soon</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
