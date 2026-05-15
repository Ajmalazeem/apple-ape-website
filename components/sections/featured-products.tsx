// components/sections/featured-products.tsx
// 3-column desktop grid mixing games + web3 projects. Empty Supabase → sensible default cards.
import Link from "next/link";
import { GameCard } from "@/components/cards/game-card";
import { Web3ProjectCard } from "@/components/cards/web3-project-card";
import type { Database } from "@/types/database.types";

type Game = Database["public"]["Tables"]["games"]["Row"];
type Web3 = Database["public"]["Tables"]["web3_projects"]["Row"];

interface Props {
  games: Game[];
  web3: Web3[];
}

const FALLBACK_GAMES: Game[] = [
  {
    id: "fallback-game-1",
    slug: "apex-runners",
    title: "Apex Runners",
    tagline: "Vertical parkour for your thumbs.",
    description: null,
    genre: "Hyper-casual",
    platforms: ["android", "ios"],
    status: "live",
    hero_image_url: null,
    trailer_url: null,
    screenshots: [],
    play_store_url: null,
    app_store_url: null,
    release_date: null,
    downloads_count: 0,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function FeaturedProducts({ games, web3 }: Props) {
  const items = games.length ? games : FALLBACK_GAMES;
  const sliced = items.slice(0, 3);

  return (
    <section className="container pb-20 lg:pb-32" aria-labelledby="featured-heading">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="label-mono">Featured</span>
          <h2 id="featured-heading" className="mt-4 font-display text-h2 leading-tight tracking-[-0.01em] text-ink">
            Recent product.
          </h2>
        </div>
        <Link href="/games" className="text-sm text-ink underline underline-offset-4 hover:text-ink/70">
          See all games →
        </Link>
      </div>

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sliced.map((g) => (
          <li key={g.id}>
            <GameCard game={g} />
          </li>
        ))}
      </ul>

      {web3.length ? (
        <>
          <div className="mt-24 flex flex-wrap items-end justify-between gap-6">
            <h3 className="font-display text-h3 leading-tight tracking-[-0.01em] text-ink">
              Web3 portfolio.
            </h3>
            <Link href="/web3" className="text-sm text-ink underline underline-offset-4 hover:text-ink/70">
              Explore Web3 →
            </Link>
          </div>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {web3.slice(0, 3).map((p) => (
              <li key={p.id}>
                <Web3ProjectCard project={p} />
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}
