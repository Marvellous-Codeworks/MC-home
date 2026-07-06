import { useState } from "react";
import { createFileRoute, useParams, useSearch } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/lib/i18n";
import { postReportComment } from "@/lib/report-comment.functions";
import { TMS_REPO } from "@/lib/tms-repo";
import type { IssueComment, IssueSummary } from "@/lib/report-github";
const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

export const Route = createFileRoute("/tms_/report_/status/$issueNumber")({
  validateSearch: (search: Record<string, unknown>) => ({
    rt: typeof search.rt === "string" ? search.rt : undefined,
  }),
  component: TmsReportStatusPage,
});

function isWithinWindow(issue: IssueSummary): boolean {
  if (issue.state === "open") return true;
  if (!issue.closedAt) return false;
  return Date.now() - new Date(issue.closedAt).getTime() < FIFTEEN_DAYS_MS;
}

function TmsReportStatusPage() {
  const { t } = useI18n();
  const { issueNumber } = useParams({
    from: "/tms_/report_/status/$issueNumber",
  });
  const { rt } = useSearch({ from: "/tms_/report_/status/$issueNumber" });
  const queryClient = useQueryClient();
  const postComment = useServerFn(postReportComment);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(false);

  const query = useQuery({
    queryKey: ["report-status", issueNumber, rt],
    queryFn: async () => {
      const url = rt
        ? `/api/report/status/${issueNumber}?rt=${encodeURIComponent(rt)}`
        : `/api/report/status/${issueNumber}`;
      const res = await fetch(url);
      if (!res.ok) {
        const error = new Error(`Status fetch failed: ${res.status}`) as Error & {
          status: number;
        };
        error.status = res.status;
        throw error;
      }
      return (await res.json()) as {
        issue: IssueSummary;
        comments: IssueComment[];
      };
    },
    staleTime: 1000 * 30,
    retry: (failureCount, error) => {
      const status = (error as Error & { status?: number }).status;
      // A 4xx (not found / bad request) won't change on retry — fail fast
      // instead of leaving the user staring at a loading state.
      if (status !== undefined && status >= 400 && status < 500) return false;
      return failureCount < 2;
    },
  });

  async function submitComment() {
    setPosting(true);
    setError(false);
    try {
      await postComment({
        data: {
          owner: TMS_REPO.owner,
          repo: TMS_REPO.repo,
          issueNumber: Number(issueNumber),
          body: draft,
          reporterToken: rt ?? "",
        },
      });
      setDraft("");
      await queryClient.invalidateQueries({
        queryKey: ["report-status", issueNumber],
      });
    } catch {
      setError(true);
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        {query.isLoading && (
          <p className="text-sm text-muted-foreground">…</p>
        )}
        {query.isError && !query.data && (
          <p className="text-sm text-destructive">{t("report.status.error")}</p>
        )}
        {query.data && (
          <>
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
                {query.data.issue.state === "open"
                  ? t("report.status.badge.open")
                  : t("report.status.badge.closed")}
              </span>
              <h1 className="text-2xl font-mono font-bold">
                {query.data.issue.title}
              </h1>
              <a
                href={query.data.issue.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="h-10 px-5 border border-border font-mono text-xs uppercase tracking-widest inline-flex items-center justify-center hover:bg-accent transition-colors rounded-sm"
              >
                {t("report.status.viewOnGithub")}
              </a>
            </div>

            <div className="space-y-4">
              <h2 className="font-mono text-sm font-bold uppercase tracking-widest">
                {t("report.status.comments.heading")}
              </h2>
              {query.data.comments.map((c) => (
                <div key={c.id} className="border border-border p-4 text-sm">
                  <div
                    className="[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-sm [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0"
                    dangerouslySetInnerHTML={{ __html: c.bodyHtml }}
                  />
                </div>
              ))}
            </div>

            {isWithinWindow(query.data.issue) ? (
              <div className="space-y-3">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={t("report.status.comment.placeholder")}
                  rows={4}
                  className="w-full border border-border bg-background px-3 py-2 text-sm"
                />
                {error && (
                  <p className="text-sm text-destructive">
                    {t("report.status.comment.error")}
                  </p>
                )}
                <button
                  onClick={submitComment}
                  disabled={posting || draft.trim().length === 0}
                  className="h-11 px-6 bg-primary text-primary-foreground font-mono font-bold text-xs uppercase tracking-widest hover:bg-foreground transition-colors rounded-sm disabled:opacity-50"
                >
                  {posting
                    ? t("report.status.comment.submitting")
                    : t("report.status.comment.submit")}
                </button>
              </div>
            ) : (
              <div className="border border-border p-6 space-y-2">
                <p className="font-mono text-sm font-bold">
                  {t("report.status.readonly.title")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("report.status.readonly.body")}
                </p>
                <a
                  href="/tms/report"
                  className="inline-block font-mono text-[10px] uppercase tracking-widest text-primary hover:underline"
                >
                  {t("report.status.readonly.cta")}
                </a>
              </div>
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
