import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ProductCard } from "@/components/ProductCard";
import { LanguageToggle, ThemeToggle } from "@/components/Toggles";
import { getExtensionStats } from "@/lib/extension-stats.functions";
import { getGithubStats } from "@/lib/github-stats.functions";
import { useI18n } from "@/lib/i18n";
import tgdMascotte from "@/assets/tgd-mascotte.jpg";
import tmsMascotte from "@/assets/tms-mascotte.jpg";
import logo from "@/assets/marvellous-logo.png";

const TMS_STORE_URL =
  "https://chromewebstore.google.com/detail/the-marvellous-suspender/noogafoofpebimajpfpamcfhoaifemoa";
const TGD_STORE_URL =
  "https://chromewebstore.google.com/detail/the-great-er-tab-discarder/plpkmjcnhhnpkblimgenmdhghfgghdpp";
const TGD_EDGE_URL =
  "https://microsoftedge.microsoft.com/addons/detail/the-greater-tab-discarder/lieejiddoadedggjdkgeellgeeibbnai";

const TMS_REPO = { owner: "gioxx", repo: "MarvellousSuspender" } as const;
const TGD_REPO = { owner: "rkodey", repo: "the-great-er-discarder-er" } as const;

export const Route = createFileRoute("/")({
  head: () => ({
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

const DOCS_URL = "https://kb.marvellouscode.works/docs/intro/";
const BLOG_URL = "https://kb.marvellouscode.works/blog";
const GITHUB_URL = "https://github.com/Marvellous-Codeworks";
const TGD_ISSUES_URL = `https://github.com/${TGD_REPO.owner}/${TGD_REPO.repo}/issues`;
const TMS_ISSUES_URL = `https://github.com/${TMS_REPO.owner}/${TMS_REPO.repo}/issues`;

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
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-3 min-w-0">
            <img src={logo} alt="Marvellous Codeworks" className="h-7 w-auto" />
            <span className="font-mono text-sm font-bold tracking-tighter uppercase truncate">
              Marvellous Codeworks
            </span>
          </a>
          <div className="flex items-center gap-5 sm:gap-8">
            <a
              href="#extensions"
              className="hidden sm:inline text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
            >
              {t("nav.extensions")}
            </a>
            <a
              href={DOCS_URL}
              className="hidden sm:inline text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
            >
              {t("nav.docs")}
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
            >
              {t("nav.github")}
            </a>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative pt-24 pb-16 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative">

          {/* Hero visual — layered card composition */}
          <div aria-hidden className="hidden lg:block absolute -top-24 -bottom-16 right-0 w-[58%] pointer-events-none z-0 select-none">
            {/* Edge fades */}
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-background to-transparent z-20" />
            <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background to-transparent z-20" />
            <div className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-background to-transparent z-20" />

            <div className="absolute inset-0 flex items-center justify-end pr-8">
              <div className="relative w-80 h-[420px]">

                {/* Layer 0 — background suspended chips, barely visible */}
                <div className="absolute bottom-0 left-4 right-0 space-y-1.5 opacity-40">
                  {([
                    "reddit.com/r/programming",
                    "linear.app/team/issues",
                    "docs.google.com/spreadsheet",
                    "twitter.com/home",
                  ] as string[]).map((domain) => (
                    <div key={domain} className="flex items-center gap-2 px-2.5 py-1.5 bg-muted/20 border border-border/20 rounded-sm">
                      <div className="size-1.5 rounded-full bg-muted-foreground/15 shrink-0" />
                      <span className="font-mono text-[10px] text-muted-foreground/30 truncate">{domain}</span>
                    </div>
                  ))}
                </div>

                {/* Layer 1 — tab list card, slightly behind and tilted left */}
                <div className="absolute top-[88px] left-0 right-10 p-4 bg-card border border-border rounded-sm shadow-lg -rotate-[1.5deg] z-10">
                  <div className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground mb-3">
                    Open tabs
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 px-2.5 py-2 bg-primary/5 border border-primary/20 rounded-sm">
                      <div className="size-1.5 rounded-full bg-primary shrink-0" />
                      <span className="font-mono text-[10px] text-foreground truncate flex-1">stackoverflow.com</span>
                      <span className="font-mono text-[9px] text-muted-foreground shrink-0">318 MB</span>
                    </div>
                    {([
                      { domain: "figma.com", mem: "98 MB" },
                      { domain: "notion.so", mem: "71 MB" },
                      { domain: "x.com", mem: "203 MB" },
                      { domain: "github.com", mem: "144 MB" },
                    ] as { domain: string; mem: string }[]).map((tab) => (
                      <div key={tab.domain} className="flex items-center gap-2 px-2.5 py-2 bg-muted/10 border border-border/30 rounded-sm">
                        <div className="size-1.5 rounded-full bg-muted-foreground/15 shrink-0" />
                        <span className="font-mono text-[10px] text-muted-foreground/45 truncate flex-1">{tab.domain}</span>
                        <span className="font-mono text-[9px] text-muted-foreground/30 shrink-0">{tab.mem} ↓</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Layer 2 — dominant stat card, on top, tilted right */}
                <div className="absolute top-0 right-0 w-52 p-5 bg-card border border-primary/30 rounded-sm shadow-xl rotate-[1.5deg] z-20">
                  <div className="font-mono text-[8px] uppercase tracking-widest text-primary mb-4">
                    // RAM freed
                  </div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="font-mono text-5xl font-extrabold tracking-tight text-foreground leading-none">2.4</span>
                    <span className="font-mono text-xl font-bold text-muted-foreground mb-0.5">GB</span>
                  </div>
                  <div className="font-mono text-[9px] text-muted-foreground mb-5">14 of 17 tabs suspended</div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-mono text-[8px] text-muted-foreground/50">before</span>
                        <span className="font-mono text-[8px] text-muted-foreground/50">82%</span>
                      </div>
                      <div className="h-1 bg-border rounded-full overflow-hidden">
                        <div className="h-full w-[82%] bg-muted-foreground/30 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-mono text-[8px] text-primary/70">after</span>
                        <span className="font-mono text-[8px] text-primary/70">26%</span>
                      </div>
                      <div className="h-1 bg-border rounded-full overflow-hidden">
                        <div className="h-full w-[26%] bg-primary rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
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

      {/* Dual showcase */}
      <section id="extensions" className="scroll-mt-24 max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-2 lg:[grid-template-rows:repeat(6,auto)] gap-x-px bg-border border border-border">
          <ProductCard
            name={t("tgd.name")}
            description={t("tgd.description")}
            features={tgdFeatures}
            preview={
              <img
                src={tgdMascotte}
                alt="The Great-er Tab Discarder mascot"
                className="w-full h-full object-cover"
              />
            }
            storeUrl={TGD_STORE_URL}
            edgeUrl={TGD_EDGE_URL}
            sourceUrl={`https://github.com/${TGD_REPO.owner}/${TGD_REPO.repo}`}
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
              <img
                src={tmsMascotte}
                alt="The Marvellous Suspender mascot"
                className="w-full h-full object-cover"
              />
            }
            storeUrl={TMS_STORE_URL}
            sourceUrl={`https://github.com/${TMS_REPO.owner}/${TMS_REPO.repo}`}
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

      {/* Footer */}
      <footer className="border-t border-border bg-card py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Marvellous Codeworks" className="h-4 w-auto" />
              <span className="font-mono text-xs font-bold tracking-tighter uppercase">
                Marvellous Codeworks
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono max-w-xs leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <FooterCol
              title={t("footer.col.extensions")}
              links={[
                { label: t("footer.link.tgd"), href: "#extensions" },
                { label: t("footer.link.tms"), href: "#extensions" },
              ]}
            />
            <FooterCol
              title={t("footer.col.resources")}
              links={[
                { label: t("footer.link.docs"), href: DOCS_URL },
                { label: t("footer.link.blog"), href: BLOG_URL },
              ]}
            />
            <FooterCol
              title={t("footer.col.community")}
              links={[
                { label: t("footer.link.github"), href: GITHUB_URL },
                { label: t("footer.link.issues.tgd"), href: TGD_ISSUES_URL },
                { label: t("footer.link.issues.tms"), href: TMS_ISSUES_URL },
              ]}
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 border-t border-border pt-8 space-y-4">
          <span className="font-mono text-[10px] text-muted-foreground uppercase">
            © {new Date().getFullYear()} Marvellous Codeworks
          </span>
          <p className="font-mono text-[10px] text-muted-foreground/60 leading-relaxed max-w-4xl">
            {t("footer.copyright")}
          </p>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="space-y-4">
      <h4 className="font-mono text-[10px] uppercase tracking-widest text-foreground">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
