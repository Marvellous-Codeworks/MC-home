export type LegalSection = {
  heading: string;
  body: string[];
};

export type LegalDoc = {
  title: string;
  effectiveDate: string;
  sections: LegalSection[];
};

export type LegalContent = {
  it: LegalDoc;
  en: LegalDoc;
};

export const TMS_PRIVACY_CONTENT: LegalContent = {
  it: {
    title: "Informativa sulla Privacy",
    effectiveDate: "2026-11-05",
    sections: [
      {
        heading: "Titolare del trattamento",
        body: ['Giovanni Solone ("Marvellous Codeworks")', "E-mail: privacy@marvellouscode.works"],
      },
      {
        heading: "Dati trattati",
        body: [
          'The Marvellous Suspender (di seguito "TMS" o "l\'Estensione") non invia a server di Marvellous Codeworks schede, sessioni, impostazioni o backup: questi dati restano esclusivamente sul dispositivo dell\'utente o nel suo account Google Drive personale. L\'unica eccezione riguarda le credenziali OAuth sui browser in cui l\'accesso integrato di Chrome non è disponibile, come descritto in "Terze parti — Cloudflare".',
          "• URL delle schede e struttura delle sessioni — quando la funzione di backup su Google Drive è abilitata, TMS salva un file JSON contenente gli URL delle schede aperte e la struttura delle finestre e dei gruppi. Il file viene scritto direttamente nell'account Google Drive dell'utente.",
          "• Impostazioni dell'estensione — memorizzate localmente tramite chrome.storage.local.",
          "• Cronologia delle sessioni — memorizzata localmente nel database IndexedDB del browser.",
          "• Credenziali OAuth — sui browser in cui l'accesso integrato di Chrome non è disponibile (ad esempio Brave e Vivaldi), collegando Google Drive TMS salva un refresh token di Google nello storage locale del browser e conserva l'access token nello storage di sessione, che viene svuotato alla chiusura del browser.",
        ],
      },
      {
        heading: "Finalità del trattamento",
        body: [
          "I dati sono trattati esclusivamente per consentire il backup, il ripristino e la gestione delle sessioni di navigazione. Non vengono effettuate profilazioni, analisi statistiche, pubblicità o qualsiasi altra elaborazione a fini commerciali.",
        ],
      },
      {
        heading: "Base giuridica",
        body: [
          "Il trattamento si basa sul consenso esplicito dell'utente (art. 6, par. 1, lett. a, GDPR), espresso al momento dell'attivazione della funzione di backup su Google Drive e dell'autorizzazione OAuth tramite il proprio account Google.",
        ],
      },
      {
        heading: "Terze parti — Google Drive",
        body: [
          "TMS utilizza le API di Google Drive per salvare i file di backup nell'account Google dell'utente. I file di backup vengono trasmessi direttamente tra il browser dell'utente e i server di Google LLC; Marvellous Codeworks non li riceve né vi accede. Si applicano la Privacy Policy e i Termini di servizio di Google (policies.google.com/privacy).",
          "• Lo scope OAuth richiesto è drive.appdata: TMS può accedere esclusivamente a una cartella nascosta riservata all'applicazione nell'account Drive dell'utente, e non agli altri file presenti su Drive.",
        ],
      },
      {
        heading: "Terze parti — Cloudflare",
        body: [
          "Sui browser in cui l'accesso integrato di Chrome non è disponibile (ad esempio Brave e Vivaldi), TMS ottiene e rinnova i token OAuth di Google tramite tms-oauth-proxy, un Cloudflare Worker gestito da Marvellous Codeworks che aggiunge il client secret OAuth e inoltra la richiesta a Google. Su Chrome questo componente non viene utilizzato.",
          "Il codice di autorizzazione, il refresh token e l'access token restituito da Google transitano nel Worker, ospitato da Cloudflare, Inc., per la sola durata di ciascuna richiesta. Il Worker non memorizza questi valori, non registra il contenuto di richieste e risposte e non riceve mai i file di backup né altri contenuti di Drive.",
          "Cloudflare può trattare metadati tecnici delle richieste, come indirizzo IP, data e ora e codice di stato. Si applica la Privacy Policy di Cloudflare (cloudflare.com/privacypolicy). Il codice sorgente del Worker è pubblico: github.com/Marvellous-Codeworks/tms-oauth-proxy.",
        ],
      },
      {
        heading: "Conservazione dei dati",
        body: [
          "I file di backup su Google Drive restano nell'account dell'utente fino alla loro eliminazione manuale o automatica (per impostazione predefinita TMS conserva gli ultimi 10 backup automatici). I dati locali (impostazioni, sessioni) restano sul dispositivo fino alla disinstallazione dell'estensione o alla loro cancellazione tramite le impostazioni. Le credenziali OAuth salvate localmente vengono rimosse quando l'utente scollega l'account Google da TMS o disinstalla l'estensione.",
        ],
      },
      {
        heading: "Diritti degli interessati",
        body: [
          "Ai sensi degli artt. 15–21 del GDPR, l'utente ha il diritto di accedere ai propri dati, rettificarli o cancellarli, opporsi al trattamento o richiederne la limitazione, revocare il consenso in qualsiasi momento revocando l'accesso OAuth dalla pagina di impostazioni di TMS o dalla sezione \"App e servizi\" del proprio account Google.",
          "L'utente può proporre reclamo all'autorità di controllo competente. In Italia: Garante per la Protezione dei Dati Personali — garanteprivacy.it.",
        ],
      },
      {
        heading: "Sicurezza",
        body: [
          "Su Chrome il token OAuth è gestito dal browser. Sui browser descritti in \"Terze parti — Cloudflare\" i token sono conservati nello storage dell'estensione all'interno del browser. TMS non riceve mai la password dell'account Google. Il trasferimento dei dati verso Google Drive e verso il Worker avviene tramite connessioni HTTPS cifrate.",
        ],
      },
      {
        heading: "Modifiche alla presente informativa",
        body: [
          "Eventuali aggiornamenti saranno pubblicati a questo URL. L'uso continuato dell'estensione dopo la pubblicazione degli aggiornamenti costituisce accettazione delle modifiche.",
        ],
      },
      {
        heading: "Contatti",
        body: [
          "Per richieste relative alla privacy: privacy@marvellouscode.works",
          "Per segnalazioni tecniche: github.com/gioxx/MarvellousSuspender/issues",
        ],
      },
    ],
  },

  en: {
    title: "Privacy Policy",
    effectiveDate: "2026-11-05",
    sections: [
      {
        heading: "Data Controller",
        body: ['Giovanni Solone ("Marvellous Codeworks")', "E-mail: privacy@marvellouscode.works"],
      },
      {
        heading: "Data We Process",
        body: [
          'The Marvellous Suspender ("TMS" or "the Extension") does not send tabs, sessions, settings or backups to Marvellous Codeworks servers: this data remains exclusively on the user\'s device or in their personal Google Drive account. The only exception concerns OAuth credentials on browsers where Chrome\'s built-in sign-in is unavailable, as described under "Third Parties — Cloudflare".',
          "• Tab URLs and session structure — when the Google Drive backup feature is enabled, TMS saves a JSON file containing the URLs of open tabs and the window/group structure. The file is written directly to the user's Google Drive account.",
          "• Extension settings — stored locally via chrome.storage.local.",
          "• Session history — stored locally in the browser's IndexedDB database.",
          "• OAuth credentials — on browsers where Chrome's built-in sign-in is unavailable (such as Brave and Vivaldi), connecting Google Drive makes TMS save a Google refresh token in the browser's local storage and keep the access token in session storage, which is cleared when the browser closes.",
        ],
      },
      {
        heading: "Purpose",
        body: [
          "Data is processed solely to enable backup, restoration and management of browsing sessions. No profiling, statistical analysis, advertising or any other processing for commercial purposes is performed.",
        ],
      },
      {
        heading: "Legal Basis",
        body: [
          "Processing is based on the user's explicit consent (Art. 6(1)(a) GDPR), expressed when activating the Google Drive backup feature and granting OAuth authorisation through their Google account.",
        ],
      },
      {
        heading: "Third Parties — Google Drive",
        body: [
          "TMS uses the Google Drive API to save backup files in the user's Google account. Backup files are transmitted directly between the user's browser and Google LLC's servers; Marvellous Codeworks neither receives nor accesses them. Google's Privacy Policy and Terms of Service apply (policies.google.com/privacy).",
          "• The OAuth scope requested is drive.appdata: TMS can access only a hidden, app-specific folder in the user's Drive account, not the other files stored on Drive.",
        ],
      },
      {
        heading: "Third Parties — Cloudflare",
        body: [
          "On browsers where Chrome's built-in sign-in is unavailable (such as Brave and Vivaldi), TMS obtains and renews its Google OAuth tokens through tms-oauth-proxy, a Cloudflare Worker operated by Marvellous Codeworks that adds the OAuth client secret and forwards the request to Google. This component is not used on Chrome.",
          "The authorization code, the refresh token and the access token returned by Google pass through the Worker, hosted by Cloudflare, Inc., only for the duration of each request. The Worker does not store these values, does not log the content of requests and responses, and never receives backup files or other Drive content.",
          "Cloudflare may process technical request metadata, such as IP address, date and time, and status code. Cloudflare's Privacy Policy applies (cloudflare.com/privacypolicy). The Worker's source code is public: github.com/Marvellous-Codeworks/tms-oauth-proxy.",
        ],
      },
      {
        heading: "Data Retention",
        body: [
          "Backup files on Google Drive remain in the user's account until manually or automatically deleted (by default TMS retains the last 10 automatic backups). Local data (settings, sessions) remains on the device until the extension is uninstalled or deleted via the settings. OAuth credentials saved locally are removed when the user disconnects their Google account from TMS or uninstalls the extension.",
        ],
      },
      {
        heading: "User Rights",
        body: [
          'Under Arts. 15–21 GDPR, users have the right to access their data, rectify or delete it, object to processing or request restriction, and withdraw consent at any time by revoking OAuth access from TMS settings or from the "Apps & services" section of their Google account.',
          "You may lodge a complaint with your local supervisory authority. In Italy: Garante per la Protezione dei Dati Personali — garanteprivacy.it.",
        ],
      },
      {
        heading: "Security",
        body: [
          "On Chrome, the OAuth token is managed by the browser. On the browsers described under \"Third Parties — Cloudflare\", tokens are kept in the extension's storage inside the browser. TMS never receives the user's Google password. Data transfer to Google Drive and to the Worker uses HTTPS encrypted connections.",
        ],
      },
      {
        heading: "Changes to this Policy",
        body: [
          "Any updates will be published at this URL. Continued use of the extension after updates are published constitutes acceptance of the changes.",
        ],
      },
      {
        heading: "Contact",
        body: [
          "For any privacy-related requests: privacy@marvellouscode.works",
          "For technical reports: github.com/gioxx/MarvellousSuspender/issues",
        ],
      },
    ],
  },
};

export const TMS_TERMS_CONTENT: LegalContent = {
  it: {
    title: "Termini di utilizzo",
    effectiveDate: "2026-11-05",
    sections: [
      {
        heading: "Accettazione dei termini",
        body: [
          'Installando o utilizzando The Marvellous Suspender ("TMS" o "l\'Estensione"), l\'utente accetta i presenti Termini di utilizzo. In caso di disaccordo, è pregato di non installare o di disinstallare l\'estensione.',
        ],
      },
      {
        heading: "Descrizione del servizio",
        body: [
          "TMS è un'estensione browser gratuita e open source per browser Chromium che consente di sospendere le schede inattive per ridurre l'utilizzo della memoria. L'estensione è fornita gratuitamente, senza pubblicità e senza garanzie di disponibilità continua.",
        ],
      },
      {
        heading: "Licenza",
        body: [
          "TMS è distribuita sotto licenza GNU General Public License versione 2 (GPLv2). Il codice sorgente è disponibile su github.com/gioxx/MarvellousSuspender. La GPLv2 conferisce agli utenti i diritti di eseguire, studiare, condividere e modificare il software secondo i termini della licenza stessa.",
        ],
      },
      {
        heading: "Uso di Google Drive",
        body: [
          "La funzione di backup su Google Drive è opzionale. Per utilizzarla, l'utente deve autenticarsi con il proprio account Google e autorizzare TMS ad accedere alla propria cartella nascosta su Drive (scope drive.appdata). L'utente è l'unico responsabile del proprio account Google e dei relativi dati. Si applicano i Termini di servizio di Google (policies.google.com/terms).",
        ],
      },
      {
        heading: "Esclusione di garanzie",
        body: [
          'TMS è fornita "così com\'è" (as is), senza garanzie di alcun tipo, espresse o implicite, incluse, a titolo esemplificativo e non esaustivo, le garanzie implicite di commerciabilità, idoneità per uno scopo particolare e non violazione di diritti di terzi, come previsto dalla licenza GPLv2.',
        ],
      },
      {
        heading: "Limitazione di responsabilità",
        body: [
          "Nei limiti consentiti dalla legge applicabile, Giovanni Solone (\"Marvellous Codeworks\") non è responsabile per la perdita di sessioni, schede o dati di navigazione; il malfunzionamento dell'estensione a seguito di aggiornamenti del browser; l'eliminazione o il danneggiamento di file su Google Drive; qualsiasi danno diretto, indiretto, incidentale o consequenziale derivante dall'uso o dall'impossibilità di utilizzare l'estensione.",
          "L'utente è responsabile del mantenimento di copie di backup indipendenti dei dati ritenuti importanti.",
        ],
      },
      {
        heading: "Comportamento dell'utente",
        body: [
          "L'utente si impegna a non utilizzare TMS per eludere restrizioni legali applicabili o per accedere a dati di terzi senza autorizzazione.",
        ],
      },
      {
        heading: "Modifiche ai termini",
        body: [
          "Giovanni Solone si riserva il diritto di modificare i presenti termini in qualsiasi momento. Le modifiche saranno pubblicate a questo URL. L'uso continuato dell'estensione dopo la pubblicazione costituisce accettazione.",
        ],
      },
      {
        heading: "Legge applicabile e foro competente",
        body: [
          "I presenti termini sono regolati dalla legge italiana. Per le controversie con consumatori si applica la normativa europea sulla risoluzione alternativa delle controversie (ADR/ODR) e la competenza del giudice del luogo di residenza del consumatore.",
        ],
      },
      {
        heading: "Contatti",
        body: ["privacy@marvellouscode.works", "github.com/gioxx/MarvellousSuspender/issues"],
      },
    ],
  },

  en: {
    title: "Terms of Use",
    effectiveDate: "2026-11-05",
    sections: [
      {
        heading: "Acceptance of Terms",
        body: [
          'By installing or using The Marvellous Suspender ("TMS" or "the Extension"), you accept these Terms of Use. If you disagree, please do not install or uninstall the extension.',
        ],
      },
      {
        heading: "Description of Service",
        body: [
          "TMS is a free, open-source browser extension for Chromium-based browsers that suspends inactive tabs to reduce memory usage. The extension is provided free of charge, with no advertising and no guarantee of continuous availability.",
        ],
      },
      {
        heading: "License",
        body: [
          "TMS is distributed under the GNU General Public License version 2 (GPLv2). Source code is available at github.com/gioxx/MarvellousSuspender. The GPLv2 grants users the right to run, study, share and modify the software under the terms of the license.",
        ],
      },
      {
        heading: "Google Drive Usage",
        body: [
          "The Google Drive backup feature is optional. To use it, you must authenticate with your Google account and authorise TMS to access its own hidden folder on Drive (scope drive.appdata). You are solely responsible for your Google account and its data. Google's Terms of Service apply (policies.google.com/terms).",
        ],
      },
      {
        heading: "No Warranty",
        body: [
          'TMS is provided "as is", without warranty of any kind, express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose and non-infringement, as set out in the GPLv2 license.',
        ],
      },
      {
        heading: "Limitation of Liability",
        body: [
          'To the extent permitted by applicable law, Giovanni Solone ("Marvellous Codeworks") is not liable for loss of sessions, tabs or browsing data; extension malfunction following browser updates; deletion or corruption of files on Google Drive; any direct, indirect, incidental or consequential damages arising from the use or inability to use the extension.',
          "You are responsible for maintaining independent backup copies of data you consider important.",
        ],
      },
      {
        heading: "User Conduct",
        body: [
          "You agree not to use TMS to circumvent applicable legal restrictions or to access third-party data without authorisation.",
        ],
      },
      {
        heading: "Changes to Terms",
        body: [
          "Giovanni Solone reserves the right to modify these terms at any time. Changes will be published at this URL. Continued use of the extension after publication constitutes acceptance.",
        ],
      },
      {
        heading: "Governing Law and Jurisdiction",
        body: [
          "These terms are governed by Italian law. For disputes with consumers, European alternative dispute resolution (ADR/ODR) rules apply and the courts of the consumer's place of residence have jurisdiction.",
        ],
      },
      {
        heading: "Contact",
        body: ["privacy@marvellouscode.works", "github.com/gioxx/MarvellousSuspender/issues"],
      },
    ],
  },
};
