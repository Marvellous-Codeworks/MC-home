import { createHmac, timingSafeEqual } from "node:crypto";

export interface PendingReport {
  email: string;
  title: string;
  body: string;
  type: "bug" | "feature";
  owner: string;
  repo: string;
  locale: "en" | "it";
  exp: number;
}

const TTL_SECONDS = 60 * 60;

function toBase64Url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

export function signPendingReport(
  payload: Omit<PendingReport, "exp">,
  secret: string,
): string {
  const full: PendingReport = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + TTL_SECONDS,
  };
  const json = JSON.stringify(full);
  const signature = createHmac("sha256", secret).update(json).digest();
  return `${toBase64Url(json)}.${toBase64Url(signature)}`;
}

export function verifyPendingReport(
  token: string,
  secret: string,
): PendingReport | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadPart, signaturePart] = parts;

  let json: string;
  try {
    json = Buffer.from(payloadPart, "base64url").toString("utf8");
  } catch {
    return null;
  }

  const expectedSignature = createHmac("sha256", secret).update(json).digest();
  let actualSignature: Buffer;
  try {
    actualSignature = Buffer.from(signaturePart, "base64url");
  } catch {
    return null;
  }
  if (
    actualSignature.length !== expectedSignature.length ||
    !timingSafeEqual(actualSignature, expectedSignature)
  ) {
    return null;
  }

  let payload: PendingReport;
  try {
    payload = JSON.parse(json);
  } catch {
    return null;
  }
  if (
    typeof payload.exp !== "number" ||
    payload.exp < Math.floor(Date.now() / 1000)
  ) {
    return null;
  }
  return payload;
}
