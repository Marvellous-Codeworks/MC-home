import type { ReactNode } from "react";
import type { ExtensionStats } from "@/lib/extension-stats.functions";

export interface ProductFeature {
  title: string;
  body: string;
}

export interface ProductCardProps {
  name: string;
  description: string;
  features: ProductFeature[];
  preview: ReactNode;
  storeUrl: string;
  sourceUrl: string;
  stats?: ExtensionStats;
  statsLoading?: boolean;
  delay?: number;
}

function formatUsers(label: string | null, n: number | null): string {
  if (label) return `${label}+`;
  if (!n) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K+`;
  return `${n}`;
}

function StatBlock({
  label,
  value,
  sub,
  loading,
}: {
  label: string;
  value: string;
  sub?: string;
  loading?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-2xl font-bold tracking-tight tabular-nums">
        {loading ? <span className="inline-block h-6 w-16 bg-muted animate-pulse rounded-sm" /> : value}
      </span>
      {sub && !loading ? (
        <span className="font-mono text-[10px] text-muted-foreground">{sub}</span>
      ) : null}
    </div>
  );
}

export function ProductCard({
  name,
  description,
  features,
  preview,
  storeUrl,
  sourceUrl,
  stats,
  statsLoading,
  delay = 0,
}: ProductCardProps) {
  const ratingValue = stats?.rating != null ? stats.rating.toFixed(1) : "—";
  const ratingSub =
    stats?.ratingCount != null
      ? `${stats.ratingCount.toLocaleString("en-US")} ratings`
      : undefined;
  const usersValue = formatUsers(stats?.usersLabel ?? null, stats?.users ?? null);

  return (
    <article
      className="bg-background p-8 lg:p-12 animate-reveal group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h2 className="text-3xl font-mono font-bold mb-4 tracking-tight">{name}</h2>
      <p className="text-muted-foreground mb-8 leading-relaxed">{description}</p>

      <ul className="space-y-4 mb-10">
        {features.map((f) => (
          <li key={f.title} className="flex items-start gap-4">
            <div className="mt-1.5 size-1 bg-primary shrink-0" aria-hidden />
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground font-medium">{f.title}</strong> {f.body}
            </p>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-3 gap-6 py-6 mb-10 border-y border-border">
        <StatBlock
          label="Users"
          value={usersValue}
          sub="Chrome Web Store"
          loading={statsLoading && !stats}
        />
        <StatBlock
          label="Rating"
          value={ratingValue === "—" ? "—" : `${ratingValue}★`}
          sub={ratingSub}
          loading={statsLoading && !stats}
        />
        <StatBlock
          label="License"
          value="OSS"
          sub="Open source"
        />
      </div>

      <div className="w-full aspect-video bg-muted/40 mb-10 border border-border group-hover:border-primary/20 transition-colors overflow-hidden">
        {preview}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href={storeUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 h-12 bg-primary text-primary-foreground font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center hover:bg-foreground transition-colors rounded-sm"
        >
          Chrome Web Store
        </a>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 h-12 border border-border font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center hover:bg-black/5 transition-colors rounded-sm"
        >
          GitHub Source
        </a>
      </div>
    </article>
  );
}
