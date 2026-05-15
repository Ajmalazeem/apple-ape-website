// app/actions/contact.ts
"use server";

import { createServiceRoleClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validators/contact";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getClientIpHash } from "@/lib/ip";

export type ContactState =
  | { status: "idle" }
  | { status: "ok"; message: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name:    formData.get("name"),
    email:   formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    hp:      formData.get("hp"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString();
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Please check the fields below.", fieldErrors };
  }

  const ipHash = await getClientIpHash();
  const allowed = await checkRateLimit({
    ipHash,
    action: "contact",
    ...RATE_LIMITS.contact,
  });
  if (!allowed) {
    return { status: "error", message: "Too many messages. Try again in a minute." };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("contact_submissions").insert({
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase(),
    subject: parsed.data.subject || null,
    message: parsed.data.message,
    ip_hash: ipHash,
  });

  if (error) {
    console.warn("[contact] insert failed", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  return {
    status: "ok",
    message: "Thanks — we'll be in touch shortly.",
  };
}
