import { createServerFn } from "@tanstack/react-start";

const PACKAGE_JSON_URL =
  "https://raw.githubusercontent.com/Marvellous-Codeworks/logdrop/refs/heads/main/package.json";

// raw.githubusercontent.com has its own (generous, IP-based) rate limit, separate from the
// GitHub API's — but it's still shared across every visitor from Vercel's IP, and the
// version changes rarely, so cache it process-locally for a while.
const CACHE_TTL_MS = 30 * 60 * 1000;
let cached: { version: string | null; expires: number } | null = null;

export const getLogdropVersion = createServerFn({ method: "GET" }).handler(
  async (): Promise<string | null> => {
    if (cached && cached.expires > Date.now()) return cached.version;
    try {
      const res = await fetch(PACKAGE_JSON_URL);
      if (!res.ok) return cached?.version ?? null;
      const pkg = (await res.json()) as { version?: string };
      const version = pkg.version ?? null;
      cached = { version, expires: Date.now() + CACHE_TTL_MS };
      return version;
    } catch (err) {
      console.error("logdrop package.json fetch failed:", err);
      return cached?.version ?? null;
    }
  },
);
