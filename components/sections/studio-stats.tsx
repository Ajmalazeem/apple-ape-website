// components/sections/studio-stats.tsx
// Trust-strip cadence: large horizontal spacing, monochrome, no card chrome.
import type { Database } from "@/types/database.types";

type Stat = Database["public"]["Tables"]["studio_stats"]["Row"];

const FALLBACK: Array<Pick<Stat, "key" | "label" | "value">> = [
  { key: "verticals",  label: "Product Lines",    value: "3"       },
  { key: "ownership",  label: "Built In-House",   value: "100%"    },
  { key: "platform",   label: "Primary Platform", value: "Android" },
  { key: "patterns",   label: "Dark Patterns",    value: "Zero"    },
];

export function StudioStats({ stats }: { stats: Stat[] }) {
  const items = stats.length ? stats : (FALLBACK as Stat[]);
  return (
    <section
      aria-label="Studio numbers"
      className="border-y border-hairline bg-canvas"
    >
      <div className="container py-16 lg:py-24">
        <p className="label-mono">By the numbers</p>
        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {items.map((stat) => (
            <div key={stat.key} className="flex flex-col gap-2">
              <dt className="text-sm text-muted-slate">{stat.label}</dt>
              <dd className="font-display text-[clamp(2rem,5vw,3.75rem)] leading-none tracking-[-0.02em] text-ink">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
