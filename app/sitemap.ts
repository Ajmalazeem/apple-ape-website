// app/sitemap.ts
import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";
import {
  getAllPublishedGameSlugs,
  getAllPublishedWeb3Slugs,
  getAllPublishedPostSlugs,
} from "@/lib/supabase/queries";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    "/", "/games", "/web3", "/apps", "/about", "/careers", "/blog", "/contact",
    "/legal/privacy", "/legal/terms", "/legal/cookies",
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.6,
  }));

  const [games, web3, posts] = await Promise.all([
    getAllPublishedGameSlugs(),
    getAllPublishedWeb3Slugs(),
    getAllPublishedPostSlugs(),
  ]);

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...games.map((g) => ({
      url: absoluteUrl(`/games/${g.slug}`),
      lastModified: new Date(g.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...web3.map((p) => ({
      url: absoluteUrl(`/web3/${p.slug}`),
      lastModified: new Date(p.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: new Date(p.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
