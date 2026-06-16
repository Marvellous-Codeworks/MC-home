import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ScreenshotGallery } from "@/components/ScreenshotGallery";
import { getExtensionStats } from "@/lib/extension-stats.functions";
import { getGithubStats } from "@/lib/github-stats.functions";
import { getBlogPostsByTag } from "@/lib/blog-posts-by-tag.functions";
import { useI18n } from "@/lib/i18n";

import tmsGoogle from "@/assets/tms-google.png";
import tmsGoogleDark from "@/assets/tms-google-dark.png";
import tmsSettings from "@/assets/tms-settings.png";
import tmsSuspend from "@/assets/tms-suspend.png";
import tmsSession from "@/assets/tms-session.png";
import tmsAbout from "@/assets/tms-about.png";
import tmsKeyboard from "@/assets/tms-keyboard.png";

const TMS_STORE_URL =
  "https://chromewebstore.google.com/detail/the-marvellous-suspender/noogafoofpebimajpfpamcfhoaifemoa";
const TMS_REPO = { owner: "gioxx", repo: "MarvellousSuspender" } as const;
const BLOG_TAG = "the marvellous suspender";

const SLIDES = [
  { src: tmsGoogle,     alt: "The Marvellous Suspender — Google (light)" },
  { src: tmsGoogleDark, alt: "The Marvellous Suspender — Google (dark)" },
  { src: tmsSuspend,    alt: "The Marvellous Suspender — Suspended tab" },
  { src: tmsSettings,   alt: "The Marvellous Suspender — Settings" },
  { src: tmsSession,    alt: "The Marvellous Suspender — Session management" },
  { src: tmsAbout,      alt: "The Marvellous Suspender — About" },
  { src: tmsKeyboard,   alt: "The Marvellous Suspender — Keyboard shortcuts" },
];

export const Route = createFileRoute("/tms")({
  head: () => ({
    meta: [
      { title: "The Marvellous Suspender — Marvellous Codeworks" },
      {
        name: "description",
        content:
          "The Marvellous Suspender is an open-source Chromium extension that replaces inactive tabs with a lightweight hibernation page, giving you granular control over when they wake.",
      },
      { property: "og:title", content: "The Marvellous Suspender — Marvellous Codeworks" },
      {
        property: "og:description",
        content:
          "Granular tab hibernation for Chromium. Screenshot previews, session recovery, battery power mode — all open source.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TmsPage,
});

function formatCount(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return `${n}`;
}

function formatUsers(label: string | null, n: number | null): string {
  if (label) return `${label}+`;
  if (!n) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K+`;
  return `${n}`;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch { return ""; }
}

function Stat({ label, value, loading }: { label: string; value: string; loading?: boolean }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground truncate">
        {label}
      </span>
      {loading ? (
        <span className="inline-block h-6 w-12 bg-muted animate-pulse rounded-sm" />
      ) : (
        <span className="font-mono text-xl font-bold tabular-nums">{value}</span>
      )}
    </div>
  );
}

function TmsPage() {
  const { t } = useI18n();
  const fetchStats = useServerFn(getExtensionStats);
  const fetchGithub = useServerFn(getGithubStats);
  const fetchBlog = useServerFn(getBlogPostsByTag);

  const stats = useQuery({
    queryKey: ["ext-stats", TMS_STORE_URL],
    queryFn: () => fetchStats({ data: { url: TMS_STORE_URL } }),
    staleTime: 1000 * 60 * 60,
  });
  const github = useQuery({
    queryKey: ["gh-stats", TMS_REPO.owner, TMS_REPO.repo],
    queryFn: () => fetchGithub({ data: TMS_REPO }),
    staleTime: 1000 * 60 * 60,
  });
  const blogPosts = useQuery({
    queryKey: ["blog-by-tag", BLOG_TAG],
    queryFn: () => fetchBlog({ data: { tag: BLOG_TAG } }),
    staleTime: 1000 * 60 * 30,
  });

  const repoUrl = github.data?.repoUrl ?? `https://github.com/${TMS_REPO.owner}/${TMS_REPO.repo}`;
  const usersValue = formatUsers(stats.data?.usersLabel ?? null, stats.data?.users ?? null);
  const ratingValue = stats.data?.rating != null ? `${stats.data.rating.toFixed(1)}★` : "—";

  const features = [
    { title: t("tms.f1.t"), body: t("tms.f1.b") },
    { title: t("tms.f2.t"), body: t("tms.f2.b") },
    { title: t("tms.f3.t"), body: t("tms.f3.b") },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <SiteNav />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">

        {/* Breadcrumb + hero */}
        <div>
          <a
            href="/#extensions"
            className="inline-block font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            {t("product.back")}
          </a>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2 py-1 border border-primary/20 bg-primary/5">
                <span className="font-mono text-[9px] uppercase tracking-widest text-primary">
                  Tab Suspension · Chrome Extension
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-mono font-extrabold tracking-tight leading-[0.95]">
                {t("tms.name")}
              </h1>
              <p className="text-muted-foreground leading-relaxed max-w-prose">
                {t("tms.description")}
              </p>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-col gap-3 shrink-0 md:min-w-[200px]">
              <a
                href={TMS_STORE_URL}
                target="_blank"
                rel="noreferrer"
                className="h-11 px-6 bg-primary text-primary-foreground font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center hover:bg-foreground transition-colors rounded-sm"
              >
                {t("card.cta.store")}
              </a>
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="h-11 px-6 border border-border font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center hover:bg-accent transition-colors rounded-sm"
              >
                {t("card.cta.source")}
              </a>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border border-border p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 divide-x divide-border">
            <Stat label={t("card.users")} value={usersValue} loading={stats.isLoading && !stats.data} />
            <div className="pl-6">
              <Stat label={t("card.rating")} value={ratingValue} loading={stats.isLoading && !stats.data} />
            </div>
            <div className="pl-6">
              <Stat label={t("card.stars")} value={formatCount(github.data?.stars)} loading={github.isLoading && !github.data} />
            </div>
            <div className="pl-6">
              <Stat label={t("card.forks")} value={formatCount(github.data?.forks)} loading={github.isLoading && !github.data} />
            </div>
            <div className="pl-6">
              <Stat label={t("card.issues")} value={formatCount(github.data?.openIssues)} loading={github.isLoading && !github.data} />
            </div>
            <div className="pl-6">
              <Stat label={t("card.release")} value={github.data?.latestRelease ?? "—"} loading={github.isLoading && !github.data} />
            </div>
          </div>
        </div>

        {/* Screenshot gallery */}
        <div>
          <h2 className="font-mono text-sm font-bold text-primary uppercase tracking-widest mb-6">
            // Screenshots
          </h2>
          <ScreenshotGallery slides={SLIDES} />
        </div>

        {/* Features */}
        <div>
          <h2 className="font-mono text-sm font-bold text-primary uppercase tracking-widest mb-8">
            // {t("nav.extensions")}
          </h2>
          <ul className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <li key={f.title} className="border border-border p-6 space-y-3">
                <div className="size-1.5 bg-primary" aria-hidden />
                <p className="font-mono text-sm font-bold text-foreground">{f.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Blog posts */}
        {(blogPosts.data?.length ?? 0) > 0 && (
          <div>
            <div className="flex items-baseline justify-between gap-4 mb-8">
              <h2 className="font-mono text-sm font-bold text-primary uppercase tracking-widest">
                {t("blog.section")}
              </h2>
              <a
                href="https://kb.marvellouscode.works/blog"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors"
              >
                {t("blog.cta.all")}
              </a>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {blogPosts.data!.map((post) => (
                <a
                  key={post.id}
                  href={post.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col gap-3 p-6 border border-border hover:border-primary/40 transition-colors"
                >
                  {post.date && (
                    <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                      {formatDate(post.date)}
                    </span>
                  )}
                  <h3 className="font-mono text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-3">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4 flex-1">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="font-mono text-[10px] text-primary mt-auto">{t("blog.cta.read")}</span>
                </a>
              ))}
            </div>
          </div>
        )}

      </main>

      <SiteFooter />
    </div>
  );
}
