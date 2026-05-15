// components/layout/mobile-nav.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { NAV_ITEMS } from "./nav-config";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle>Menu</SheetTitle>
        <SheetDescription className="sr-only">Site navigation</SheetDescription>
        <nav aria-label="Mobile" className="mt-8 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <SheetClose asChild key={item.href}>
              <Link
                href={item.href}
                className="block rounded-sm px-3 py-3 font-display text-h4 text-ink hover:bg-soft-stone min-h-12"
              >
                {item.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
        <div className="mt-8 border-t border-hairline pt-6">
          <SheetClose asChild>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-pill bg-near-black px-6 py-3 text-sm font-medium text-canvas"
            >
              Get in touch
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
