import type { ReactNode } from "react";
import type { ExtensionStats } from "@/lib/extension-stats.functions";
import type { GithubStats } from "@/lib/github-stats.functions";
import { useI18n } from "@/lib/i18n";

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
  github?: GithubStats;
  githubLoading?: boolean;
  delay?: number;
}

function formatCount(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return `${n}`;
}

function useTimeAgo() {
  const { t } = useI18n();
  return (iso: string | null | undefined): string | undefined => {
    if (!iso) return undefined;
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return undefined;
    const days = Math.max(0, Math.floor((Date.now() - then) / 86_400_000));
    if (days === 0) return t("time.today");
    if (days === 1) return t("time.day");
    if (days < 30) return t("time.days", { n: days });
    const months = Math.floor(days / 30);
    if (months < 12) return t("time.months", { n: months });
    const years = (days / 365).toFixed(1);
    return t("time.years", { n: years });
  };
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
  tooltip,
}: {
  label: string;
  value: string;
  sub?: string;
  loading?: boolean;
  tooltip?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="relative group/tooltip">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground cursor-help">
          {label}
        </span>
        {tooltip ? (
          <div className="absolute bottom-full left-0 mb-1 hidden group-hover/tooltip:block bg-popover text-popover-foreground text-[10px] font-mono px-2 py-1.5 rounded border border-border shadow-sm whitespace-nowrap z-10">
            {tooltip}
          </div>
        ) : null}
      </div>
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
  github,
  githubLoading,
  delay = 0,
}: ProductCardProps) {
  const { t } = useI18n();
  const timeAgo = useTimeAgo();
  const ratingValue = stats?.rating != null ? stats.rating.toFixed(1) : "—";
  const ratingSub =
    stats?.ratingCount != null
      ? t("card.rating.sub", { n: stats.ratingCount.toLocaleString("en-US") })
      : undefined;
  const usersValue = formatUsers(stats?.usersLabel ?? null, stats?.users ?? null);
  const repoHref = github?.repoUrl ?? sourceUrl;

  const githubUnavailable =
    !!github?.error ||
    (!githubLoading &&
      github &&
      github.stars == null &&
      github.forks == null &&
      github.openIssues == null &&
      github.latestRelease == null &&
      github.pushedAt == null);

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

      {/* Chrome Web Store metrics */}
      <div className="mb-4">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {t("card.cws")}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-6 py-6 mb-6 border-y border-border">
        <StatBlock
          label={t("card.users")}
          value={usersValue}
          sub={t("card.users.sub")}
          loading={statsLoading && !stats}
        />
        <StatBlock
          label={t("card.rating")}
          value={ratingValue === "—" ? "—" : `${ratingValue}★`}
          sub={ratingSub}
          loading={statsLoading && !stats}
        />
      </div>

      {/* GitHub metrics */}
      <div className="mb-4">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {t("card.gh")}
        </span>
      </div>
      {githubUnavailable ? (
        <div className="py-6 mb-10 border-y border-border flex items-center gap-3">
          <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground/30" />
          <span className="font-mono text-xs text-muted-foreground">{t("card.unavailable")}</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 py-6 mb-10 border-y border-border">
          <StatBlock
            label={t("card.stars")}
            value={formatCount(github?.stars)}
            sub={t("card.stars.sub")}
            loading={githubLoading && !github}
            tooltip={t("card.stars.tip")}
          />
          <StatBlock
            label={t("card.forks")}
            value={formatCount(github?.forks)}
            sub={t("card.forks.sub")}
            loading={githubLoading && !github}
            tooltip={t("card.forks.tip")}
          />
          <StatBlock
            label={t("card.issues")}
            value={formatCount(github?.openIssues)}
            sub={t("card.issues.sub")}
            loading={githubLoading && !github}
            tooltip={t("card.issues.tip")}
          />
          <StatBlock
            label={t("card.release")}
            value={github?.latestRelease ?? "—"}
            sub={timeAgo(github?.latestReleaseAt) ?? t("card.release.sub")}
            loading={githubLoading && !github}
            tooltip={t("card.release.tip")}
          />
          <StatBlock
            label={t("card.push")}
            value={timeAgo(github?.pushedAt) ?? "—"}
            sub={t("card.push.sub")}
            loading={githubLoading && !github}
            tooltip={t("card.push.tip")}
          />
        </div>
      )}

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
          {t("card.cta.store")}
        </a>
        <a
          href={repoHref}
          target="_blank"
          rel="noreferrer"
          className="flex-1 h-12 border border-border font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center hover:bg-accent transition-colors rounded-sm"
        >
          {t("card.cta.source")}
        </a>
      </div>
    </article>
  );
}
