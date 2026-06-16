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

import tgdChromeLight from "@/assets/tgd-chrome-light.png";
import tgdChromeDark from "@/assets/tgd-chrome-dark.png";
import tgdOptionsLight from "@/assets/tgd-options-light.png";
import tgdOptionsDark from "@/assets/tgd-options-dark.png";
import tgdPopupLight from "@/assets/tgd-popup-light.png";
import tgdPopupDark from "@/assets/tgd-popup-dark.png";

const TGD_STORE_URL =
  "https://chromewebstore.google.com/detail/the-great-er-tab-discarder/plpkmjcnhhnpkblimgenmdhghfgghdpp";
const TGD_EDGE_URL =
  "https://microsoftedge.microsoft.com/addons/detail/the-greater-tab-discarder/lieejiddoadedggjdkgeellgeeibbnai";
const TGD_REPO = { owner: "rkodey", repo: "the-great-er-discarder-er" } as const;

export const Route = createFileRoute("/tgd")({
  head: () => ({
    meta: [
      { title: "The Great-er Tab Discarder — Marvellous Codeworks" },
      {
        name: "description",
        content:
          "The Great-er Tab Discarder leverages the native Chromium discarding engine to freeze inactive tabs, releasing nearly 100% of their RAM while keeping them visible in your tab bar.",
      },
      { property: "og:title", content: "The Great-er Tab Discarder — Marvellous Codeworks" },
      {
        property: "og:description",
        content:
          "Native Chromium tab discarding. Zero performance overhead, force purge hotkey, smart context whitelist — all open source.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TgdPage,
});

function TgdPage() {
  const { t } = useI18n();
  const fetchStats = useServerFn(getExtensionStats);
  const fetchGithub = useServerFn(getGithubStats);

  const stats = useQuery({
    queryKey: ["ext-stats", TGD_STORE_URL],
    queryFn: () => fetchStats({ data: { url: TGD_STORE_URL } }),
    staleTime: 1000 * 60 * 60,
  });
  const github = useQuery({
    queryKey: ["gh-stats", TGD_REPO.owner, TGD_REPO.repo],
    queryFn: () => fetchGithub({ data: TGD_REPO }),
    staleTime: 1000 * 60 * 60,
  });

  const features = [
    { title: t("tgd.f1.t"), body: t("tgd.f1.b") },
    { title: t("tgd.f2.t"), body: t("tgd.f2.b") },
    { title: t("tgd.f3.t"), body: t("tgd.f3.b") },
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
          name={t("tgd.name")}
          description={t("tgd.description")}
          features={features}
          preview={
            <ScreenshotCarousel
              slides={[
                { src: tgdChromeLight, alt: "The Great-er Tab Discarder — Chrome (light)" },
                { src: tgdChromeDark,  alt: "The Great-er Tab Discarder — Chrome (dark)" },
                { src: tgdPopupLight,  alt: "The Great-er Tab Discarder — Popup (light)" },
                { src: tgdPopupDark,   alt: "The Great-er Tab Discarder — Popup (dark)" },
                { src: tgdOptionsLight, alt: "The Great-er Tab Discarder — Options (light)" },
                { src: tgdOptionsDark,  alt: "The Great-er Tab Discarder — Options (dark)" },
              ]}
            />
          }
          storeUrl={TGD_STORE_URL}
          edgeUrl={TGD_EDGE_URL}
          sourceUrl={`https://github.com/${TGD_REPO.owner}/${TGD_REPO.repo}`}
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
