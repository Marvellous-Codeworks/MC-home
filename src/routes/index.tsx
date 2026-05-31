import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { TgdPreview, TmsPreview } from "@/components/ProductPreviews";

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

const DOCS_URL = "https://www.marvellouscode.works/docs/intro";
const GITHUB_URL = "https://github.com/Marvellous-Codeworks";

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="size-5 bg-primary rounded-sm" aria-hidden />
            <span className="font-mono text-xs font-bold tracking-tighter uppercase">
              Marvellous Codeworks
            </span>
          </a>
          <div className="flex items-center gap-6">
            <a
              href="#extensions"
              className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
            >
              Extensions
            </a>
            <a
              href={DOCS_URL}
              className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
            >
              Docs
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative pt-24 pb-16 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="animate-reveal [animation-delay:100ms]">
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded border border-primary/20 bg-primary/5 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
                High Efficiency Engine — Manifest V3 Ready
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-mono font-extrabold tracking-tight text-balance leading-[0.9] max-w-4xl">
              RECLAIM YOUR <span className="text-primary">BROWSER</span> MEMORY.
            </h1>
            <p className="mt-8 text-xl text-muted-foreground max-w-[50ch] text-pretty">
              Precision tools for the professional web. Marvellous Codeworks builds open-source
              Chromium extensions that turn memory-hungry browsers into lean execution
              environments.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#extensions"
                className="h-11 px-6 bg-primary text-primary-foreground font-mono font-bold text-xs uppercase tracking-widest inline-flex items-center justify-center hover:bg-foreground transition-colors rounded-sm"
              >
                View Extensions
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="h-11 px-6 border border-border font-mono font-bold text-xs uppercase tracking-widest inline-flex items-center justify-center hover:bg-white/5 transition-colors rounded-sm"
              >
                GitHub Org
              </a>
            </div>
          </div>
        </div>

        {/* Background grid */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0d_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0d_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
        />
      </header>

      {/* Dual showcase */}
      <section id="extensions" className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-2 gap-px bg-border border border-border">
          <ProductCard
            index="01"
            code="TGD_02.X"
            name="The Great-er Tab Discarder"
            description="Leverages the native Chromium discarding engine to freeze inactive tabs, releasing nearly 100% of their RAM while keeping them visible in your tab bar."
            features={[
              {
                title: "Native Engine.",
                body: "Zero performance overhead by using the browser's internal hibernation APIs.",
              },
              {
                title: "Force Purge.",
                body: "Instantly discard all background tabs with a single hotkey.",
              },
              {
                title: "Smart Context.",
                body: "Whitelist audio-playing tabs, forms, or pinned tabs automatically.",
              },
            ]}
            preview={<TgdPreview />}
            storeUrl="https://chromewebstore.google.com/"
            sourceUrl="https://github.com/Marvellous-Codeworks"
            delay={200}
          />
          <ProductCard
            index="02"
            code="TMS_01.X"
            name="The Marvellous Suspender"
            description="The spiritual successor to modern tab suspension. Replaces inactive tabs with a lightweight hibernation page, giving you granular control over when they wake."
            features={[
              {
                title: "Granular Hibernation.",
                body: "Choose how tabs look when suspended: screenshot, blurred, or text-only.",
              },
              {
                title: "Session Recovery.",
                body: "Recover all suspended tabs even after a browser crash or restart.",
              },
              {
                title: "Power Mode.",
                body: "Automatically suspends tabs when battery drops below a threshold.",
              },
            ]}
            preview={<TmsPreview />}
            storeUrl="https://chromewebstore.google.com/"
            sourceUrl="https://github.com/Marvellous-Codeworks"
            delay={300}
          />
        </div>
      </section>

      {/* Trust signals */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-border">
        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              n: "01",
              t: "Performance",
              b: "Built for systems with 4GB to 128GB of RAM. We focus on reducing CPU wakeups and memory pressure to extend battery life and keep your machine cool.",
            },
            {
              n: "02",
              t: "Privacy",
              b: "Zero tracking. Zero analytics. Your browsing data never leaves your machine. Both extensions are fully open source for community auditing.",
            },
            {
              n: "03",
              t: "Open Source",
              b: "Maintained by Marvellous Codeworks and a global community of developers. Fork it, improve it, or contribute under a permissive open-source license.",
            },
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
      <footer className="border-t border-border bg-black py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="size-4 bg-foreground" aria-hidden />
              <span className="font-mono text-xs font-bold tracking-tighter uppercase">
                Marvellous Codeworks
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono max-w-xs leading-relaxed">
              A precision software studio shipping reliable tools for the modern web environment.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <FooterCol
              title="Extensions"
              links={[
                { label: "TGD Tab Discarder", href: "#extensions" },
                { label: "TMS Suspender", href: "#extensions" },
              ]}
            />
            <FooterCol
              title="Resources"
              links={[
                { label: "Documentation", href: DOCS_URL },
                { label: "Changelog", href: "https://www.marvellouscode.works/blog" },
              ]}
            />
            <FooterCol
              title="Community"
              links={[
                { label: "GitHub", href: GITHUB_URL },
                { label: "Issue Tracker", href: `${GITHUB_URL}` },
              ]}
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 flex justify-between items-center border-t border-white/5 pt-8">
          <span className="font-mono text-[10px] text-muted-foreground uppercase">
            © {new Date().getFullYear()} Marvellous Codeworks
          </span>
          <span className="font-mono text-[10px] text-muted-foreground uppercase">
            System Status: Optimal
          </span>
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
