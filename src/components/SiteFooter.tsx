import { useI18n } from "@/lib/i18n";
import logo from "@/assets/marvellous-logo-opt.webp";

const DOCS_URL = "https://kb.marvellouscode.works/";
const BLOG_URL = "https://kb.marvellouscode.works/blog";
const BLOG_RSS_URL = "https://kb.marvellouscode.works/blog/rss.xml";
const GITHUB_URL = "https://github.com/Marvellous-Codeworks";
const TGD_ISSUES_URL = "https://github.com/rkodey/the-great-er-discarder-er/issues";
const TMS_ISSUES_URL = "https://github.com/gioxx/MarvellousSuspender/issues";
const TMS_DISCUSSIONS_URL = "https://github.com/gioxx/MarvellousSuspender/discussions";

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div className="space-y-4">
      <h4 className="font-mono text-[10px] uppercase tracking-widest text-foreground">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
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

export function SiteFooter() {
  const { t } = useI18n();

  return (
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
              { label: t("footer.link.tgd"), href: "/tgd" },
              { label: t("footer.link.tms"), href: "/tms" },
            ]}
          />
          <FooterCol
            title={t("footer.col.resources")}
            links={[
              { label: t("footer.link.docs"), href: DOCS_URL, external: true },
              { label: t("footer.link.blog"), href: BLOG_URL, external: true },
              { label: t("footer.link.rss"), href: BLOG_RSS_URL, external: true },
            ]}
          />
          <FooterCol
            title={t("footer.col.community")}
            links={[
              { label: t("footer.link.github"), href: GITHUB_URL, external: true },
              { label: t("footer.link.issues.tgd"), href: TGD_ISSUES_URL, external: true },
              { label: t("footer.link.issues.tms"), href: TMS_ISSUES_URL, external: true },
              { label: t("footer.link.discussions.tms"), href: TMS_DISCUSSIONS_URL, external: true },
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
  );
}
