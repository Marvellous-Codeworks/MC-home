import { createFileRoute } from "@tanstack/react-router";
import { getIssueWithComments } from "@/lib/report-github";

const TMS_REPO = { owner: "gioxx", repo: "MarvellousSuspender" } as const;

export const Route = createFileRoute("/api/report/status/$issueNumber")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const issueNumber = Number(params.issueNumber);
        if (!Number.isInteger(issueNumber) || issueNumber <= 0) {
          return new Response("Invalid issue number", { status: 400 });
        }

        const result = await getIssueWithComments(
          TMS_REPO.owner,
          TMS_REPO.repo,
          issueNumber,
        );
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
