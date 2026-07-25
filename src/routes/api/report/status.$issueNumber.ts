import { createFileRoute } from "@tanstack/react-router";
import { getIssueWithComments } from "@/lib/report-github";
import { verifyReporterToken } from "@/lib/report-token";
import { TMS_REPO } from "@/lib/tms-repo";

export const Route = createFileRoute("/api/report/status/$issueNumber")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const issueNumber = Number(params.issueNumber);
        if (!Number.isInteger(issueNumber) || issueNumber <= 0) {
          return new Response("Invalid issue number", { status: 400 });
        }

        const secret = process.env.REPORT_TOKEN_SECRET;
        const url = new URL(request.url);
        const rt = url.searchParams.get("rt");
        const reporterToken = rt && secret ? verifyReporterToken(rt, secret) : null;
        const tokenMatches =
          reporterToken !== null &&
          reporterToken.owner === TMS_REPO.owner &&
          reporterToken.repo === TMS_REPO.repo &&
          reporterToken.issueNumber === issueNumber;

        // Same 404 whether the token is missing/invalid or the issue itself
        // doesn't exist — don't give a guesser any signal either way.
        if (!tokenMatches) {
          return new Response("Not found", { status: 404 });
        }

        const result = await getIssueWithComments(TMS_REPO.owner, TMS_REPO.repo, issueNumber);
        if (!result || !result.issue.hasReportLabel) {
          return new Response("Not found", { status: 404 });
        }

        return new Response(JSON.stringify(result), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=30, stale-while-revalidate=300",
          },
        });
      },
    },
  },
});
