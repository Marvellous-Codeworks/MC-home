import { createFileRoute, useSearch } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ReportForm } from "@/components/ReportForm";
import { useI18n } from "@/lib/i18n";
import { TMS_REPO } from "@/lib/tms-repo";

export const Route = createFileRoute("/tms_/report")({
  validateSearch: (search: Record<string, unknown>) => ({
    error: typeof search.error === "string" ? search.error : undefined,
  }),
  component: TmsReportPage,
});

function TmsReportPage() {
  const { t } = useI18n();
  const { error } = useSearch({ from: "/tms_/report" });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-mono font-extrabold tracking-tight">
            {t("report.form.heading")}
          </h1>
          <p className="text-muted-foreground">{t("report.form.intro")}</p>
        </div>
        {error === "expired" && (
          <p className="text-sm text-destructive">{t("report.confirm.error.body")}</p>
        )}
        {error === "github" && (
          <p className="text-sm text-destructive">{t("report.confirm.error.github")}</p>
        )}
        <ReportForm repo={TMS_REPO} productKey="tms" />
      </main>
      <SiteFooter />
    </div>
  );
}
