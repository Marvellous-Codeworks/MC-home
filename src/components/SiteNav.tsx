import { NotificationBell } from "@/components/NotificationBell";
import { LanguageToggle, ThemeToggle } from "@/components/Toggles";
import { useI18n } from "@/lib/i18n";
import logo from "@/assets/marvellous-logo-opt.webp";

const DOCS_URL = "https://kb.marvellouscode.works/";
const BLOG_URL = "https://kb.marvellouscode.works/blog";
const GITHUB_URL = "https://github.com/Marvellous-Codeworks";

interface SiteNavProps {
  /** href for the Extensions link. Use "#extensions" on homepage, "/#extensions" elsewhere. */
  extensionsHref?: string;
}

export function SiteNav({ extensionsHref = "/#extensions" }: SiteNavProps) {
  const { t } = useI18n();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-3 min-w-0">
          <img src={logo} alt="Marvellous Codeworks" className="h-7 w-auto" />
          <span className="font-mono text-sm font-bold tracking-tighter uppercase truncate">
            Marvellous Codeworks
          </span>
        </a>
        <div className="flex items-center gap-5 sm:gap-8">
          <a
            href={extensionsHref}
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
            href={BLOG_URL}
            className="hidden sm:inline text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            {t("nav.blog")}
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            {t("nav.github")}
          </a>
          <NotificationBell />
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
