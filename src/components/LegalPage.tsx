import { useI18n } from "@/lib/i18n";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { type LegalContent } from "@/lib/tms-legal-content";

export function LegalPage({
  content,
}: {
  content: LegalContent;
}) {
  const { locale } = useI18n();
  const doc = content[locale] ?? content.en;

  const effectiveDate = new Date(doc.effectiveDate).toLocaleDateString(
    locale === "it" ? "it-IT" : "en-GB",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <SiteNav />

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-12">
        <a
          href="/tms"
          className="inline-block font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
        >
          ← The Marvellous Suspender
        </a>

        <div className="space-y-3 border-b border-border pb-8">
          <div className="inline-flex items-center gap-2 px-2 py-1 border border-primary/20 bg-primary/5">
            <span className="font-mono text-[9px] uppercase tracking-widest text-primary">
              The Marvellous Suspender · Legal
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-mono font-extrabold tracking-tight">
            {doc.title}
          </h1>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            {locale === "it" ? "Efficace dal" : "Effective"} {effectiveDate}
          </p>
        </div>

        <div className="space-y-10">
          {doc.sections.map((section, i) => (
            <section key={i} className="space-y-3">
              <h2 className="font-mono text-sm font-bold text-primary uppercase tracking-widest">
                {String(i + 1).padStart(2, "0")} // {section.heading}
              </h2>
              <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                {section.body.map((line, j) =>
                  line.startsWith("•") ? (
                    <p key={j} className="pl-4 border-l border-border">
                      {line.slice(1).trim()}
                    </p>
                  ) : (
                    <p key={j}>{line}</p>
                  )
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="border-t border-border pt-8">
          <p className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest">
            {locale === "it"
              ? `Ultimo aggiornamento: ${effectiveDate} · Giovanni Solone ("Marvellous Codeworks")`
              : `Last updated: ${effectiveDate} · Giovanni Solone ("Marvellous Codeworks")`}
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
