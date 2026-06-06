import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ThemeChoice = "light" | "dark" | "system";

interface ThemeCtx {
  theme: ThemeChoice;
  setTheme: (t: ThemeChoice) => void;
  resolved: "light" | "dark";
}

const Ctx = createContext<ThemeCtx | null>(null);
const STORAGE_KEY = "mc.theme";

function applyTheme(choice: ThemeChoice): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const resolved: "light" | "dark" =
    choice === "system" ? (prefersDark ? "dark" : "light") : choice;
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
  return resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeChoice>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    let initial: ThemeChoice = "system";
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeChoice | null;
      if (saved === "light" || saved === "dark" || saved === "system") initial = saved;
    } catch {
      /* noop */
    }
    setThemeState(initial);
    setResolved(applyTheme(initial));
  }, []);

  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setResolved(applyTheme("system"));
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = (t: ThemeChoice) => {
    setThemeState(t);
    setResolved(applyTheme(t));
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* noop */
    }
  };

  const value = useMemo(() => ({ theme, setTheme, resolved }), [theme, resolved]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useTheme must be inside ThemeProvider");
  return c;
}
