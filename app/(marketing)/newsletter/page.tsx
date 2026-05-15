// app/(marketing)/newsletter/page.tsx
// Post-confirm landing. Reads ?status= and shows a quiet confirmation.
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Newsletter", robots: { index: false } };

const COPY: Record<string, { title: string; body: string }> = {
  confirmed: {
    title: "You're in.",
    body: "Your subscription is confirmed. Studio updates will land in your inbox at release windows.",
  },
  invalid: {
    title: "That link expired.",
    body: "Subscribe again from the home page and we'll send a fresh confirmation.",
  },
};

export default async function NewsletterStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const content = COPY[status ?? "invalid"] ?? COPY.invalid;

  return (
    <div className="container section">
      <div className="max-w-2xl">
        <span className="label-mono">Newsletter</span>
        <h1 className="mt-6 font-display text-product leading-none tracking-[-0.02em] text-ink">
          {content.title}
        </h1>
        <p className="mt-8 text-lead text-ink/80">{content.body}</p>
        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center rounded-pill bg-near-black px-6 py-3 text-sm font-medium text-canvas"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
