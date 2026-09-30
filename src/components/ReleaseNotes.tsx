import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { useI18n } from "@/lib/i18n";

// Release notes come from GitHub (GitHub-flavored Markdown). react-markdown
// doesn't render raw HTML by default, so the body is safe to display as-is.
const MARKDOWN_COMPONENTS: Components = {
  h1: ({ children }) => (
    <h3 className="font-mono text-sm font-bold text-foreground mt-8 mb-3">{children}</h3>
  ),
  h2: ({ children }) => (
    <h3 className="font-mono text-sm font-bold text-foreground mt-8 mb-3">{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className="font-mono text-xs font-bold text-foreground mt-6 mb-2">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-sm text-muted-foreground leading-relaxed my-3">{children}</p>
  ),
  ul: ({ children }) => <ul className="list-disc pl-5 space-y-2 my-3">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 space-y-2 my-3">{children}</ol>,
  li: ({ children }) => (
    <li className="text-sm text-muted-foreground leading-relaxed">{children}</li>
  ),
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-primary hover:underline break-words"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="font-mono text-[0.8em] bg-muted px-1 py-0.5 rounded-sm text-foreground">
      {children}
    </code>
  ),
};

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function ReleaseNotes({
  version,
  body,
  publishedAt,
  url,
}: {
  version: string;
  body: string;
  publishedAt: string | null;
  url: string | null;
}) {
  const { t } = useI18n();

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 mb-6">
        <h2 className="font-mono text-sm font-bold text-primary uppercase tracking-widest">
          {t("product.changelog", { version })}
        </h2>
        <div className="flex items-baseline gap-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {publishedAt && (
            <span>{t("product.changelog.released", { date: formatDate(publishedAt) })}</span>
          )}
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors"
            >
              {t("product.changelog.github")} →
            </a>
          )}
        </div>
      </div>
      <div className="border border-border p-8 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
          {body}
        </ReactMarkdown>
      </div>
    </div>
  );
}
