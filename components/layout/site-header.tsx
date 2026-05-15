// components/layout/site-header.tsx
// Sticky, blurred-glass header. Three-zone (logo / centered menu / actions) on lg+.
"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { NAV_ITEMS } from "./nav-config";

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-colors",
        scrolled
          ? "border-hairline bg-canvas/80 backdrop-blur-md"
          : "border-transparent bg-canvas/0",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        {/* Logo */}
        <Link href="/" aria-label="AppleApe Studios" className="flex items-center gap-2">
          <span className="font-display text-lg font-medium tracking-tight text-ink">
            AppleApe<span className="text-coral">.</span>
          </span>
        </Link>

        {/* Centered menu (lg+) */}
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-2 justify-self-center">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm px-3 py-2 text-sm text-ink hover:bg-soft-stone"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <ThemeToggle />
          <Button asChild className="hidden sm:inline-flex" size="sm">
            <Link href="/contact">Get in touch</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
