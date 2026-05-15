// app/(marketing)/contact/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with AppleApe Studios for press, partnerships, or general inquiries.",
};

const CONTACTS = [
  { label: "General",      email: "hello@appleape.studio" },
  { label: "Press",        email: "press@appleape.studio" },
  { label: "Partnerships", email: "partners@appleape.studio" },
];

const SOCIALS = [
  { label: "Twitter",  href: "https://twitter.com/appleapestudios" },
  { label: "GitHub",   href: "https://github.com/appleape-studios" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/appleape-studios" },
];

export default function ContactPage() {
  return (
    <div className="container section">
      <header className="max-w-3xl">
        <span className="label-mono">Contact</span>
        <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none tracking-[-0.02em] text-ink">
          Get in touch.
        </h1>
        <p className="mt-8 text-lead text-ink/80">
          Send us a note about a project, partnership, or press request and we&apos;ll respond within two working days.
        </p>
      </header>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <aside className="flex flex-col gap-12">
          <section aria-labelledby="direct-heading">
            <h2 id="direct-heading" className="label-mono">Direct</h2>
            <ul className="mt-5 space-y-4">
              {CONTACTS.map((c) => (
                <li key={c.email} className="flex flex-col gap-1 border-t border-hairline pt-4">
                  <span className="text-sm text-muted-slate">{c.label}</span>
                  <a
                    href={`mailto:${c.email}`}
                    className="font-display text-h4 text-ink underline-offset-4 hover:underline"
                  >
                    {c.email}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="studio-heading">
            <h2 id="studio-heading" className="label-mono">Studio</h2>
            <address className="mt-5 not-italic text-sm leading-relaxed text-ink/80">
              {/* TODO: replace with real studio address */}
              AppleApe Studios HQ<br />
              Remote-first · APAC, Europe, Americas
            </address>
          </section>

          <section aria-labelledby="social-heading">
            <h2 id="social-heading" className="label-mono">Social</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {SOCIALS.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-pill border border-ink/15 px-4 py-2 text-sm text-ink hover:border-ink"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        <ContactForm />
      </div>
    </div>
  );
}
