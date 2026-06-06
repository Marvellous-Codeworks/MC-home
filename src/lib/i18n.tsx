import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "en" | "it";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.extensions": "Extensions",
  "nav.docs": "Docs",
  "nav.github": "GitHub",
  "hero.badge": "Manifest V3 ready · Open-source Chromium tools",
  "hero.title.a": "RECLAIM YOUR ",
  "hero.title.b": "BROWSER",
  "hero.title.c": " MEMORY.",
  "hero.subtitle":
    "Precision tools for the professional web. Marvellous Codeworks builds open-source Chromium extensions that turn memory-hungry browsers into lean execution environments.",
  "hero.cta.view": "View Extensions",
  "hero.cta.github": "GitHub Org",

  "tgd.name": "The Great-er Tab Discarder",
  "tgd.description":
    "Leverages the native Chromium discarding engine to freeze inactive tabs, releasing nearly 100% of their RAM while keeping them visible in your tab bar.",
  "tgd.f1.t": "Native Engine.",
  "tgd.f1.b": "Zero performance overhead by using the browser's internal hibernation APIs.",
  "tgd.f2.t": "Force Purge.",
  "tgd.f2.b": "Instantly discard all background tabs with a single hotkey.",
  "tgd.f3.t": "Smart Context.",
  "tgd.f3.b": "Whitelist audio-playing tabs, forms, or pinned tabs automatically.",

  "tms.name": "The Marvellous Suspender",
  "tms.description":
    "The spiritual successor to modern tab suspension. Replaces inactive tabs with a lightweight hibernation page, giving you granular control over when they wake.",
  "tms.f1.t": "Granular Hibernation.",
  "tms.f1.b": "Choose how tabs look when suspended: screenshot, blurred, or text-only.",
  "tms.f2.t": "Session Recovery.",
  "tms.f2.b": "Recover all suspended tabs even after a browser crash or restart.",
  "tms.f3.t": "Power Mode.",
  "tms.f3.b": "Automatically suspends tabs when battery drops below a threshold.",

  "card.cws": "// Chrome Web Store",
  "card.users": "Users",
  "card.users.sub": "Active installs",
  "card.rating": "Rating",
  "card.rating.sub": "{n} ratings",
  "card.gh": "// GitHub",
  "card.unavailable": "Stats unavailable",
  "card.stars": "Stars",
  "card.stars.sub": "Community appreciation",
  "card.stars.tip": "How many users starred this repository",
  "card.forks": "Forks",
  "card.forks.sub": "Copies created",
  "card.forks.tip": "How many developers forked the repository",
  "card.issues": "Open issues",
  "card.issues.sub": "Pending bugs / features",
  "card.issues.tip": "Active bug reports and feature requests",
  "card.release": "Release",
  "card.release.sub": "Latest version",
  "card.release.tip": "Latest published release tag",
  "card.push": "Last push",
  "card.push.sub": "Code activity",
  "card.push.tip": "When the last commit was pushed",
  "card.cta.store": "Chrome Web Store",
  "card.cta.source": "GitHub Source",

  "time.today": "today",
  "time.day": "1 day ago",
  "time.days": "{n} days ago",
  "time.months": "{n} mo ago",
  "time.years": "{n} yr ago",

  "trust.01.t": "Performance",
  "trust.01.b":
    "Built for systems with 4GB to 128GB of RAM. We focus on reducing CPU wakeups and memory pressure to extend battery life and keep your machine cool.",
  "trust.02.t": "Privacy",
  "trust.02.b":
    "Zero tracking. Zero analytics. Your browsing data never leaves your machine. Both extensions are fully open source for community auditing.",
  "trust.03.t": "Open Source",
  "trust.03.b":
    "Maintained by Marvellous Codeworks and a global community of developers. Fork it, improve it, or contribute under a permissive open-source license.",

  "footer.tagline":
    "A precision software studio shipping reliable tools for the modern web environment.",
  "footer.col.extensions": "Extensions",
  "footer.col.resources": "Resources",
  "footer.col.community": "Community",
  "footer.link.tgd": "TGD Tab Discarder",
  "footer.link.tms": "TMS Suspender",
  "footer.link.docs": "Documentation",
  "footer.link.changelog": "Changelog",
  "footer.link.github": "GitHub",
  "footer.link.issues": "Issue Tracker",

  "theme.label": "Theme",
  "theme.light": "Light",
  "theme.dark": "Dark",
  "theme.system": "System",
  "lang.label": "Language",
};

const it: Dict = {
  "nav.extensions": "Estensioni",
  "nav.docs": "Documentazione",
  "nav.github": "GitHub",
  "hero.badge": "Compatibile con Manifest V3 · Strumenti Chromium open source",
  "hero.title.a": "LIBERA LA ",
  "hero.title.b": "MEMORIA",
  "hero.title.c": " DEL TUO BROWSER.",
  "hero.subtitle":
    "Strumenti di precisione per il web professionale. Marvellous Codeworks sviluppa estensioni Chromium open source che trasformano browser affamati di memoria in ambienti d'esecuzione snelli.",
  "hero.cta.view": "Vedi le estensioni",
  "hero.cta.github": "Org GitHub",

  "tgd.name": "The Great-er Tab Discarder",
  "tgd.description":
    "Sfrutta il motore di discarding nativo di Chromium per congelare le schede inattive, liberando quasi il 100% della loro RAM pur mantenendole visibili nella barra delle schede.",
  "tgd.f1.t": "Motore nativo.",
  "tgd.f1.b": "Zero overhead grazie alle API di ibernazione interne del browser.",
  "tgd.f2.t": "Purge forzato.",
  "tgd.f2.b": "Scarta istantaneamente tutte le schede in background con un'unica scorciatoia.",
  "tgd.f3.t": "Contesto intelligente.",
  "tgd.f3.b": "Esclude automaticamente schede con audio, moduli o schede fissate.",

  "tms.name": "The Marvellous Suspender",
  "tms.description":
    "Il successore spirituale della moderna sospensione delle schede. Sostituisce le schede inattive con una pagina di ibernazione leggera, con controllo granulare sul risveglio.",
  "tms.f1.t": "Ibernazione granulare.",
  "tms.f1.b": "Scegli come appaiono le schede sospese: screenshot, sfocate o solo testo.",
  "tms.f2.t": "Recupero sessione.",
  "tms.f2.b": "Ripristina tutte le schede sospese anche dopo un crash o un riavvio del browser.",
  "tms.f3.t": "Modalità risparmio.",
  "tms.f3.b": "Sospende automaticamente le schede quando la batteria scende sotto una soglia.",

  "card.cws": "// Chrome Web Store",
  "card.users": "Utenti",
  "card.users.sub": "Installazioni attive",
  "card.rating": "Valutazione",
  "card.rating.sub": "{n} recensioni",
  "card.gh": "// GitHub",
  "card.unavailable": "Statistiche non disponibili",
  "card.stars": "Stelle",
  "card.stars.sub": "Apprezzamento della community",
  "card.stars.tip": "Quanti utenti hanno messo una stella al repository",
  "card.forks": "Fork",
  "card.forks.sub": "Copie create",
  "card.forks.tip": "Quanti sviluppatori hanno forkato il repository",
  "card.issues": "Issue aperte",
  "card.issues.sub": "Bug e richieste in sospeso",
  "card.issues.tip": "Bug segnalati e richieste di funzionalità attive",
  "card.release": "Release",
  "card.release.sub": "Ultima versione",
  "card.release.tip": "Ultimo tag di release pubblicato",
  "card.push": "Ultimo push",
  "card.push.sub": "Attività sul codice",
  "card.push.tip": "Quando è stato pushato l'ultimo commit",
  "card.cta.store": "Chrome Web Store",
  "card.cta.source": "Sorgente GitHub",

  "time.today": "oggi",
  "time.day": "1 giorno fa",
  "time.days": "{n} giorni fa",
  "time.months": "{n} mesi fa",
  "time.years": "{n} anni fa",

  "trust.01.t": "Performance",
  "trust.01.b":
    "Pensato per sistemi da 4GB a 128GB di RAM. Riduciamo i wakeup della CPU e la pressione sulla memoria per allungare la batteria e tenere la macchina fresca.",
  "trust.02.t": "Privacy",
  "trust.02.b":
    "Zero tracciamento. Zero analytics. I tuoi dati di navigazione non lasciano mai la tua macchina. Entrambe le estensioni sono open source e verificabili.",
  "trust.03.t": "Open Source",
  "trust.03.b":
    "Mantenuto da Marvellous Codeworks e da una community globale di sviluppatori. Forka, migliora o contribuisci sotto una licenza open source permissiva.",

  "footer.tagline":
    "Uno studio software di precisione che sviluppa strumenti affidabili per il web moderno.",
  "footer.col.extensions": "Estensioni",
  "footer.col.resources": "Risorse",
  "footer.col.community": "Community",
  "footer.link.tgd": "TGD Tab Discarder",
  "footer.link.tms": "TMS Suspender",
  "footer.link.docs": "Documentazione",
  "footer.link.changelog": "Changelog",
  "footer.link.github": "GitHub",
  "footer.link.issues": "Issue Tracker",

  "theme.label": "Tema",
  "theme.light": "Chiaro",
  "theme.dark": "Scuro",
  "theme.system": "Sistema",
  "lang.label": "Lingua",
};

const dicts: Record<Locale, Dict> = { en, it };

interface I18nCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

const STORAGE_KEY = "mc.locale";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved === "en" || saved === "it") setLocaleState(saved);
    } catch {
      /* noop */
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* noop */
    }
  };

  const value = useMemo<I18nCtx>(() => {
    const dict = dicts[locale];
    return {
      locale,
      setLocale,
      t: (key, vars) => {
        let s = dict[key] ?? en[key] ?? key;
        if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
        return s;
      },
    };
  }, [locale]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18nCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useI18n must be inside I18nProvider");
  return c;
}
