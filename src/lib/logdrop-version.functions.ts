import { createServerFn } from "@tanstack/react-start";

const PACKAGE_JSON_URL =
  "https://raw.githubusercontent.com/Marvellous-Codeworks/logdrop/refs/heads/main/package.json";

export const getLogdropVersion = createServerFn({ method: "GET" }).handler(
  async (): Promise<string | null> => {
    try {
      const res = await fetch(PACKAGE_JSON_URL);
      if (!res.ok) return null;
      const pkg = (await res.json()) as { version?: string };
      return pkg.version ?? null;
    } catch (err) {
      console.error("logdrop package.json fetch failed:", err);
      return null;
    }
  },
);
