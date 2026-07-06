const REPORT_LABEL = "via-site-report";

const HEADERS: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "User-Agent": "marvellous-codeworks-site",
  "X-GitHub-Api-Version": "2022-11-28",
};

// Issue/comment reads use this instead of the plain HEADERS above so the
// response includes GitHub's own server-rendered, sanitized `body_html` —
// letting us show formatted comments (images, bold, etc.) without pulling in
// a markdown-rendering dependency.
const READ_HEADERS: Record<string, string> = {
  ...HEADERS,
  Accept: "application/vnd.github.full+json",
};

function authHeaders(): Record<string, string> {
  const token = process.env.GITHUB_ISSUES_TOKEN;
  if (!token) {
    throw new Error("GITHUB_ISSUES_TOKEN is not configured");
  }
  return { ...HEADERS, Authorization: `Bearer ${token}` };
}

function authReadHeaders(): Record<string, string> {
  const token = process.env.GITHUB_ISSUES_TOKEN;
  if (!token) {
    throw new Error("GITHUB_ISSUES_TOKEN is not configured");
  }
  return { ...READ_HEADERS, Authorization: `Bearer ${token}` };
}

export interface CreateIssueInput {
  owner: string;
  repo: string;
  title: string;
  body: string;
  type: "bug" | "feature";
  reporterEmail: string;
}

export interface IssueSummary {
  number: number;
  title: string;
  state: "open" | "closed";
  closedAt: string | null;
  htmlUrl: string;
  hasReportLabel: boolean;
}

export interface IssueComment {
  id: number;
  body: string;
  bodyHtml: string;
  createdAt: string;
  authorLogin: string;
}

export async function createReportIssue(
  input: CreateIssueInput,
): Promise<IssueSummary> {
  const typeLabel = input.type === "bug" ? "bug" : "enhancement";
  const body =
    `${input.body}\n\n---\n_Reported via the site form. Reporter email withheld from this public issue._`;

  const res = await fetch(
    `https://api.github.com/repos/${input.owner}/${input.repo}/issues`,
    {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        title: input.title,
        body,
        labels: [REPORT_LABEL, typeLabel],
      }),
    },
  );
  if (!res.ok) {
    throw new Error(`GitHub create issue failed: ${res.status}`);
  }
  const issue = (await res.json()) as {
    number: number;
    title: string;
    state: string;
    closed_at: string | null;
    html_url: string;
    labels: Array<{ name: string } | string>;
  };
  return toIssueSummary(issue);
}

export async function addReportComment(
  owner: string,
  repo: string,
  issueNumber: number,
  body: string,
): Promise<void> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
    {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ body: `**[User]:** ${body}` }),
    },
  );
  if (!res.ok) {
    throw new Error(`GitHub add comment failed: ${res.status}`);
  }
}

export async function getIssueWithComments(
  owner: string,
  repo: string,
  issueNumber: number,
): Promise<{ issue: IssueSummary; comments: IssueComment[] } | null> {
  const [issueRes, commentsRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`, {
      headers: authReadHeaders(),
    }),
    fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
      { headers: authReadHeaders() },
    ),
  ]);
  if (issueRes.status === 404) return null;
  if (!issueRes.ok) {
    throw new Error(`GitHub get issue failed: ${issueRes.status}`);
  }
  const issue = (await issueRes.json()) as {
    number: number;
    title: string;
    state: string;
    closed_at: string | null;
    html_url: string;
    labels: Array<{ name: string } | string>;
  };
  let comments: IssueComment[] = [];
  if (commentsRes.ok) {
    const raw = (await commentsRes.json()) as Array<{
      id: number;
      body: string;
      body_html?: string;
      created_at: string;
      user: { login: string } | null;
    }>;
    comments = raw.map((c) => ({
      id: c.id,
      body: c.body,
      bodyHtml: sanitizeGithubHtml(
        c.body_html ?? escapeHtml(c.body).replace(/\n/g, "<br />"),
      ),
      createdAt: c.created_at,
      authorLogin: c.user?.login ?? "unknown",
    }));
  }
  return { issue: toIssueSummary(issue), comments };
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Defense-in-depth on top of GitHub's own sanitized `body_html`: this is not
// a full HTML sanitizer (no dependency for that is available in this repo),
// just a second layer that strips the specific constructs that would matter
// for XSS if GitHub's sanitization were ever bypassed or buggy.
function sanitizeGithubHtml(html: string): string {
  return html
    .replace(/<\/?(script|iframe|object|embed|form|style|link|meta)\b[^>]*>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1=$2#$2');
}

function toIssueSummary(issue: {
  number: number;
  title: string;
  state: string;
  closed_at: string | null;
  html_url: string;
  labels: Array<{ name: string } | string>;
}): IssueSummary {
  const hasReportLabel = issue.labels.some((l) =>
    typeof l === "string" ? l === REPORT_LABEL : l.name === REPORT_LABEL,
  );
  return {
    number: issue.number,
    title: issue.title,
    state: issue.state === "closed" ? "closed" : "open",
    closedAt: issue.closed_at,
    htmlUrl: issue.html_url,
    hasReportLabel,
  };
}

export function isWithinCommentWindow(issue: IssueSummary): boolean {
  if (issue.state === "open") return true;
  if (!issue.closedAt) return false;
  const closedAtMs = new Date(issue.closedAt).getTime();
  const fifteenDaysMs = 15 * 24 * 60 * 60 * 1000;
  return Date.now() - closedAtMs < fifteenDaysMs;
}

export { REPORT_LABEL };
