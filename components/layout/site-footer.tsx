// components/layout/site-footer.tsx
// Dark footer with coral "AI moves fast"-style label, multi-column on desktop.
// Mobile collapses to a single column (accordion variant deferred to Phase 2 if needed).
import Link from "next/link";

interface FooterCol {
  title: string;
  links: { label: string; href: string }[];
}

const COLUMNS: FooterCol[] = [
  {
    title: "Studio",
    links: [
      { label: "About",    href: "/about"   },
      { label: "Careers",  href: "/careers" },
      { label: "Contact",  href: "/contact" },
      { label: "Blog",     href: "/blog"    },
    ],
  },
  {
    title: "Work",
    links: [
      { label: "Games",  href: "/games" },
      { label: "Web3",   href: "/web3"  },
      { label: "Apps",   href: "/apps"  },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy",  href: "/legal/privacy" },
      { label: "Terms",    href: "/legal/terms"   },
      { label: "Cookies",  href: "/legal/cookies" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-hairline bg-near-black text-canvas">
      <div className="container py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <span className="font-mono text-mono-label uppercase tracking-[0.04em] text-coral">
              The studio
            </span>
            <h2 className="mt-4 font-display text-h3 leading-tight">
              We design and ship product for the next generation of play.
            </h2>
            <p className="mt-6 max-w-md text-sm text-canvas/70">
              Games, Web3 apps, and consumer tools — built in-house, shipped with intent.
            </p>
            {/* DESIGN: full newsletter form ships in Phase 3 — placeholder only here. */}
            <Link
              href="/#newsletter"
              className="mt-8 inline-flex items-center gap-2 text-sm text-canvas underline-offset-4 hover:underline"
            >
              Subscribe to studio updates →
            </Link>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-mono-label uppercase tracking-[0.04em] text-canvas">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-canvas/70 hover:text-canvas"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-canvas/10 pt-8 text-xs text-canvas/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AppleApe Studios. All rights reserved.</p>
          <p className="font-mono uppercase tracking-[0.04em]">Made with intent.</p>
        </div>
      </div>
    </footer>
  );
}
