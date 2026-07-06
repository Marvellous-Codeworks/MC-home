export interface ConfirmationEmailInput {
  to: string;
  confirmUrl: string;
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

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendConfirmationEmail(
  input: ConfirmationEmailInput,
): Promise<void> {
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
      to: [input.to],
      subject: SUBJECT[input.locale],
      html: BODY[input.locale](input.confirmUrl, input.title),
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend send failed: ${res.status}`);
  }
}
