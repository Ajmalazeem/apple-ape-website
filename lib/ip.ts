// lib/ip.ts
// Extract the client IP from request headers and return a stable, salted SHA-256
// hash. We never store the raw IP — only the hash, which is enough for rate
// limiting and abuse forensics without retaining PII.
import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";

const SALT = process.env.IP_HASH_SALT || "appleape-default-salt-rotate-me";

export function hashIp(ip: string): string {
  return createHash("sha256").update(`${SALT}:${ip}`).digest("hex");
}

export async function getClientIpHash(): Promise<string> {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  const realIp = h.get("x-real-ip");
  const cfConnectingIp = h.get("cf-connecting-ip");
  const raw =
    (cfConnectingIp ??
      forwardedFor?.split(",")[0]?.trim() ??
      realIp ??
      "0.0.0.0") || "0.0.0.0";
  return hashIp(raw);
}
