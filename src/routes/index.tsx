import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ProductCard } from "@/components/ProductCard";
import { ScreenshotCarousel } from "@/components/ScreenshotCarousel";
import { BlogCarousel } from "@/components/BlogCarousel";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { getExtensionStats } from "@/lib/extension-stats.functions";
import { getGithubStats } from "@/lib/github-stats.functions";
import { useI18n } from "@/lib/i18n";
import heroChrome from "@/assets/hero-chrome-opt.webp";

import tgdChromeLight from "@/assets/tgd-chrome-light.png";
import tgdChromeDark from "@/assets/tgd-chrome-dark.png";
import tgdOptionsLight from "@/assets/tgd-options-light.png";
import tgdOptionsDark from "@/assets/tgd-options-dark.png";
import tgdPopupLight from "@/assets/tgd-popup-light.png";
import tgdPopupDark from "@/assets/tgd-popup-dark.png";

import tmsGoogle from "@/assets/tms-google.png";
import tmsGoogleDark from "@/assets/tms-google-dark.png";
import tmsSettings from "@/assets/tms-settings.png";
import tmsSuspend from "@/assets/tms-suspend.png";
import tmsSession from "@/assets/tms-session.png";
import tmsAbout from "@/assets/tms-about.png";
import tmsKeyboard from "@/assets/tms-keyboard.png";

const TMS_STORE_URL =
  "https://chromewebstore.google.com/detail/the-marvellous-suspender/noogafoofpebimajpfpamcfhoaifemoa";
const TGD_STORE_URL =
  "https://chromewebstore.google.com/detail/the-great-er-tab-discarder/plpkmjcnhhnpkblimgenmdhghfgghdpp";
const TGD_EDGE_URL =
  "https://microsoftedge.microsoft.com/addons/detail/the-greater-tab-discarder/lieejiddoadedggjdkgeellgeeibbnai";

const TMS_REPO = { owner: "gioxx", repo: "MarvellousSuspender" } as const;
const TGD_REPO = { owner: "rkodey", repo: "the-great-er-discarder-er" } as const;

const BLOG_URL = "https://kb.marvellouscode.works/blog";
const BLOG_RSS_URL = "https://kb.marvellouscode.works/blog/rss.xml";
const GITHUB_URL = "https://github.com/Marvellous-Codeworks";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      { rel: "alternate", type: "application/rss+xml", title: "Marvellous Codeworks Blog", href: BLOG_RSS_URL },
    ],
    meta: [
      { title: "Marvellous Codeworks — Precision Chromium Extensions" },
      {
        name: "description",
        content:
          "Marvellous Codeworks ships The Great-er Tab Discarder and The Marvellous Suspender — open-source Chromium extensions that reclaim browser memory without slowing you down.",
      },
      { property: "og:title", content: "Marvellous Codeworks — Precision Chromium Extensions" },
      {
        property: "og:description",
        content:
          "Open-source browser extensions engineered for memory efficiency. Discard or suspend inactive tabs without losing your session.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();
  const fetchStats = useServerFn(getExtensionStats);
  const fetchGithub = useServerFn(getGithubStats);
  const tgdStats = useQuery({
    queryKey: ["ext-stats", TGD_STORE_URL],
    queryFn: () => fetchStats({ data: { url: TGD_STORE_URL } }),
    staleTime: 1000 * 60 * 60,
  });
  const tmsStats = useQuery({
    queryKey: ["ext-stats", TMS_STORE_URL],
    queryFn: () => fetchStats({ data: { url: TMS_STORE_URL } }),
    staleTime: 1000 * 60 * 60,
  });
  const tgdGithub = useQuery({
    queryKey: ["gh-stats", TGD_REPO.owner, TGD_REPO.repo],
    queryFn: () => fetchGithub({ data: TGD_REPO }),
    staleTime: 1000 * 60 * 60,
  });
  const tmsGithub = useQuery({
    queryKey: ["gh-stats", TMS_REPO.owner, TMS_REPO.repo],
    queryFn: () => fetchGithub({ data: TMS_REPO }),
    staleTime: 1000 * 60 * 60,
  });

  const tgdFeatures = [
    { title: t("tgd.f1.t"), body: t("tgd.f1.b") },
    { title: t("tgd.f2.t"), body: t("tgd.f2.b") },
    { title: t("tgd.f3.t"), body: t("tgd.f3.b") },
  ];
  const tmsFeatures = [
    { title: t("tms.f1.t"), body: t("tms.f1.b") },
    { title: t("tms.f2.t"), body: t("tms.f2.b") },
    { title: t("tms.f3.t"), body: t("tms.f3.b") },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <SiteNav extensionsHref="#extensions" />

      {/* Hero */}
      <header className="relative pt-24 pb-16 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative">

          {/* Hero visual — browser screenshot, faded into the page */}
          <div aria-hidden className="hidden lg:block absolute -top-24 -bottom-16 right-0 w-[62%] pointer-events-none z-0">
            <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-background via-background/60 to-transparent z-10" />
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-background to-transparent z-10" />
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background to-transparent z-10" />
            <img
              src={heroChrome}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-left-top opacity-60"
            />
          </div>

          {/* Text — z-10 to sit above the mascot layer */}
          <div className="relative z-10 animate-reveal [animation-delay:100ms]">
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded border border-primary/20 bg-primary/5 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
                {t("hero.badge")}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-mono font-extrabold tracking-tight text-balance leading-[0.9] max-w-4xl">
              {t("hero.title.a")}
              <span className="text-primary">{t("hero.title.b")}</span>
              {t("hero.title.c")}
            </h1>
            <p className="mt-8 text-xl text-muted-foreground max-w-[50ch] text-pretty">
              {t("hero.subtitle")}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#extensions"
                className="h-11 px-6 bg-primary text-primary-foreground font-mono font-bold text-xs uppercase tracking-widest inline-flex items-center justify-center hover:bg-foreground transition-colors rounded-sm"
              >
                {t("hero.cta.view")}
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="h-11 px-6 border border-border font-mono font-bold text-xs uppercase tracking-widest inline-flex items-center justify-center hover:bg-accent transition-colors rounded-sm"
              >
                {t("hero.cta.github")}
              </a>
            </div>
          </div>
        </div>

        {/* Background grid */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#fff_70%,transparent_100%)]"
        />
      </header>

      {/* Blog carousel */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-border">
        <div className="flex items-baseline justify-between gap-4 mb-10">
          <h2 className="font-mono text-sm font-bold text-primary uppercase tracking-widest">
            {t("blog.section")}
          </h2>
          <a
            href={BLOG_URL}
            className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors"
          >
            {t("blog.cta.all")}
          </a>
        </div>
        <BlogCarousel />
      </section>

      {/* Dual showcase */}
      <section id="extensions" className="scroll-mt-24 max-w-7xl mx-auto px-6 pb-24 border-t border-border">
        <div className="mb-10 pt-24">
          <h2 className="font-mono text-sm font-bold text-primary uppercase tracking-widest">
            {"// "}{t("nav.extensions")}
          </h2>
        </div>
        <div className="grid lg:grid-cols-2 lg:[grid-template-rows:repeat(6,auto)] gap-x-px bg-border border border-border overflow-hidden">
          <ProductCard
            name={t("tgd.name")}
            description={t("tgd.description")}
            features={tgdFeatures}
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
            pageUrl="/tgd"
            stats={tgdStats.data}
            statsLoading={tgdStats.isLoading}
            github={tgdGithub.data}
            githubLoading={tgdGithub.isLoading}
            delay={200}
          />
          <ProductCard
            name={t("tms.name")}
            description={t("tms.description")}
            features={tmsFeatures}
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
            pageUrl="/tms"
            stats={tmsStats.data}
            statsLoading={tmsStats.isLoading}
            github={tmsGithub.data}
            githubLoading={tmsGithub.isLoading}
            delay={300}
          />
        </div>
      </section>

      {/* Trust signals */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-border">
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { n: "01", t: t("trust.01.t"), b: t("trust.01.b") },
            { n: "02", t: t("trust.02.t"), b: t("trust.02.b") },
            { n: "03", t: t("trust.03.t"), b: t("trust.03.b") },
          ].map((p, i) => (
            <div
              key={p.n}
              className="animate-reveal"
              style={{ animationDelay: `${400 + i * 50}ms` }}
            >
              <h3 className="font-mono text-xs font-bold text-primary uppercase tracking-widest mb-4">
                {p.n} // {p.t}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.b}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
