// lib/seo.ts
// JSON-LD builders for Organization, VideoGame, and Article.
import { absoluteUrl } from "@/lib/utils";

export interface OrganizationJsonLdInput {
  name?: string;
  url?: string;
  sameAs?: string[];
}

export function organizationJsonLd({
  name = "AppleApe Studios",
  url = absoluteUrl("/"),
  sameAs = [],
}: OrganizationJsonLdInput = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    sameAs,
    logo: absoluteUrl("/og-logo.png"),
  };
}

export interface VideoGameJsonLdInput {
  name: string;
  slug: string;
  description?: string | null;
  genre?: string | null;
  platforms?: string[];
  trailerUrl?: string | null;
  imageUrl?: string | null;
  releaseDate?: string | null;
}

export function videoGameJsonLd(g: VideoGameJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: g.name,
    url: absoluteUrl(`/games/${g.slug}`),
    description: g.description ?? undefined,
    genre: g.genre ?? undefined,
    gamePlatform: g.platforms?.length ? g.platforms : undefined,
    trailer: g.trailerUrl ?? undefined,
    image: g.imageUrl ?? undefined,
    datePublished: g.releaseDate ?? undefined,
    publisher: { "@type": "Organization", name: "AppleApe Studios" },
  };
}

export interface ArticleJsonLdInput {
  title: string;
  slug: string;
  excerpt?: string | null;
  authorName?: string | null;
  publishedAt?: string | null;
  coverImageUrl?: string | null;
}

export function articleJsonLd(a: ArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    url: absoluteUrl(`/blog/${a.slug}`),
    description: a.excerpt ?? undefined,
    image: a.coverImageUrl ?? undefined,
    datePublished: a.publishedAt ?? undefined,
    author: a.authorName ? { "@type": "Person", name: a.authorName } : undefined,
    publisher: { "@type": "Organization", name: "AppleApe Studios" },
  };
}

// Renders a stringified JSON-LD payload safely inside a <script> tag.
export function jsonLdScript(payload: unknown) {
  return {
    __html: JSON.stringify(payload).replace(/</g, "\\u003c"),
  };
}
