// app/(marketing)/page.tsx
// Home — every section is wired to Supabase and degrades gracefully when the
// table is empty or the env is missing (see lib/supabase/queries.ts).
import type { Metadata } from "next";
import {
  getFeaturedGames,
  getFeaturedWeb3,
  getStudioStats,
  getLatestPosts,
} from "@/lib/supabase/queries";
import { Hero } from "@/components/sections/hero";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { StudioStats } from "@/components/sections/studio-stats";
import { WhatWeBuild } from "@/components/sections/what-we-build";
import { LatestPosts } from "@/components/sections/latest-posts";
import { NewsletterCta } from "@/components/sections/newsletter-cta";
import { organizationJsonLd, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AppleApe Studios — We ship what we believe in.",
  description:
    "A small studio building Android games, Web3 apps, and consumer utilities — concept to live ops, entirely in-house.",
  alternates: { canonical: "/" },
};

// Revalidate every 5 minutes so seeded content updates without a redeploy.
export const revalidate = 300;

export default async function HomePage() {
  const [games, web3, stats, posts] = await Promise.all([
    getFeaturedGames(3),
    getFeaturedWeb3(3),
    getStudioStats(),
    getLatestPosts(3),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          organizationJsonLd({
            sameAs: [
              "https://twitter.com/appleapestudios",
              "https://github.com/appleape-studios",
            ],
          }),
        )}
      />

      <Hero
        eyebrow="AppleApe Studios"
        title="We ship what we believe in."
        body="Android games, Web3 applications, and consumer apps — built in-house from concept to live ops. No outsourcing, no white-labelling. If it ships under our name, we made it."
        primaryCta={{ label: "Explore our games", href: "/games" }}
        secondaryCta={{ label: "See Web3 work", href: "/web3" }}
        mediaUrl={games[0]?.hero_image_url ?? null}
      />

      <FeaturedProducts games={games} web3={web3} />
      <StudioStats stats={stats} />
      <WhatWeBuild />
      <LatestPosts posts={posts} />
      <NewsletterCta />
    </>
  );
}
