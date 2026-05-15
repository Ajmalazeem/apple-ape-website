// lib/supabase/public.ts
// Anon-key client for public marketing reads. No cookies, so it's safe to call
// from static prerendering, generateStaticParams, and sitemap generation.
// RLS still applies via the anon role — only use for tables/rows that anon can read.
import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
