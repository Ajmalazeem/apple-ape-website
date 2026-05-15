// components/sections/page-placeholder.tsx
// Phase 1 stand-in. Phase 2 replaces these surfaces with real content.
import Link from "next/link";

interface Props {
  eyebrow: string;
  title: string;
  description?: string;
  phase?: string;
}

export function PagePlaceholder({ eyebrow, title, description, phase = "Phase 2" }: Props) {
  return (
    <div className="container section">
      <div className="max-w-3xl">
        <span className="label-mono">{eyebrow}</span>
        <h1 className="mt-6 font-display text-product leading-none tracking-[-0.02em] text-ink">
          {title}
        </h1>
        {description ? (
          <p className="mt-8 text-lead text-ink/80">{description}</p>
        ) : null}
        <p className="mt-12 text-sm text-muted-slate">
          This surface is scaffolded in {phase}.{" "}
          <Link href="/" className="underline underline-offset-4">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
