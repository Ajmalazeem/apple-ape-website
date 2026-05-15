// components/ui/announcement-bar.tsx
// 36px tall full-width black strip with centered microcopy + close — per `announcement-bar`.
"use client";

import * as React from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AnnouncementBarProps {
  message: string;
  href?: string;
  linkLabel?: string;
  storageKey?: string;
}

export function AnnouncementBar({
  message,
  href,
  linkLabel = "Learn more",
  storageKey = "announcement-bar-dismissed",
}: AnnouncementBarProps) {
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage.getItem(storageKey)) {
      setOpen(false);
    }
  }, [storageKey]);

  if (!open) return null;

  return (
    <div
      role="region"
      aria-label="Announcement"
      className={cn("relative w-full bg-cohere-black text-canvas h-9 flex items-center justify-center px-12")}
    >
      <p className="text-xs sm:text-sm">
        <span>{message}</span>
        {href ? (
          <>
            {" "}
            <Link href={href} className="underline underline-offset-4">
              {linkLabel}
            </Link>
          </>
        ) : null}
      </p>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          setOpen(false);
          window.sessionStorage.setItem(storageKey, "1");
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-canvas/80 hover:text-canvas"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
