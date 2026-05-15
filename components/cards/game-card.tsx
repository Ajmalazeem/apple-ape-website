// components/cards/game-card.tsx
// Warm stone card with 22px rounded media on top, body below.
// Energy lives in the artwork; UI shell stays restrained.
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database.types";

type Game = Database["public"]["Tables"]["games"]["Row"];

const STATUS_LABEL: Record<Game["status"], string> = {
  live: "Live",
  coming_soon: "Coming soon",
  archived: "Archived",
};

export function GameCard({ game, className }: { game: Game; className?: string }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className={cn(
        "group flex flex-col gap-5 rounded-md bg-soft-stone p-3 transition-colors hover:bg-soft-stone/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue",
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-ink/5">
        {game.hero_image_url ? (
          <Image
            src={game.hero_image_url}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-near-black text-canvas">
            <span className="font-display text-h2 leading-none tracking-[-0.02em]">
              {game.title.slice(0, 1)}
            </span>
          </div>
        )}
        <span
          className={cn(
            "absolute left-3 top-3 rounded-pill bg-canvas/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-ink",
          )}
        >
          {STATUS_LABEL[game.status]}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-3 pt-0">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-h4 leading-tight text-ink">{game.title}</h3>
          {game.genre ? (
            <span className="label-mono shrink-0">{game.genre}</span>
          ) : null}
        </div>
        {game.tagline ? (
          <p className="text-sm text-ink/70">{game.tagline}</p>
        ) : null}
      </div>
    </Link>
  );
}
