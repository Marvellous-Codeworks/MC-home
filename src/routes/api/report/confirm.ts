import { createFileRoute } from "@tanstack/react-router";
import { verifyPendingReport } from "@/lib/report-token";
import { createReportIssue } from "@/lib/report-github";

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

        try {
          const issue = await createReportIssue({
            owner: pending.owner,
            repo: pending.repo,
            title: pending.title,
            body: pending.body,
            type: pending.type,
            reporterEmail: pending.email,
          });
          return Response.redirect(
            new URL(`/tms/report/status/${issue.number}`, url.origin).toString(),
            302,
          );
        } catch {
          return Response.redirect(
            new URL("/tms/report?error=github", url.origin).toString(),
            302,
          );
        }
      },
    },
  },
});
