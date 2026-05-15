// components/sections/newsletter-cta.tsx
// `footer-newsletter` style — coral mono label, white headline, dark backdrop.
import { NewsletterForm } from "@/components/forms/newsletter-form";

export function NewsletterCta() {
  return (
    <section
      id="newsletter"
      aria-labelledby="newsletter-heading"
      className="container py-20 lg:py-28"
    >
      <div className="rounded-lg bg-deep-green p-10 text-canvas sm:p-16 lg:p-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <span className="font-mono text-mono-label uppercase tracking-[0.04em] text-coral">
              The studio newsletter
            </span>
            <h2
              id="newsletter-heading"
              className="mt-5 font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.05] tracking-[-0.02em]"
            >
              Studio updates from the build floor.
            </h2>
            <p className="mt-6 max-w-xl text-base text-canvas/70">
              Launch notes, postmortems, and what we&apos;re shipping next.
              One email per release window. No spam.
            </p>
          </div>

          <NewsletterForm tone="dark" />
        </div>
      </div>
    </section>
  );
}
