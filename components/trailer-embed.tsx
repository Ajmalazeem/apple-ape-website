// components/trailer-embed.tsx
// Lazy-loaded YouTube/Vimeo iframe in a 22px rounded media frame.
import { cn } from "@/lib/utils";

interface TrailerEmbedProps {
  url: string;
  title?: string;
  className?: string;
}

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    // youtube.com/watch?v=ID
    if (/(^|\.)youtube\.com$/.test(u.hostname) && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    // youtu.be/ID
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    // already an /embed/ URL
    if (u.pathname.startsWith("/embed/")) return url;
    // vimeo.com/ID
    if (u.hostname.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  } catch {
    return null;
  }
}

export function TrailerEmbed({ url, title = "Trailer", className }: TrailerEmbedProps) {
  const src = toEmbedUrl(url);
  if (!src) return null;
  return (
    <div className={cn("relative aspect-video overflow-hidden rounded-lg bg-near-black", className)}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
