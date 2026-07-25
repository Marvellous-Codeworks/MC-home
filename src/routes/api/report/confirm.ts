import { createFileRoute } from "@tanstack/react-router";
import { verifyPendingReport, signReporterToken } from "@/lib/report-token";
import { createReportIssue } from "@/lib/report-github";
import { sendReportCreatedEmail } from "@/lib/report-email";

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const STRINGS = {
  en: {
    title: "Confirm your report",
    body: (reportTitle: string) =>
      `Click the button to confirm "${escapeHtml(reportTitle)}" and open the Issue on GitHub for you.`,
    button: "Confirm report",
  },
  it: {
    title: "Conferma la tua segnalazione",
    body: (reportTitle: string) =>
      `Clicca il pulsante per confermare "${escapeHtml(reportTitle)}" e aprire la Issue su GitHub per te.`,
    button: "Conferma segnalazione",
  },
} as const;

function confirmPageHtml(locale: "en" | "it", reportTitle: string, ct: string): string {
  const s = STRINGS[locale];
  return `<!doctype html>
<html lang="${locale}">
<head><meta charset="utf-8"><title>${s.title}</title></head>
<body style="font-family: sans-serif; max-width: 32rem; margin: 4rem auto; padding: 0 1rem;">
  <h1>${s.title}</h1>
  <p>${s.body(reportTitle)}</p>
  <form method="POST">
    <input type="hidden" name="ct" value="${escapeHtml(ct)}" />
    <button type="submit" style="height: 2.75rem; padding: 0 1.5rem; font-weight: bold;">${s.button}</button>
  </form>
</body>
</html>`;
}

export const Route = createFileRoute("/api/report/confirm")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const ct = url.searchParams.get("ct");
        const secret = process.env.REPORT_TOKEN_SECRET;

        if (!ct || !secret) {
          return new Response("Missing token", { status: 400 });
        }

        const pending = verifyPendingReport(ct, secret);
        if (!pending) {
          return Response.redirect(
            new URL("/tms/report?error=expired", url.origin).toString(),
            302,
          );
        }

        return new Response(confirmPageHtml(pending.locale, pending.title, ct), {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      },
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const secret = process.env.REPORT_TOKEN_SECRET;
        const formData = await request.formData();
        const ct = formData.get("ct");

        if (typeof ct !== "string" || !secret) {
          return new Response("Missing token", { status: 400 });
        }

        const pending = verifyPendingReport(ct, secret);
        if (!pending) {
          return Response.redirect(
            new URL("/tms/report?error=expired", url.origin).toString(),
            302,
          );
        }

        try {
          const issue = await createReportIssue({
            owner: pending.owner,
            repo: pending.repo,
            title: pending.title,
            body: pending.body,
            type: pending.type,
            reporterEmail: pending.email,
          });
          const reporterToken = signReporterToken(
            { owner: pending.owner, repo: pending.repo, issueNumber: issue.number },
            secret,
          );
          const statusUrl = new URL(
            `/tms/report/status/${issue.number}?rt=${encodeURIComponent(reporterToken)}`,
            url.origin,
          ).toString();

          try {
            await sendReportCreatedEmail({
              to: pending.email,
              statusUrl,
              locale: pending.locale,
              title: pending.title,
            });
          } catch {
            // Best-effort: the user is already being redirected to the status
            // page, so a failed follow-up email shouldn't block that.
          }

          return Response.redirect(statusUrl, 302);
        } catch {
          return Response.redirect(new URL("/tms/report?error=github", url.origin).toString(), 302);
        }
      },
    },
  },
});
