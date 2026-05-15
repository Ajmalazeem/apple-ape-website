// lib/supabase/queries.ts
// Server-only typed query helpers. Each query gracefully returns an empty array
// when Supabase is unconfigured or the table is empty, so marketing pages never 500.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type Tables = Database["public"]["Tables"];

function isConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

async function safeSelect<T>(fn: () => Promise<{ data: T[] | null; error: unknown }>): Promise<T[]> {
  if (!isConfigured()) return [];
  try {
    const { data, error } = await fn();
    if (error) {
      console.warn("[queries] supabase error", error);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.warn("[queries] threw", err);
    return [];
  }
}

// ----- Games -----
export async function getFeaturedGames(limit = 3): Promise<Tables["games"]["Row"][]> {
  return safeSelect(async () => {
    const supabase = await createClient();
    return supabase
      .from("games")
      .select("*")
      .eq("published", true)
      .order("release_date", { ascending: false, nullsFirst: false })
      .limit(limit);
  });
}

export async function getAllPublishedGameSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  return safeSelect(async () => {
    const supabase = await createClient();
    return supabase.from("games").select("slug, updated_at").eq("published", true);
  });
}

export async function getGameBySlug(slug: string): Promise<Tables["games"]["Row"] | null> {
  if (!isConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error) {
      console.warn("[queries] getGameBySlug", error);
      return null;
    }
    return data ?? null;
  } catch {
    return null;
  }
}

// ----- Web3 -----
export async function getFeaturedWeb3(limit = 3): Promise<Tables["web3_projects"]["Row"][]> {
  return safeSelect(async () => {
    const supabase = await createClient();
    return supabase
      .from("web3_projects")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(limit);
  });
}

export async function getAllPublishedWeb3Slugs(): Promise<{ slug: string; updated_at: string }[]> {
  return safeSelect(async () => {
    const supabase = await createClient();
    return supabase.from("web3_projects").select("slug, updated_at").eq("published", true);
  });
}

// ----- Apps -----
export async function getFeaturedApps(limit = 3): Promise<Tables["apps"]["Row"][]> {
  return safeSelect(async () => {
    const supabase = await createClient();
    return supabase
      .from("apps")
      .select("*")
      .eq("published", true)
      .order("release_date", { ascending: false, nullsFirst: false })
      .limit(limit);
  });
}

// ----- Posts -----
export async function getLatestPosts(limit = 3): Promise<Tables["posts"]["Row"][]> {
  return safeSelect(async () => {
    const supabase = await createClient();
    return supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(limit);
  });
}

export async function getAllPublishedPostSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  return safeSelect(async () => {
    const supabase = await createClient();
    return supabase.from("posts").select("slug, updated_at").eq("published", true);
  });
}

// ----- Studio stats -----
export async function getStudioStats(): Promise<Tables["studio_stats"]["Row"][]> {
  return safeSelect(async () => {
    const supabase = await createClient();
    return supabase
      .from("studio_stats")
      .select("*")
      .order("display_order", { ascending: true });
  });
}
