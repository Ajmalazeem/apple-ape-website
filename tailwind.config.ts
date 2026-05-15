// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2.5rem" },
      screens: { "2xl": "1440px" },
    },
    extend: {
      // Mapped to CSS variables in app/globals.css so light/dark flip in one place.
      colors: {
        // Brand & accent
        "cohere-black": "hsl(var(--cohere-black))",
        "near-black":   "hsl(var(--near-black))",
        "deep-green":   "hsl(var(--deep-green))",
        "dark-navy":    "hsl(var(--dark-navy))",
        "action-blue":  "hsl(var(--action-blue))",
        coral:          "hsl(var(--coral))",
        "soft-coral":   "hsl(var(--soft-coral))",
        // Surfaces
        canvas:         "hsl(var(--canvas))",
        "soft-stone":   "hsl(var(--soft-stone))",
        "pale-green":   "hsl(var(--pale-green))",
        "pale-blue":    "hsl(var(--pale-blue))",
        "card-border":  "hsl(var(--card-border))",
        // Text & rules
        ink:            "hsl(var(--ink))",
        "muted-slate":  "hsl(var(--muted-slate))",
        slate:          "hsl(var(--slate))",
        hairline:       "hsl(var(--hairline))",
        "border-light": "hsl(var(--border-light))",
        // Semantic
        "focus-blue":   "hsl(var(--focus-blue))",
        "focus-violet": "hsl(var(--focus-violet))",
        "error-red":    "hsl(var(--error-red))",

        // shadcn aliases (driven from the same vars to stay on-design)
        background: "hsl(var(--canvas))",
        foreground: "hsl(var(--ink))",
        border:     "hsl(var(--hairline))",
        input:      "hsl(var(--hairline))",
        ring:       "hsl(var(--focus-blue))",
        muted:      { DEFAULT: "hsl(var(--soft-stone))", foreground: "hsl(var(--muted-slate))" },
        primary:    { DEFAULT: "hsl(var(--near-black))", foreground: "hsl(var(--canvas))" },
        secondary:  { DEFAULT: "hsl(var(--soft-stone))", foreground: "hsl(var(--ink))" },
        accent:     { DEFAULT: "hsl(var(--soft-stone))", foreground: "hsl(var(--ink))" },
        destructive:{ DEFAULT: "hsl(var(--error-red))",  foreground: "hsl(var(--canvas))" },
        popover:    { DEFAULT: "hsl(var(--canvas))",     foreground: "hsl(var(--ink))" },
        card:       { DEFAULT: "hsl(var(--canvas))",     foreground: "hsl(var(--ink))" },
      },
      // Radius scale exactly per design.md
      borderRadius: {
        xs:   "4px",
        sm:   "8px",
        md:   "16px",
        lg:   "22px",
        xl:   "30px",
        pill: "32px",
      },
      fontFamily: {
        // CSS vars are injected by next/font in app/layout.tsx
        display: ["var(--font-display)", "Space Grotesk", "Inter", "ui-sans-serif", "system-ui"],
        body:    ["var(--font-body)",    "Inter",        "Arial", "ui-sans-serif", "system-ui"],
        mono:    ["var(--font-mono)",    "ui-monospace", "monospace"],
      },
      fontSize: {
        // Hierarchy from design.md (px → rem at 16px base, plus tracking/leading)
        "hero":     ["6rem",   { lineHeight: "1",   letterSpacing: "-0.02em" }], // 96
        "product":  ["4.5rem", { lineHeight: "1",   letterSpacing: "-0.02em" }], // 72
        "section":  ["3.75rem",{ lineHeight: "1",   letterSpacing: "-0.02em" }], // 60
        "h2":       ["3rem",   { lineHeight: "1.2", letterSpacing: "-0.01em" }], // 48
        "h3":       ["2rem",   { lineHeight: "1.2", letterSpacing: "-0.01em" }], // 32
        "h4":       ["1.5rem", { lineHeight: "1.3" }],                            // 24
        "lead":     ["1.125rem", { lineHeight: "1.4" }],                          // 18
        "mono-label": ["0.875rem", { lineHeight: "1.4", letterSpacing: "0.02em" }], // 14
      },
      // Doc lists many one-off alignment values; pull the most-used into utilities.
      spacing: {
        "2": "2px",
        "6": "6px",
        "22": "22px",
        "28": "28px",
        "36": "36px",
        "56": "56px",
        "80": "80px",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: { "fade-up": "fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) both" },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
