// app/(marketing)/games/[slug]/page.tsx
// Template for product detail routes — used as the model for /web3/[slug] and /apps/[slug].
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGameBySlug, getAllPublishedGameSlugs } from "@/lib/supabase/queries";
import { TrailerEmbed } from "@/components/trailer-embed";
import { StoreBadges } from "@/components/store-badges";
import { formatDate, compactNumber, absoluteUrl } from "@/lib/utils";
import { videoGameJsonLd, jsonLdScript } from "@/lib/seo";

export const revalidate = 300;

type RouteParams = { slug: string };

export async function generateStaticParams() {
  const rows = await getAllPublishedGameSlugs();
  return rows.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return { title: "Not found" };

  return {
    title: `${game.title} — ${game.tagline ?? "Game"}`,
    description: game.description ?? game.tagline ?? undefined,
    alternates: { canonical: `/games/${game.slug}` },
    openGraph: {
      title: game.title,
      description: game.tagline ?? undefined,
      url: absoluteUrl(`/games/${game.slug}`),
      type: "article",
      images: game.hero_image_url ? [{ url: game.hero_image_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: game.title,
      description: game.tagline ?? undefined,
      images: game.hero_image_url ? [game.hero_image_url] : undefined,
    },
  };
}

const STATUS_LABEL = {
  live: "Live",
  coming_soon: "Coming soon",
  archived: "Archived",
} as const;

export default async function GameDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) notFound();

  // screenshots column is jsonb; treat conservatively.
  const screenshots: string[] = Array.isArray(game.screenshots)
    ? (game.screenshots as unknown[]).filter((x): x is string => typeof x === "string")
    : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          videoGameJsonLd({
            name: game.title,
            slug: game.slug,
            description: game.description,
            genre: game.genre,
            platforms: game.platforms,
            trailerUrl: game.trailer_url,
            imageUrl: game.hero_image_url,
            releaseDate: game.release_date,
          }),
        )}
      />

      <article>
        {/* Hero band — centered headline above the hero-photo-card */}
        <header className="container pt-12 pb-12 sm:pt-16 lg:pt-24">
          <div className="flex items-center gap-3 text-muted-slate">
            <Link href="/games" className="text-sm hover:text-ink underline underline-offset-4">
              Games
            </Link>
            <span aria-hidden>/</span>
            <span className="label-mono text-ink">{game.title}</span>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="label-mono">{game.genre ?? "Game"}</span>
            <span className="rounded-pill border border-ink/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em]">
              {STATUS_LABEL[game.status]}
            </span>
            {game.release_date ? (
              <span className="label-mono">· {formatDate(game.release_date)}</span>
            ) : null}
            {game.downloads_count > 0 ? (
              <span className="label-mono">
                · {compactNumber(game.downloads_count)} downloads
              </span>
            ) : null}
          </div>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[0.95] tracking-[-0.02em] text-ink">
            {game.title}
          </h1>
          {game.tagline ? (
            <p className="mt-6 max-w-2xl text-lead text-ink/80">{game.tagline}</p>
          ) : null}
          <div className="mt-10">
            <StoreBadges
              playStoreUrl={game.play_store_url}
              appStoreUrl={game.app_store_url}
            />
          </div>
        </header>

        {/* hero-photo-card */}
        <div className="container">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-soft-stone">
            {game.hero_image_url ? (
              <Image
                src={game.hero_image_url}
                alt={`${game.title} hero artwork`}
                fill
                priority
                sizes="(min-width: 1024px) 80vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <span className="label-mono">Hero artwork</span>
              </div>
            )}
          </div>
        </div>

        {/* Trailer */}
        {game.trailer_url ? (
          <section
            aria-labelledby="trailer-heading"
            className="container py-20 lg:py-28"
          >
            <span className="label-mono">Trailer</span>
            <h2
              id="trailer-heading"
              className="mt-4 max-w-3xl font-display text-h3 leading-tight tracking-[-0.01em] text-ink"
            >
              Watch the trailer.
            </h2>
            <TrailerEmbed url={game.trailer_url} title={`${game.title} trailer`} className="mt-10" />
          </section>
        ) : null}

        {/* Description */}
        {game.description ? (
          <section className="container pb-20" aria-labelledby="about-heading">
            <div className="grid gap-12 border-t border-hairline pt-16 lg:grid-cols-[1fr_2fr]">
              <div>
                <span className="label-mono">About</span>
                <h2
                  id="about-heading"
                  className="mt-4 font-display text-h3 leading-tight tracking-[-0.01em] text-ink"
                >
                  {game.title}
                </h2>
              </div>
              <p className="text-lead leading-relaxed text-ink/85">{game.description}</p>
            </div>
          </section>
        ) : null}

        {/* Screenshots gallery */}
        {screenshots.length > 0 ? (
          <section className="container pb-24" aria-labelledby="shots-heading">
            <div className="flex items-end justify-between border-t border-hairline pt-16">
              <h2
                id="shots-heading"
                className="font-display text-h3 leading-tight tracking-[-0.01em] text-ink"
              >
                Screens.
              </h2>
              <span className="label-mono">{screenshots.length} shots</span>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {screenshots.map((src, i) => (
                <li key={src} className="relative aspect-[9/16] overflow-hidden rounded-sm bg-soft-stone">
                  <Image
                    src={src}
                    alt={`${game.title} screenshot ${i + 1}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* System / platform strip */}
        <section
          aria-labelledby="system-heading"
          className="border-t border-hairline bg-canvas"
        >
          <div className="container py-16">
            <div className="grid gap-10 md:grid-cols-3">
              <div>
                <span className="label-mono">Platforms</span>
                <p className="mt-3 font-display text-h4 leading-tight capitalize text-ink">
                  {game.platforms.length ? game.platforms.join(", ") : "—"}
                </p>
              </div>
              <div>
                <span className="label-mono">Status</span>
                <p className="mt-3 font-display text-h4 leading-tight text-ink">
                  {STATUS_LABEL[game.status]}
                </p>
              </div>
              <div>
                <span className="label-mono">Genre</span>
                <p className="mt-3 font-display text-h4 leading-tight text-ink">
                  {game.genre ?? "—"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
