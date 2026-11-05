import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ProductCard } from "@/components/ProductCard";
import { ScreenshotCarousel } from "@/components/ScreenshotCarousel";
import { BlogCarousel } from "@/components/BlogCarousel";
import { HeroCarousel } from "@/components/HeroCarousel";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { getExtensionStats } from "@/lib/extension-stats.functions";
import { getGithubStats } from "@/lib/github-stats.functions";
import { useI18n } from "@/lib/i18n";
import logdropIcon from "@/assets/logdrop-icon.svg";
import oauthProxyIcon from "@/assets/tms-oauth-proxy-icon.svg";

import tgdChromeLight from "@/assets/tgd-chrome-light.png";
import tgdChromeDark from "@/assets/tgd-chrome-dark.png";
import tgdOptionsLight from "@/assets/tgd-options-light.png";
import tgdOptionsDark from "@/assets/tgd-options-dark.png";
import tgdPopupLight from "@/assets/tgd-popup-light.png";
import tgdPopupDark from "@/assets/tgd-popup-dark.png";

import tmsGoogle from "@/assets/tms-google.webp";
import tmsQuickActions from "@/assets/tms-quick-actions.webp";
import tmsSettings from "@/assets/tms-settings.webp";
import tmsSuspend from "@/assets/tms-suspend.webp";
import tmsSession from "@/assets/tms-session.webp";
import tmsAbout from "@/assets/tms-about.webp";
import tmsKeyboard from "@/assets/tms-keyboard.webp";

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

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "Marvellous Codeworks Blog",
        href: BLOG_RSS_URL,
      },
    ],
    meta: [
      { title: "Marvellous Codeworks — Precision Tools for the Web" },
      {
        name: "description",
        content:
          "Marvellous Codeworks ships The Great-er Tab Discarder and The Marvellous Suspender — open-source Chromium extensions that reclaim browser memory — plus self-hostable tools like logdrop and OAuth Proxy for Google.",
      },
      { property: "og:title", content: "Marvellous Codeworks — Precision Tools for the Web" },
      {
        property: "og:description",
        content:
          "Open-source software for the professional web: memory-efficient Chromium extensions, plus self-hostable utilities like logdrop and OAuth Proxy for Google.",
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
  const moreTools = [
    {
      href: "/logdrop",
      icon: logdropIcon,
      name: t("logdrop.name"),
      description: t("logdrop.description"),
    },
    {
      href: "/tms-oauth-proxy",
      icon: oauthProxyIcon,
      name: t("oauthproxy.name"),
      description: t("oauthproxy.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <SiteNav extensionsHref="#extensions" />

      <HeroCarousel />

      <main>
        {/* Blog carousel */}
        <section className="max-w-6xl mx-auto px-6 py-24 border-t border-border">
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

        {/* All products: extensions first, then the self-hostable tools */}
        <section
          id="extensions"
          className="scroll-mt-24 max-w-6xl mx-auto px-6 pb-24 border-t border-border"
        >
          <div className="mb-10 pt-24">
            <h2 className="font-mono text-sm font-bold text-primary uppercase tracking-widest">
              {"// "}
              {t("nav.extensions")}
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
                    { src: tgdChromeDark, alt: "The Great-er Tab Discarder — Chrome (dark)" },
                    { src: tgdPopupLight, alt: "The Great-er Tab Discarder — Popup (light)" },
                    { src: tgdPopupDark, alt: "The Great-er Tab Discarder — Popup (dark)" },
                    { src: tgdOptionsLight, alt: "The Great-er Tab Discarder — Options (light)" },
                    { src: tgdOptionsDark, alt: "The Great-er Tab Discarder — Options (dark)" },
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
                    { src: tmsGoogle, alt: "The Marvellous Suspender — Google (light)" },
                    { src: tmsQuickActions, alt: "The Marvellous Suspender — Quick actions" },
                    { src: tmsSuspend, alt: "The Marvellous Suspender — Suspended tab" },
                    { src: tmsSettings, alt: "The Marvellous Suspender — Settings" },
                    { src: tmsSession, alt: "The Marvellous Suspender — Session management" },
                    { src: tmsAbout, alt: "The Marvellous Suspender — About" },
                    { src: tmsKeyboard, alt: "The Marvellous Suspender — Keyboard shortcuts" },
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
          <div className="mt-6 space-y-6">
            {moreTools.map((tool) => (
              <div
                key={tool.href}
                className="border border-border p-8 lg:p-12 flex flex-col md:flex-row md:items-center gap-8"
              >
                <div className="flex-1 space-y-3">
                  <img src={tool.icon} alt="" className="h-10 w-10 rounded-[6px]" />
                  <h3 className="text-2xl font-mono font-bold tracking-tight">
                    <a href={tool.href} className="hover:text-primary transition-colors">
                      {tool.name}
                    </a>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
                    {tool.description}
                  </p>
                </div>
                <div className="flex flex-col gap-3 shrink-0 md:min-w-[200px]">
                  <a
                    href={tool.href}
                    className="h-11 px-6 bg-primary text-primary-foreground font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center hover:bg-foreground transition-colors rounded-sm"
                  >
                    {t("product.learnMore")}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trust signals */}
        <section className="max-w-6xl mx-auto px-6 py-24 border-t border-border">
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
      </main>

      <SiteFooter />
    </div>
  );
}
