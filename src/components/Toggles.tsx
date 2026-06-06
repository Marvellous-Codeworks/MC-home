import { Monitor, Moon, Sun, Globe } from "lucide-react";
import { useTheme, type ThemeChoice } from "@/lib/theme";
import { useI18n, type Locale } from "@/lib/i18n";

const themeOptions: { value: ThemeChoice; Icon: typeof Sun; key: string }[] = [
  { value: "light", Icon: Sun, key: "theme.light" },
  { value: "dark", Icon: Moon, key: "theme.dark" },
  { value: "system", Icon: Monitor, key: "theme.system" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();
  return (
    <div
      role="group"
      aria-label={t("theme.label")}
      className="inline-flex items-center rounded-sm border border-border bg-card p-0.5"
    >
      {themeOptions.map(({ value, Icon, key }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={active}
            title={t(key)}
            className={`inline-flex h-6 w-6 items-center justify-center rounded-sm transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-3 w-3" aria-hidden />
            <span className="sr-only">{t(key)}</span>
          </button>
        );
      })}
    </div>
  );
}

export function LanguageToggle() {
  const { locale, setLocale, t } = useI18n();
  const next: Locale = locale === "en" ? "it" : "en";
  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      aria-label={t("lang.label")}
      title={t("lang.label")}
      className="inline-flex items-center gap-1.5 h-7 px-2 rounded-sm border border-border bg-card font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
    >
      <Globe className="h-3 w-3" aria-hidden />
      {locale}
    </button>
  );
}
