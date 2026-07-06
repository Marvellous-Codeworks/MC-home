import { createServerFn } from "@tanstack/react-start";
import {
  getIssueWithComments,
  addReportComment as addReportCommentOnGithub,
  isWithinCommentWindow,
} from "@/lib/report-github";
import { verifyReporterToken } from "@/lib/report-token";

export interface PostReportCommentInput {
  owner: string;
  repo: string;
  issueNumber: number;
  body: string;
  reporterToken: string;
}

export const postReportComment = createServerFn({ method: "POST" })
  .inputValidator((data: PostReportCommentInput) => {
    if (data.body.trim().length < 1 || data.body.length > 3000) {
      throw new Error("Invalid comment body");
    }
    if (!Number.isInteger(data.issueNumber) || data.issueNumber <= 0) {
      throw new Error("Invalid issue number");
    }
    return data;
  })
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const secret = process.env.REPORT_TOKEN_SECRET;
    if (!secret) throw new Error("REPORT_TOKEN_SECRET is not configured");

    // Only whoever holds the signed link for this exact report may comment
    // on it — knowing/guessing the issue number alone isn't enough.
    const reporterToken = verifyReporterToken(data.reporterToken, secret);
    if (
      !reporterToken ||
      reporterToken.owner !== data.owner ||
      reporterToken.repo !== data.repo ||
      reporterToken.issueNumber !== data.issueNumber
    ) {
      throw new Error("Not authorized for this report");
    }

    const result = await getIssueWithComments(
      data.owner,
      data.repo,
      data.issueNumber,
    );
    if (!result || !result.issue.hasReportLabel) {
      throw new Error("Not a report issue");
    }
    if (!isWithinCommentWindow(result.issue)) {
      throw new Error("Comment window closed");
    }
    await addReportCommentOnGithub(
      data.owner,
      data.repo,
      data.issueNumber,
      data.body.trim(),
    );
    return { ok: true };
  });
