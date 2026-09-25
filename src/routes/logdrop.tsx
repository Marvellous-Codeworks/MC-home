import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ScreenshotGallery } from "@/components/ScreenshotGallery";
import { getGithubStats } from "@/lib/github-stats.functions";
import { useI18n } from "@/lib/i18n";
import { UploadCloud, KeyRound, Timer, type LucideIcon } from "lucide-react";
import logdropIcon from "@/assets/logdrop-icon.svg";
import logdropUploadFilled from "@/assets/logdrop-upload-filled.webp";
import logdropUploadResult from "@/assets/logdrop-upload-result.webp";
import logdropAdminLogin from "@/assets/logdrop-admin-login.webp";
import logdropAdminDashboard from "@/assets/logdrop-admin-dashboard.webp";
import logdropPasteView from "@/assets/logdrop-paste-view.webp";

const SLIDES = [
  { src: logdropUploadFilled, alt: "logdrop — uploading a log, ready to submit" },
  { src: logdropUploadResult, alt: "logdrop — link ready after upload" },
  { src: logdropAdminLogin, alt: "logdrop — admin sign-in" },
  { src: logdropAdminDashboard, alt: "logdrop — admin dashboard" },
  { src: logdropPasteView, alt: "logdrop — single paste view" },
];

const LOGDROP_URL = "https://logdrop.marvellouscode.works";
const LOGDROP_REPO = { owner: "Marvellous-Codeworks", repo: "logdrop" } as const;

export const Route = createFileRoute("/logdrop")({
  head: () => ({
    meta: [
      { title: "logdrop — Marvellous Codeworks" },
      {
        name: "description",
        content:
          "logdrop is a self-hostable, PrivateBin-style plain-text drop-off — upload with no account, read back only via a maintainer magic-link, auto-expiring.",
      },
      { property: "og:title", content: "logdrop — Marvellous Codeworks" },
      {
        property: "og:description",
        content:
          "A generic, self-hostable plain-text drop-off for safely sharing diagnostic reports and logs.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LogdropPage,
});

function formatCount(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return `${n}`;
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

function LogdropPage() {
  const { t } = useI18n();
  const fetchGithub = useServerFn(getGithubStats);

  const github = useQuery({
    queryKey: ["gh-stats", LOGDROP_REPO.owner, LOGDROP_REPO.repo],
    queryFn: () => fetchGithub({ data: LOGDROP_REPO }),
    staleTime: 1000 * 60 * 60,
  });

  const repoUrl =
    github.data?.repoUrl ?? `https://github.com/${LOGDROP_REPO.owner}/${LOGDROP_REPO.repo}`;

  const features: Array<{ title: string; body: string; icon: LucideIcon }> = [
    { title: t("logdrop.f1.t"), body: t("logdrop.f1.b"), icon: UploadCloud },
    { title: t("logdrop.f2.t"), body: t("logdrop.f2.b"), icon: KeyRound },
    { title: t("logdrop.f3.t"), body: t("logdrop.f3.b"), icon: Timer },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <SiteNav />

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Breadcrumb + hero */}
        <div>
          <a
            href="/"
            className="inline-block font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            {t("product.back")}
          </a>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <img src={logdropIcon} alt="" className="h-12 w-12 rounded-[7px]" />
              <h1 className="text-4xl md:text-5xl font-mono font-extrabold tracking-tight leading-[0.95]">
                {t("logdrop.name")}
              </h1>
              <p className="text-muted-foreground leading-relaxed max-w-prose">
                {t("logdrop.description")}
              </p>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-col gap-3 shrink-0 md:min-w-[200px]">
              <a
                href={LOGDROP_URL}
                target="_blank"
                rel="noreferrer"
                className="h-11 px-6 bg-primary text-primary-foreground font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center hover:bg-foreground transition-colors rounded-sm"
              >
                {t("logdrop.cta.open")}
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

        {/* GitHub metrics */}
        <div className="border border-border p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 divide-x divide-border">
            <Stat
              label={t("card.stars")}
              value={formatCount(github.data?.stars)}
              loading={github.isLoading && !github.data}
            />
            <div className="pl-6">
              <Stat
                label={t("card.forks")}
                value={formatCount(github.data?.forks)}
                loading={github.isLoading && !github.data}
              />
            </div>
            <div className="pl-6">
              <Stat
                label={t("card.issues")}
                value={formatCount(github.data?.openIssues)}
                loading={github.isLoading && !github.data}
              />
            </div>
            <div className="pl-6">
              <Stat
                label={t("card.release")}
                value={github.data?.latestRelease ?? "—"}
                loading={github.isLoading && !github.data}
              />
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
            {t("product.features")}
          </h2>
          <ul className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <li key={f.title} className="border border-border p-8 space-y-5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[10px] text-primary uppercase tracking-widest mt-0.5">
                      {String(i + 1).padStart(2, "0")} //
                    </span>
                    <Icon className="w-5 h-5 text-primary/70 shrink-0" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-mono text-sm font-bold text-foreground">{f.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
