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

export interface ReporterToken {
  owner: string;
  repo: string;
  issueNumber: number;
  exp: number;
}

const PENDING_TTL_SECONDS = 60 * 60;
// Longer than the 15-day post-close comment window, so the token outlives
// the entire period during which it could still be used to post a comment.
const REPORTER_TTL_SECONDS = 30 * 24 * 60 * 60;

function toBase64Url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

function signWithExpiry<T extends { exp: number }>(
  payload: Omit<T, "exp">,
  ttlSeconds: number,
  secret: string,
): string {
  const full = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  } as T;
  const json = JSON.stringify(full);
  const signature = createHmac("sha256", secret).update(json).digest();
  return `${toBase64Url(json)}.${toBase64Url(signature)}`;
}

function verifyWithExpiry<T extends { exp: number }>(
  token: string,
  secret: string,
): T | null {
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

  let payload: T;
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

export function signPendingReport(
  payload: Omit<PendingReport, "exp">,
  secret: string,
): string {
  return signWithExpiry<PendingReport>(payload, PENDING_TTL_SECONDS, secret);
}

export function verifyPendingReport(
  token: string,
  secret: string,
): PendingReport | null {
  return verifyWithExpiry<PendingReport>(token, secret);
}

export function signReporterToken(
  payload: Omit<ReporterToken, "exp">,
  secret: string,
): string {
  return signWithExpiry<ReporterToken>(payload, REPORTER_TTL_SECONDS, secret);
}

export function verifyReporterToken(
  token: string,
  secret: string,
): ReporterToken | null {
  return verifyWithExpiry<ReporterToken>(token, secret);
}
