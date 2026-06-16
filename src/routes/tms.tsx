import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ProductCard } from "@/components/ProductCard";
import { ScreenshotCarousel } from "@/components/ScreenshotCarousel";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { getExtensionStats } from "@/lib/extension-stats.functions";
import { getGithubStats } from "@/lib/github-stats.functions";
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

function TmsPage() {
  const { t } = useI18n();
  const fetchStats = useServerFn(getExtensionStats);
  const fetchGithub = useServerFn(getGithubStats);

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

  const features = [
    { title: t("tms.f1.t"), body: t("tms.f1.b") },
    { title: t("tms.f2.t"), body: t("tms.f2.b") },
    { title: t("tms.f3.t"), body: t("tms.f3.b") },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <SiteNav />

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <a
          href="/#extensions"
          className="inline-block font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-10"
        >
          {t("product.back")}
        </a>

        <ProductCard
          name={t("tms.name")}
          description={t("tms.description")}
          features={features}
          preview={
            <ScreenshotCarousel
              slides={[
                { src: tmsGoogle,     alt: "The Marvellous Suspender — Google (light)" },
                { src: tmsGoogleDark, alt: "The Marvellous Suspender — Google (dark)" },
                { src: tmsSuspend,    alt: "The Marvellous Suspender — Suspended tab" },
                { src: tmsSettings,   alt: "The Marvellous Suspender — Settings" },
                { src: tmsSession,    alt: "The Marvellous Suspender — Session management" },
                { src: tmsAbout,      alt: "The Marvellous Suspender — About" },
                { src: tmsKeyboard,   alt: "The Marvellous Suspender — Keyboard shortcuts" },
              ]}
            />
          }
          storeUrl={TMS_STORE_URL}
          sourceUrl={`https://github.com/${TMS_REPO.owner}/${TMS_REPO.repo}`}
          stats={stats.data}
          statsLoading={stats.isLoading}
          github={github.data}
          githubLoading={github.isLoading}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
