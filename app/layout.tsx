// app/layout.tsx
// Root layout: fonts, theme provider, header, footer, metadata defaults.
import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import { cn, absoluteUrl } from "@/lib/utils";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

// TODO: design.md references proprietary `CohereText`, `Unica77 Cohere Web`, `CohereMono`.
// Per the doc's "Known Gaps" section we use the documented fallbacks via next/font.
const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "AppleApe Studios — Games, Web3, Apps",
    template: "%s · AppleApe Studios",
  },
  description:
    "AppleApe Studios is a product studio designing and shipping Android games, Web3 applications, and consumer apps.",
  applicationName: "AppleApe Studios",
  authors: [{ name: "AppleApe Studios" }],
  openGraph: {
    title: "AppleApe Studios",
    description:
      "A product studio shipping games, Web3 applications, and consumer apps.",
    url: absoluteUrl("/"),
    siteName: "AppleApe Studios",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AppleApe Studios",
    description:
      "A product studio shipping games, Web3 applications, and consumer apps.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#17171c" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(fontDisplay.variable, fontBody.variable, fontMono.variable)}
    >
      <body className="flex min-h-screen flex-col bg-canvas text-ink font-body">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-near-black focus:px-4 focus:py-2 focus:text-canvas"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </ThemeProvider>
        <Analytics />
        {/* DESIGN: Plausible/equivalent privacy-friendly tag placeholder. */}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ? (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        ) : null}
      </body>
    </html>
  );
}
