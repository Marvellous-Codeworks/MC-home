import { createServerFn } from "@tanstack/react-start";
import { signPendingReport } from "@/lib/report-token";
import { sendConfirmationEmail } from "@/lib/report-email";

export interface SubmitReportInput {
  email: string;
  title: string;
  body: string;
  type: "bug" | "feature";
  owner: string;
  repo: string;
  locale: "en" | "it";
  honeypot: string;
  formLoadedAt: number;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Anything faster than this since the form rendered is assumed to be a bot,
// not a human filling out four fields.
const MIN_ELAPSED_MS = 3000;

export const submitReport = createServerFn({ method: "POST" })
  .inputValidator((data: SubmitReportInput) => {
    if (!EMAIL_RE.test(data.email)) throw new Error("Invalid email");
    if (data.title.trim().length < 5 || data.title.length > 200) {
      throw new Error("Invalid title");
    }
    if (data.body.trim().length < 10 || data.body.length > 5000) {
      throw new Error("Invalid body");
    }
    if (data.type !== "bug" && data.type !== "feature") {
      throw new Error("Invalid type");
    }
    if (typeof data.formLoadedAt !== "number") {
      throw new Error("Invalid request");
    }
    return data;
  })
  .handler(async ({ data }): Promise<{ ok: true }> => {
    // Spam heuristics: a filled honeypot or an implausibly fast submission.
    // Report success without doing any work (no token, no Resend send) so
    // bots see no signal to distinguish this from a real submission.
    const elapsedMs = Date.now() - data.formLoadedAt;
    if (data.honeypot.trim().length > 0 || elapsedMs < MIN_ELAPSED_MS) {
      return { ok: true };
    }

    const secret = process.env.REPORT_TOKEN_SECRET;
    if (!secret) throw new Error("REPORT_TOKEN_SECRET is not configured");

    const siteUrl = process.env.SITE_URL;
    if (!siteUrl) throw new Error("SITE_URL is not configured");

    const token = signPendingReport(
      {
        email: data.email,
        title: data.title.trim(),
        body: data.body.trim(),
        type: data.type,
        owner: data.owner,
        repo: data.repo,
        locale: data.locale,
      },
      secret,
    );
    const confirmUrl = `${siteUrl}/api/report/confirm?ct=${encodeURIComponent(token)}`;

    await sendConfirmationEmail({
      to: data.email,
      confirmUrl,
      locale: data.locale,
      title: data.title.trim(),
    });

    return { ok: true };
  });
