// lib/rate-limit.ts
// Calls the Postgres check_rate_limit() function. Returns true when the
// request is within budget, false when limited. Uses the service-role client
// because EXECUTE on check_rate_limit is restricted to service_role.
import "server-only";
import { createServiceRoleClient } from "@/lib/supabase/server";

export interface RateLimitOptions {
  ipHash: string;
  action: string;
  maxCount: number;
  windowSeconds: number;
}

export async function checkRateLimit({
  ipHash,
  action,
  maxCount,
  windowSeconds,
}: RateLimitOptions): Promise<boolean> {
  // If service-role isn't configured, fail open in dev but log loudly.
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("[rate-limit] SUPABASE_SERVICE_ROLE_KEY missing — failing open");
    return true;
  }

  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_ip_hash: ipHash,
      p_action: action,
      p_max_count: maxCount,
      p_window_seconds: windowSeconds,
    });
    if (error) {
      console.warn("[rate-limit] rpc error", error);
      // Fail open — better UX than blocking legitimate users on infra hiccups.
      return true;
    }
    return data === true;
  } catch (err) {
    console.warn("[rate-limit] threw", err);
    return true;
  }
}

// Convenience presets per form. Tuned for legitimate users; tighten if abused.
export const RATE_LIMITS = {
  newsletter: { maxCount: 3,  windowSeconds: 60 },   // 3 submissions / min
  contact:    { maxCount: 5,  windowSeconds: 60 },   // 5 submissions / min
  jobApply:   { maxCount: 10, windowSeconds: 3600 }, // 10 applications / hour
} as const;
