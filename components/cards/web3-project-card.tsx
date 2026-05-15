// components/cards/web3-project-card.tsx
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChainBadges } from "@/components/store-badges";
import type { Database } from "@/types/database.types";

type Web3 = Database["public"]["Tables"]["web3_projects"]["Row"];

const STATUS_LABEL: Record<Web3["status"], string> = {
  live: "Live",
  testnet: "Testnet",
  coming_soon: "Coming soon",
  archived: "Archived",
};

export function Web3ProjectCard({ project, className }: { project: Web3; className?: string }) {
  return (
    <Link
      href={`/web3/${project.slug}`}
      className={cn(
        "group flex flex-col gap-5 rounded-md border border-card-border bg-canvas p-3 transition-colors hover:border-ink/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-pale-blue">
        {project.hero_image_url ? (
          <Image
            src={project.hero_image_url}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : null}
        <span className="absolute left-3 top-3 rounded-pill bg-canvas/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-ink">
          {STATUS_LABEL[project.status]}
        </span>
      </div>
      <div className="flex flex-col gap-3 p-3 pt-0">
        <h3 className="font-display text-h4 leading-tight text-ink">{project.title}</h3>
        {project.description ? (
          <p className="text-sm text-ink/70 line-clamp-2">{project.description}</p>
        ) : null}
        <ChainBadges chains={project.chains} />
      </div>
    </Link>
  );
}
