import { createContext, useContext, useMemo, type ReactNode } from "react";
import { createLocalStorageStore } from "./local-storage-store";

export type Locale = "en" | "it";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.extensions": "Products",
  "nav.docs": "Docs",
  "nav.blog": "Blog",
  "nav.github": "GitHub",
  "hero.title.a": "RECLAIM YOUR ",
  "hero.title.b": "BROWSER",
  "hero.title.c": " MEMORY.",
  "hero.carousel.label": "Marvellous Codeworks products",
  "hero.tab.ext.t": "Extensions",
  "hero.tab.ext.b": "Tab memory",
  "hero.tab.logdrop.b": "Private log drop-off",
  "hero.tab.proxy.b": "Secrets off the client",
  "hero.ext.eyebrow": "Open source // Chromium extensions",
  "hero.ext.subtitle":
    "Suspend or discard the tabs you aren't using, and give your browser its memory back without losing your place.",
  "hero.logdrop.eyebrow": "Open source // Self-hostable",
  "hero.logdrop.title.a": "SHARE LOGS WITHOUT ",
  "hero.logdrop.title.b": "GOING PUBLIC",
  "hero.logdrop.title.c": ".",
  "hero.logdrop.subtitle":
    "Anyone can upload text with no account. Only allow-listed maintainers can read it back, and every upload expires on its own.",
  "hero.proxy.eyebrow": "Open source // Self-hostable",
  "hero.proxy.title.a": "KEEP THE ",
  "hero.proxy.title.b": "CLIENT SECRET",
  "hero.proxy.title.c": " OUT OF YOUR EXTENSION.",
  "hero.proxy.subtitle":
    "A tiny Cloudflare Worker that brokers Google OAuth token exchanges, so your browser extension never has to ship its secret.",
  "hero.proxy.flow.a.t": "Extension",
  "hero.proxy.flow.a.b": "POST /token, no secret",
  "hero.proxy.flow.b.t": "Worker",
  "hero.proxy.flow.b.b": "adds client_secret",
  "hero.proxy.flow.c.t": "Google",
  "hero.proxy.flow.c.b": "returns the tokens",

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

  "logdrop.name": "logdrop",
  "logdrop.description":
    "A generic, self-hostable, PrivateBin-style plain-text drop-off. Anyone can upload text or a .txt file with no account; only allow-listed maintainers can read an upload back, via a magic-link login. Built to safely collect diagnostic reports — like TMS debug logs — without pasting them into a public GitHub issue.",
  "logdrop.f1.t": "No account uploads.",
  "logdrop.f1.b": "Anyone can drop off text or a .txt file — no sign-up, no friction.",
  "logdrop.f2.t": "Magic-link reads.",
  "logdrop.f2.b":
    "Only allow-listed maintainer emails can read an upload back, via a passwordless login.",
  "logdrop.f3.t": "Automatic expiry.",
  "logdrop.f3.b": "Uploads are deleted after a configurable retention window — nothing lingers.",
  "logdrop.f4.t": "Per-admin AI agent access.",
  "logdrop.f4.b":
    "Each maintainer generates a personal token from the dashboard so their own AI agent can read shared logs. Stored only as a hash, revocable anytime, and every read is attributed.",
  "logdrop.cta.open": "Open logdrop",
  "logdrop.cta.docs": "Documentation",

  "oauthproxy.name": "OAuth Proxy for Google",
  "oauthproxy.description":
    "A tiny Cloudflare Worker that brokers Google OAuth token exchanges, so a browser extension can use an authorization-code + PKCE flow without shipping its client secret. Built for The Marvellous Suspender's Google Drive backup on Brave and Vivaldi, and generic enough to fork for your own extension.",
  "oauthproxy.f1.t": "Secret off the client.",
  "oauthproxy.f1.b":
    "The OAuth client secret lives in a Cloudflare secret, never inside the extension package.",
  "oauthproxy.f2.t": "Refresh tokens, no browser tricks.",
  "oauthproxy.f2.b":
    "Handles the authorization-code + PKCE grant and every refresh-token renewal, for browsers where getAuthToken() doesn't work.",
  "oauthproxy.f3.t": "Pass-through by design.",
  "oauthproxy.f3.b":
    "Adds the client credentials, forwards the request to Google and returns the response unchanged. No storage, and no logging of request or response bodies.",
  "oauthproxy.f4.t": "Fork and deploy.",
  "oauthproxy.f4.b":
    "Nothing is TMS-specific beyond its config: set your client ID, extension origin and secret, then deploy on the Cloudflare Workers free tier.",
  "oauthproxy.security.heading": "// Security model",
  "oauthproxy.security.p1":
    "The Worker keeps the client secret off users' machines, nothing more. Google remains the real security boundary: without a valid code or refresh token issued for this OAuth client, every request is rejected. The Origin check is a soft filter, not access control.",
  "oauthproxy.security.p2":
    "Authorization codes and tokens do pass through the Worker while an exchange is in flight, so it has to be trusted not to keep them. The source is public so you can check that it doesn't, or run your own. It never sees your Google Drive data.",
  "oauthproxy.security.p3":
    "The Marvellous Codeworks instance only serves The Marvellous Suspender. For your own extension, deploy your own.",
  "oauthproxy.cta.docs": "Documentation",

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
    "A small team and a global open-source community, building precision tools for the professional web.",
  "footer.col.extensions": "Products",
  "footer.col.resources": "Resources",
  "footer.col.community": "Community",
  "footer.link.tgd": "The Great-er Tab Discarder (TGD)",
  "footer.link.tms": "The Marvellous Suspender (TMS)",
  "footer.link.logdrop": "logdrop",
  "footer.link.oauthproxy": "OAuth Proxy for Google",
  "footer.link.docs": "Documentation",
  "footer.link.blog": "Blog",
  "footer.link.rss": "RSS Feed",
  "footer.link.github": "GitHub",
  "footer.link.discussions.tgd": "TGD Discussions",
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

  "product.back": "← All Products",
  "product.features": "// Key Features",
  "product.learnMore": "Learn More",
  "product.changelog": "// What's new in {version}",
  "product.changelog.released": "Released {date}",
  "product.changelog.github": "View on GitHub",
  "blog.section.about": "// Latest from the blog about {name}",

  "report.form.heading": "Report a bug or request a feature",
  "report.form.intro":
    "Tell us what's wrong or what you'd like to see. We'll email you a confirmation link, then open a GitHub Issue on your behalf — you'll never need a GitHub account.",
  "report.form.type": "Type",
  "report.form.type.bug": "Bug report",
  "report.form.type.feature": "Feature request",
  "report.form.title": "Title",
  "report.form.title.placeholder": "Short summary of the issue",
  "report.form.body": "Description",
  "report.form.body.placeholder": "What happened? What did you expect instead?",
  "report.form.select": "Select…",
  "report.form.tmsVersion": "TMS version",
  "report.form.tmsVersion.placeholder": "Shown on the extension's About page",
  "report.form.browser": "Browser",
  "report.form.browserVersion": "Browser version",
  "report.form.browserVersion.placeholder": "Shown on your browser's About page",
  "report.form.os": "Operating system",
  "report.form.whatHappened": "What happened",
  "report.form.whatHappened.placeholder": "What did you see? Include any error messages.",
  "report.form.steps": "Steps to reproduce",
  "report.form.steps.placeholder":
    "1. Open a few tabs and let them suspend\n2. Restart the browser\n3. …",
  "report.form.expected": "Expected behaviour (optional)",
  "report.form.expected.placeholder": "What should have happened instead?",
  "report.form.problem": "Problem / use case",
  "report.form.problem.placeholder": "What are you trying to do, and what stops you today?",
  "report.form.solution": "Proposed solution",
  "report.form.solution.placeholder": "What would you like TMS to do?",
  "report.form.alternatives": "Alternatives considered (optional)",
  "report.form.alternatives.placeholder":
    "Workarounds you tried, or other ways this could be solved.",
  "report.form.diagnosticHint":
    "For intermittent or hard-to-reproduce bugs, a debug report helps a lot.",
  "report.form.diagnosticHint.link": "How to get one",
  "report.form.diagnosticHint.privacy": "It can include tab titles/URLs, so upload it to",
  "report.form.diagnosticHint.logdropLink": "logdrop",
  "report.form.diagnosticHint.privacySuffix": "instead of pasting it in the issue.",
  "report.form.email": "Email",
  "report.form.email.placeholder": "you@example.com",
  "report.form.submit": "Send confirmation email",
  "report.form.submitting": "Sending…",
  "report.form.success.title": "Check your inbox",
  "report.form.success.body":
    "We've sent a confirmation link to {email}. Click it to open your report on GitHub.",
  "report.form.error": "Something went wrong. Please try again.",
  "report.form.error.rateLimited": "Too many submissions — please wait a bit and try again.",

  "report.confirm.error.title": "This link is invalid or has expired",
  "report.confirm.error.body": "Please submit a new report — links expire after one hour.",
  "report.confirm.error.cta": "New report",
  "report.confirm.error.github":
    "We couldn't create the GitHub Issue. Please try the link again in a minute.",

  "report.status.badge.open": "Open",
  "report.status.badge.closed": "Closed",
  "report.status.readonly.title": "This report is now read-only",
  "report.status.readonly.body":
    "This issue has been closed for more than 15 days, so new comments are disabled here.",
  "report.status.readonly.cta": "Open a new report",
  "report.status.comments.heading": "Comments",
  "report.status.comment.placeholder": "Add a comment…",
  "report.status.comment.submit": "Post comment",
  "report.status.comment.submitting": "Posting…",
  "report.status.comment.error": "Couldn't post your comment. Please try again.",
  "report.status.viewOnGithub": "View on GitHub",
  "report.status.error": "We couldn't load this report. It may not exist, or something went wrong.",

  "tms.legal.report": "Report an issue",
};

const it: Dict = {
  "nav.extensions": "Prodotti",
  "nav.docs": "Documentazione",
  "nav.blog": "Blog",
  "nav.github": "GitHub",
  "hero.title.a": "LIBERA LA ",
  "hero.title.b": "MEMORIA",
  "hero.title.c": " DEL TUO BROWSER.",
  "hero.carousel.label": "Prodotti Marvellous Codeworks",
  "hero.tab.ext.t": "Estensioni",
  "hero.tab.ext.b": "Memoria delle schede",
  "hero.tab.logdrop.b": "Log privati, con scadenza",
  "hero.tab.proxy.b": "Secret fuori dal client",
  "hero.ext.eyebrow": "Open source // Estensioni Chromium",
  "hero.ext.subtitle":
    "Sospendi o scarta le schede che non usi e restituisci memoria al browser, senza perdere il punto in cui eri.",
  "hero.logdrop.eyebrow": "Open source // Autospitabile",
  "hero.logdrop.title.a": "CONDIVIDI I LOG SENZA ",
  "hero.logdrop.title.b": "RENDERLI PUBBLICI",
  "hero.logdrop.title.c": ".",
  "hero.logdrop.subtitle":
    "Chiunque può caricare testo senza account. Solo i manutentori autorizzati possono rileggerlo, e ogni caricamento scade da solo.",
  "hero.proxy.eyebrow": "Open source // Autospitabile",
  "hero.proxy.title.a": "TIENI IL ",
  "hero.proxy.title.b": "CLIENT SECRET",
  "hero.proxy.title.c": " FUORI DALLA TUA ESTENSIONE.",
  "hero.proxy.subtitle":
    "Un piccolo Cloudflare Worker che gestisce lo scambio di token OAuth con Google, così la tua estensione non deve mai distribuire il secret.",
  "hero.proxy.flow.a.t": "Estensione",
  "hero.proxy.flow.a.b": "POST /token, senza secret",
  "hero.proxy.flow.b.t": "Worker",
  "hero.proxy.flow.b.b": "aggiunge client_secret",
  "hero.proxy.flow.c.t": "Google",
  "hero.proxy.flow.c.b": "restituisce i token",

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

  "logdrop.name": "logdrop",
  "logdrop.description":
    "Un drop-off di testo generico, autospitabile, in stile PrivateBin: chiunque può caricare testo o un file .txt senza account; solo i manutentori in una lista consentita possono rileggerlo, tramite login con magic-link. Pensato per raccogliere in sicurezza report diagnostici — come i debug log di TMS — senza incollarli in una issue pubblica su GitHub.",
  "logdrop.f1.t": "Caricamenti senza account.",
  "logdrop.f1.b":
    "Chiunque può caricare testo o un file .txt — nessuna registrazione, nessun attrito.",
  "logdrop.f2.t": "Lettura via magic-link.",
  "logdrop.f2.b":
    "Solo le email dei manutentori in lista possono rileggere un caricamento, con login senza password.",
  "logdrop.f3.t": "Scadenza automatica.",
  "logdrop.f3.b":
    "I caricamenti vengono eliminati dopo una finestra di conservazione configurabile — niente resta appeso.",
  "logdrop.f4.t": "Accesso AI agent per ogni admin.",
  "logdrop.f4.b":
    "Ogni manutentore genera dalla dashboard un token personale con cui il proprio AI agent può leggere i log condivisi. Salvato solo come hash, revocabile in qualsiasi momento, e ogni lettura è attribuita.",
  "logdrop.cta.open": "Apri logdrop",
  "logdrop.cta.docs": "Documentazione",

  "oauthproxy.name": "OAuth Proxy for Google",
  "oauthproxy.description":
    "Un piccolo Cloudflare Worker che gestisce lo scambio di token OAuth con Google, così un'estensione del browser può usare un flusso authorization-code + PKCE senza distribuire il proprio client secret. Nato per il backup su Google Drive di The Marvellous Suspender su Brave e Vivaldi, è abbastanza generico da poter essere forkato per la tua estensione.",
  "oauthproxy.f1.t": "Secret fuori dal client.",
  "oauthproxy.f1.b":
    "Il client secret OAuth resta in un secret di Cloudflare, mai dentro il pacchetto dell'estensione.",
  "oauthproxy.f2.t": "Refresh token, senza trucchi del browser.",
  "oauthproxy.f2.b":
    "Gestisce il grant authorization-code + PKCE e ogni rinnovo del refresh token, per i browser dove getAuthToken() non funziona.",
  "oauthproxy.f3.t": "Solo transito, per scelta.",
  "oauthproxy.f3.b":
    "Aggiunge le credenziali del client, inoltra la richiesta a Google e restituisce la risposta senza modificarla. Nessuna memorizzazione e nessun log del contenuto di richieste e risposte.",
  "oauthproxy.f4.t": "Forka e pubblica.",
  "oauthproxy.f4.b":
    "Di specifico per TMS c'è solo la configurazione: imposta client ID, origin dell'estensione e secret, poi pubblica sul piano gratuito di Cloudflare Workers.",
  "oauthproxy.security.heading": "// Modello di sicurezza",
  "oauthproxy.security.p1":
    "Il Worker tiene il client secret lontano dai computer degli utenti, niente di più. Il vero confine di sicurezza resta Google: senza un code o un refresh token validi, emessi per questo client OAuth, ogni richiesta viene rifiutata. Il controllo sull'Origin è un filtro leggero, non un controllo degli accessi.",
  "oauthproxy.security.p2":
    "Code e token attraversano il Worker durante lo scambio, quindi bisogna fidarsi del fatto che non li conservi. Il sorgente è pubblico proprio per poterlo verificare, oppure per pubblicare un'istanza tua. Il Worker non vede mai i tuoi dati su Google Drive.",
  "oauthproxy.security.p3":
    "L'istanza di Marvellous Codeworks serve solo The Marvellous Suspender. Per la tua estensione, pubblicane una tua.",
  "oauthproxy.cta.docs": "Documentazione",

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
    "Un piccolo team e una community open source globale, che sviluppa strumenti di precisione per il web professionale.",
  "footer.col.extensions": "Prodotti",
  "footer.col.resources": "Risorse",
  "footer.col.community": "Community",
  "footer.link.tgd": "The Great-er Tab Discarder (TGD)",
  "footer.link.tms": "The Marvellous Suspender (TMS)",
  "footer.link.logdrop": "logdrop",
  "footer.link.oauthproxy": "OAuth Proxy for Google",
  "footer.link.docs": "Documentazione",
  "footer.link.blog": "Blog",
  "footer.link.rss": "Feed RSS",
  "footer.link.github": "GitHub",
  "footer.link.discussions.tgd": "Discussioni TGD",
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

  "product.back": "← Tutti i prodotti",
  "product.features": "// Caratteristiche principali",
  "product.learnMore": "Scopri di più",
  "product.changelog": "// Novità della {version}",
  "product.changelog.released": "Pubblicata il {date}",
  "product.changelog.github": "Vedi su GitHub",
  "blog.section.about": "// Dal blog su {name}",

  "report.form.heading": "Segnala un bug o richiedi una funzionalità",
  "report.form.intro":
    "Raccontaci cosa non va o cosa vorresti vedere. Ti invieremo un'email di conferma, poi apriremo una Issue su GitHub per te — non ti serve un account GitHub.",
  "report.form.type": "Tipo",
  "report.form.type.bug": "Segnalazione bug",
  "report.form.type.feature": "Richiesta funzionalità",
  "report.form.title": "Titolo",
  "report.form.title.placeholder": "Breve riassunto del problema",
  "report.form.body": "Descrizione",
  "report.form.body.placeholder": "Cosa è successo? Cosa ti aspettavi invece?",
  "report.form.select": "Seleziona…",
  "report.form.tmsVersion": "Versione di TMS",
  "report.form.tmsVersion.placeholder": "Indicata nella pagina Info dell'estensione",
  "report.form.browser": "Browser",
  "report.form.browserVersion": "Versione del browser",
  "report.form.browserVersion.placeholder": "Indicata nella pagina Informazioni del browser",
  "report.form.os": "Sistema operativo",
  "report.form.whatHappened": "Cosa è successo",
  "report.form.whatHappened.placeholder": "Cosa hai visto? Includi eventuali messaggi di errore.",
  "report.form.steps": "Passi per riprodurre",
  "report.form.steps.placeholder":
    "1. Apri qualche scheda e lasciala sospendere\n2. Riavvia il browser\n3. …",
  "report.form.expected": "Comportamento atteso (facoltativo)",
  "report.form.expected.placeholder": "Cosa sarebbe dovuto succedere invece?",
  "report.form.problem": "Problema / caso d'uso",
  "report.form.problem.placeholder": "Cosa stai cercando di fare e cosa te lo impedisce oggi?",
  "report.form.solution": "Soluzione proposta",
  "report.form.solution.placeholder": "Cosa vorresti che TMS facesse?",
  "report.form.alternatives": "Alternative considerate (facoltativo)",
  "report.form.alternatives.placeholder":
    "Soluzioni temporanee che hai provato, o altri modi per risolvere.",
  "report.form.diagnosticHint":
    "Per bug intermittenti o difficili da riprodurre, un report di debug aiuta molto.",
  "report.form.diagnosticHint.link": "Come ottenerlo",
  "report.form.diagnosticHint.privacy":
    "Può contenere titoli/URL delle tue schede, quindi caricalo su",
  "report.form.diagnosticHint.logdropLink": "logdrop",
  "report.form.diagnosticHint.privacySuffix": "invece di incollarlo nell'issue.",
  "report.form.email": "Email",
  "report.form.email.placeholder": "tu@esempio.com",
  "report.form.submit": "Invia email di conferma",
  "report.form.submitting": "Invio in corso…",
  "report.form.success.title": "Controlla la tua casella di posta",
  "report.form.success.body":
    "Abbiamo inviato un link di conferma a {email}. Clicca per aprire la tua segnalazione su GitHub.",
  "report.form.error": "Qualcosa è andato storto. Riprova.",
  "report.form.error.rateLimited": "Troppi invii — attendi qualche minuto e riprova.",

  "report.confirm.error.title": "Questo link non è valido o è scaduto",
  "report.confirm.error.body": "Invia una nuova segnalazione — i link scadono dopo un'ora.",
  "report.confirm.error.cta": "Nuova segnalazione",
  "report.confirm.error.github":
    "Non siamo riusciti a creare la Issue su GitHub. Riprova il link tra un minuto.",

  "report.status.badge.open": "Aperta",
  "report.status.badge.closed": "Chiusa",
  "report.status.readonly.title": "Questa segnalazione è ora di sola lettura",
  "report.status.readonly.body":
    "Questa issue è chiusa da più di 15 giorni, quindi qui i nuovi commenti sono disabilitati.",
  "report.status.readonly.cta": "Apri una nuova segnalazione",
  "report.status.comments.heading": "Commenti",
  "report.status.comment.placeholder": "Aggiungi un commento…",
  "report.status.comment.submit": "Pubblica commento",
  "report.status.comment.submitting": "Pubblicazione…",
  "report.status.comment.error": "Non siamo riusciti a pubblicare il commento. Riprova.",
  "report.status.viewOnGithub": "Vedi su GitHub",
  "report.status.error":
    "Non siamo riusciti a caricare questa segnalazione. Potrebbe non esistere, oppure qualcosa è andato storto.",

  "tms.legal.report": "Segnala un problema",
};

const dicts: Record<Locale, Dict> = { en, it };

interface I18nCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

const STORAGE_KEY = "mc.locale";

// Saved language in localStorage; English on the server and during hydration.
const localeStore = createLocalStorageStore<Locale>(
  STORAGE_KEY,
  (raw) => (raw === "en" || raw === "it" ? raw : "en"),
  (l) => l,
  "en",
);

export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = localeStore.useValue();

  const value = useMemo<I18nCtx>(() => {
    const dict = dicts[locale];
    return {
      locale,
      setLocale: localeStore.set,
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
