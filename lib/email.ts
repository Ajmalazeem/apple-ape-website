// lib/email.ts
// Thin Resend wrapper. Returns ok/error rather than throwing so callers can
// decide how to surface failure (silent in dev, alerting in prod).
import "server-only";
import { Resend } from "resend";
import { absoluteUrl } from "@/lib/utils";

function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function fromAddress(): string {
  return process.env.RESEND_FROM_EMAIL || "AppleApe Studios <hello@appleape.studio>";
}

export async function sendNewsletterConfirm(email: string, token: string) {
  const resend = client();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY missing — skipping send. Confirm token:", token);
    return { ok: true, skipped: true } as const;
  }

  const confirmUrl = absoluteUrl(`/api/newsletter/confirm?token=${encodeURIComponent(token)}`);

  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: email,
    subject: "Confirm your AppleApe Studios subscription",
    text: [
      "Welcome to AppleApe Studios updates.",
      "",
      "Confirm your subscription:",
      confirmUrl,
      "",
      "If you didn't request this, you can ignore this email.",
    ].join("\n"),
  });

  if (error) {
    console.warn("[email] resend error", error);
    return { ok: false, error } as const;
  }
  return { ok: true, skipped: false } as const;
}
