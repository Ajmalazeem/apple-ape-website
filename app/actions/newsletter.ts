// app/actions/newsletter.ts
"use server";

import { createServiceRoleClient } from "@/lib/supabase/server";
import { newsletterSchema } from "@/lib/validators/newsletter";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getClientIpHash } from "@/lib/ip";
import { sendNewsletterConfirm } from "@/lib/email";

export type NewsletterState =
  | { status: "idle" }
  | { status: "ok"; message: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

export async function subscribeNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = newsletterSchema.safeParse({
    email: formData.get("email"),
    hp: formData.get("hp"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString();
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Please check the field below.", fieldErrors };
  }

  const ipHash = await getClientIpHash();
  const allowed = await checkRateLimit({
    ipHash,
    action: "newsletter",
    ...RATE_LIMITS.newsletter,
  });
  if (!allowed) {
    return {
      status: "error",
      message: "Too many attempts. Try again in a minute.",
    };
  }

  const supabase = createServiceRoleClient();

  // Upsert by email — if a row already exists and is unconfirmed, refresh the token.
  // If it's already confirmed, treat the submission as a no-op success.
  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id, confirmed, confirm_token")
    .eq("email", parsed.data.email.toLowerCase())
    .maybeSingle();

  if (existing?.confirmed) {
    return {
      status: "ok",
      message: "You're already on the list — thanks for subscribing.",
    };
  }

  let token: string;
  if (existing) {
    token = existing.confirm_token;
  } else {
    const { data: inserted, error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: parsed.data.email.toLowerCase() })
      .select("confirm_token")
      .single();
    if (error || !inserted) {
      console.warn("[newsletter] insert failed", error);
      return { status: "error", message: "Something went wrong. Please try again." };
    }
    token = inserted.confirm_token;
  }

  await sendNewsletterConfirm(parsed.data.email, token);

  return {
    status: "ok",
    message: "Check your inbox to confirm your subscription.",
  };
}
