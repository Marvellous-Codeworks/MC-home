import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { createLocalStorageStore } from "./local-storage-store";

export type ThemeChoice = "light" | "dark" | "system";

interface ThemeCtx {
  theme: ThemeChoice;
  setTheme: (t: ThemeChoice) => void;
  resolved: "light" | "dark";
}

const Ctx = createContext<ThemeCtx | null>(null);
const STORAGE_KEY = "mc.theme";

function applyTheme(choice: ThemeChoice): void {
  if (typeof document === "undefined") return;
  const prefersDark =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const resolved: "light" | "dark" =
    choice === "system" ? (prefersDark ? "dark" : "light") : choice;
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}

// Saved theme choice in localStorage; "system" on the server and during hydration.
const themeStore = createLocalStorageStore<ThemeChoice>(
  STORAGE_KEY,
  (raw) => (raw === "light" || raw === "dark" || raw === "system" ? raw : "system"),
  (t) => t,
  "system",
);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = themeStore.useValue();
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const resolved: "light" | "dark" = theme === "system" ? (prefersDark ? "dark" : "light") : theme;

  // Sync the <html> class with the choice. Read the store directly rather than
  // `resolved`: on the first client effect `resolved` may still hold the
  // hydration (server) value, which would briefly undo the class already set
  // by the inline init script in __root.
  useEffect(() => {
    applyTheme(themeStore.get());
  }, [theme, prefersDark]);

  const value = useMemo(() => ({ theme, setTheme: themeStore.set, resolved }), [theme, resolved]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useTheme must be inside ThemeProvider");
  return c;
}
