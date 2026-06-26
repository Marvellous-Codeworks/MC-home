import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "en" | "it";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.extensions": "Extensions",
  "nav.docs": "Docs",
  "nav.blog": "Blog",
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
  "card.cta.edge": "Also on Microsoft Edge",
  "card.cta.source": "GitHub Source",

  "time.today": "today",
  "time.day": "1 day ago",
  "time.days": "{n} days ago",
  "time.months": "{n} mo ago",
  "time.years": "{n} yr ago",

  "trust.01.t": "Performance",
  "trust.01.b":
    "Engineered to reduce CPU wakeups and memory pressure on any system — budget laptop or high-end workstation, the goal is the same: no wasted RAM.",
  "trust.02.t": "Privacy",
  "trust.02.b":
    "Zero tracking. Zero analytics. Your browsing data never leaves your machine. Both extensions are fully open source for community auditing.",
  "trust.03.t": "Open Source",
  "trust.03.b":
    "Maintained by Marvellous Codeworks and a global community of developers. Fork it, improve it, or contribute under a permissive open-source license.",

  "footer.tagline":
    "A small team and a global open-source community, keeping your browser fast and lean.",
  "footer.col.extensions": "Extensions",
  "footer.col.resources": "Resources",
  "footer.col.community": "Community",
  "footer.link.tgd": "The Great-er Tab Discarder (TGD)",
  "footer.link.tms": "The Marvellous Suspender (TMS)",
  "footer.link.docs": "Documentation",
  "footer.link.blog": "Blog",
  "footer.link.rss": "RSS Feed",
  "footer.link.github": "GitHub",
  "footer.link.issues.tgd": "TGD Issue Tracker",
  "footer.link.issues.tms": "TMS Issue Tracker",
  "footer.link.discussions.tms": "TMS Discussions",
  "tms.legal.privacy": "Privacy Policy",
  "tms.legal.terms": "Terms of Use",
  "footer.copyright":
    "All trademarks mentioned are the property of their respective owners. Third-party trademarks, product names, trade names, corporate names and companies mentioned may be trademarks of their respective owners or registered trademarks of other companies and have been used for explanatory purposes only and for the benefit of the owner, without any intent to infringe existing copyright.",

  "theme.label": "Theme",
  "theme.light": "Light",
  "theme.dark": "Dark",
  "theme.system": "System",
  "lang.label": "Language",

  "notif.label": "Notifications",
  "notif.empty": "No announcements yet.",
  "notif.mark_all": "Mark all as read",
  "notif.read_more": "Read more →",
  "notif.loading": "Loading…",

  "blog.section": "// Latest from the blog",
  "blog.cta.all": "All posts →",
  "blog.cta.read": "Read post →",
  "blog.loading": "Loading posts…",
  "blog.empty": "No posts yet.",

  "product.back": "← All Extensions",
  "product.features": "// Key Features",
  "blog.section.about": "// Latest from the blog about {name}",
};

const it: Dict = {
  "nav.extensions": "Estensioni",
  "nav.docs": "Documentazione",
  "nav.blog": "Blog",
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
  "card.cta.edge": "Disponibile anche su Microsoft Edge",
  "card.cta.source": "Sorgente GitHub",

  "time.today": "oggi",
  "time.day": "1 giorno fa",
  "time.days": "{n} giorni fa",
  "time.months": "{n} mesi fa",
  "time.years": "{n} anni fa",

  "trust.01.t": "Performance",
  "trust.01.b":
    "Progettato per ridurre i wakeup della CPU e la pressione sulla memoria su qualsiasi sistema — laptop economico o workstation di fascia alta, l'obiettivo è lo stesso: nessuna RAM sprecata.",
  "trust.02.t": "Privacy",
  "trust.02.b":
    "Zero tracciamento. Zero analytics. I tuoi dati di navigazione non lasciano mai la tua macchina. Entrambe le estensioni sono open source e verificabili.",
  "trust.03.t": "Open Source",
  "trust.03.b":
    "Mantenuto da Marvellous Codeworks e da una community globale di sviluppatori. Forka, migliora o contribuisci sotto una licenza open source permissiva.",

  "footer.tagline":
    "Un piccolo team e una community open source globale, per un browser sempre veloce e leggero.",
  "footer.col.extensions": "Estensioni",
  "footer.col.resources": "Risorse",
  "footer.col.community": "Community",
  "footer.link.tgd": "The Great-er Tab Discarder (TGD)",
  "footer.link.tms": "The Marvellous Suspender (TMS)",
  "footer.link.docs": "Documentazione",
  "footer.link.blog": "Blog",
  "footer.link.rss": "Feed RSS",
  "footer.link.github": "GitHub",
  "footer.link.issues.tgd": "Issue Tracker TGD",
  "footer.link.issues.tms": "Issue Tracker TMS",
  "footer.link.discussions.tms": "Discussioni TMS",
  "tms.legal.privacy": "Privacy Policy",
  "tms.legal.terms": "Termini di utilizzo",
  "footer.copyright":
    "Tutti i marchi citati appartengono ai legittimi proprietari; marchi di terzi, nomi di prodotti, nomi commerciali, nomi corporativi e società citati possono essere marchi di proprietà dei rispettivi titolari o marchi registrati d'altre società e sono stati utilizzati a puro scopo esplicativo ed a beneficio del possessore, senza alcun fine di violazione dei diritti di Copyright vigenti.",

  "theme.label": "Tema",
  "theme.light": "Chiaro",
  "theme.dark": "Scuro",
  "theme.system": "Sistema",
  "lang.label": "Lingua",

  "notif.label": "Notifiche",
  "notif.empty": "Nessun annuncio per ora.",
  "notif.mark_all": "Segna tutto come letto",
  "notif.read_more": "Leggi l'articolo →",
  "notif.loading": "Caricamento…",

  "blog.section": "// Dal blog",
  "blog.cta.all": "Tutti gli articoli →",
  "blog.cta.read": "Leggi l'articolo →",
  "blog.loading": "Caricamento articoli…",
  "blog.empty": "Nessun articolo per ora.",

  "product.back": "← Tutte le estensioni",
  "product.features": "// Caratteristiche principali",
  "blog.section.about": "// Dal blog su {name}",
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
