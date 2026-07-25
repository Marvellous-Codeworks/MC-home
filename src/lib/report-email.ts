export interface ConfirmationEmailInput {
  to: string;
  confirmUrl: string;
  locale: "en" | "it";
  title: string;
}

export interface ReportCreatedEmailInput {
  to: string;
  statusUrl: string;
  locale: "en" | "it";
  title: string;
}

const SUBJECT: Record<"en" | "it", string> = {
  en: "Confirm your report — Marvellous Codeworks",
  it: "Conferma la tua segnalazione — Marvellous Codeworks",
};

const BODY: Record<"en" | "it", (confirmUrl: string, title: string) => string> = {
  en: (confirmUrl, title) =>
    `<p>Thanks for reporting "<strong>${escapeHtml(title)}</strong>".</p>` +
    `<p>Click the link below to confirm and open the report on GitHub for you:</p>` +
    `<p><a href="${confirmUrl}">${confirmUrl}</a></p>` +
    `<p>This link expires in 1 hour.</p>`,
  it: (confirmUrl, title) =>
    `<p>Grazie per aver segnalato "<strong>${escapeHtml(title)}</strong>".</p>` +
    `<p>Clicca il link qui sotto per confermare e aprire la segnalazione su GitHub per te:</p>` +
    `<p><a href="${confirmUrl}">${confirmUrl}</a></p>` +
    `<p>Questo link scade tra 1 ora.</p>`,
};

const CREATED_SUBJECT: Record<"en" | "it", string> = {
  en: "Your report is live — Marvellous Codeworks",
  it: "La tua segnalazione è online — Marvellous Codeworks",
};

const CREATED_BODY: Record<"en" | "it", (statusUrl: string, title: string) => string> = {
  en: (statusUrl, title) =>
    `<p>Your report "<strong>${escapeHtml(title)}</strong>" is now open.</p>` +
    `<p>Bookmark this link to follow its progress and reply to it any time — it doesn't expire:</p>` +
    `<p><a href="${statusUrl}">${statusUrl}</a></p>`,
  it: (statusUrl, title) =>
    `<p>La tua segnalazione "<strong>${escapeHtml(title)}</strong>" è ora aperta.</p>` +
    `<p>Salva questo link per seguirne l'andamento e rispondere quando vuoi — non scade:</p>` +
    `<p><a href="${statusUrl}">${statusUrl}</a></p>`,
};

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Marvellous Codeworks <reports@marvellouscode.works>",
      to: [to],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend send failed: ${res.status}`);
  }
}

export async function sendConfirmationEmail(input: ConfirmationEmailInput): Promise<void> {
  await sendEmail(
    input.to,
    SUBJECT[input.locale],
    BODY[input.locale](input.confirmUrl, input.title),
  );
}

export async function sendReportCreatedEmail(input: ReportCreatedEmailInput): Promise<void> {
  await sendEmail(
    input.to,
    CREATED_SUBJECT[input.locale],
    CREATED_BODY[input.locale](input.statusUrl, input.title),
  );
}
