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
    effectiveDate: "2026-07-01",
    sections: [
      {
        heading: "Titolare del trattamento",
        body: [
          'Giovanni Solone ("Marvellous Codeworks")',
          "E-mail: privacy@marvellouscode.works",
        ],
      },
      {
        heading: "Dati trattati",
        body: [
          'The Marvellous Suspender (di seguito "TMS" o "l\'Estensione") non raccoglie, trasmette né condivide alcun dato con server di Marvellous Codeworks. I dati restano esclusivamente sul dispositivo dell\'utente o nel suo account Google Drive personale.',
          "• URL delle schede e struttura delle sessioni — quando la funzione di backup su Google Drive è abilitata, TMS salva un file JSON contenente gli URL delle schede aperte e la struttura delle finestre e dei gruppi. Il file viene scritto direttamente nell'account Google Drive dell'utente.",
          "• Impostazioni dell'estensione — memorizzate localmente tramite chrome.storage.local.",
          "• Cronologia delle sessioni — memorizzata localmente nel database IndexedDB del browser.",
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
          "TMS utilizza le API di Google Drive per salvare i file di backup nell'account Google dell'utente. I dati vengono trasmessi direttamente tra il browser dell'utente e i server di Google LLC; Marvellous Codeworks non riceve né accede a tali dati. Si applicano la Privacy Policy e i Termini di servizio di Google (policies.google.com/privacy).",
          '• Lo scope OAuth richiesto è drive.file: TMS può accedere esclusivamente ai file che esso stesso ha creato nella cartella "TMS Backups" dell\'account Drive dell\'utente.',
        ],
      },
      {
        heading: "Conservazione dei dati",
        body: [
          "I file di backup su Google Drive restano nell'account dell'utente fino alla loro eliminazione manuale o automatica (TMS conserva al massimo gli ultimi 10 backup automatici). I dati locali (impostazioni, sessioni) restano sul dispositivo fino alla disinstallazione dell'estensione o alla loro cancellazione tramite le impostazioni.",
        ],
      },
      {
        heading: "Diritti degli interessati",
        body: [
          'Ai sensi degli artt. 15–21 del GDPR, l\'utente ha il diritto di accedere ai propri dati, rettificarli o cancellarli, opporsi al trattamento o richiederne la limitazione, revocare il consenso in qualsiasi momento revocando l\'accesso OAuth dalla pagina di impostazioni di TMS o dalla sezione "App e servizi" del proprio account Google.',
          "L'utente può proporre reclamo all'autorità di controllo competente. In Italia: Garante per la Protezione dei Dati Personali — garanteprivacy.it.",
        ],
      },
      {
        heading: "Sicurezza",
        body: [
          "Il token OAuth è gestito dal browser Chrome; TMS non memorizza credenziali. Il trasferimento dei dati verso Google Drive avviene tramite connessioni HTTPS cifrate.",
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
    effectiveDate: "2026-07-01",
    sections: [
      {
        heading: "Data Controller",
        body: [
          'Giovanni Solone ("Marvellous Codeworks")',
          "E-mail: privacy@marvellouscode.works",
        ],
      },
      {
        heading: "Data We Process",
        body: [
          'The Marvellous Suspender ("TMS" or "the Extension") does not collect, transmit or share any data with Marvellous Codeworks servers. All data remains exclusively on the user\'s device or in their personal Google Drive account.',
          "• Tab URLs and session structure — when the Google Drive backup feature is enabled, TMS saves a JSON file containing the URLs of open tabs and the window/group structure. The file is written directly to the user's Google Drive account.",
          "• Extension settings — stored locally via chrome.storage.local.",
          "• Session history — stored locally in the browser's IndexedDB database.",
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
          "TMS uses the Google Drive API to save backup files in the user's Google account. Data is transmitted directly between the user's browser and Google LLC's servers; Marvellous Codeworks neither receives nor accesses this data. Google's Privacy Policy and Terms of Service apply (policies.google.com/privacy).",
          '• The OAuth scope requested is drive.file: TMS can access only the files it has created in the "TMS Backups" folder of the user\'s Drive account.',
        ],
      },
      {
        heading: "Data Retention",
        body: [
          "Backup files on Google Drive remain in the user's account until manually or automatically deleted (TMS retains at most the last 10 automatic backups). Local data (settings, sessions) remains on the device until the extension is uninstalled or deleted via the settings.",
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
          "The OAuth token is managed by the Chrome browser; TMS does not store credentials. Data transfer to Google Drive uses HTTPS encrypted connections.",
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
    effectiveDate: "2026-07-01",
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
          "La funzione di backup su Google Drive è opzionale. Per utilizzarla, l'utente deve autenticarsi con il proprio account Google e autorizzare TMS ad accedere ai file da essa creati (scope drive.file). L'utente è l'unico responsabile del proprio account Google e dei relativi dati. Si applicano i Termini di servizio di Google (policies.google.com/terms).",
        ],
      },
      {
        heading: "Esclusione di garanzie",
        body: [
          'TMS è fornita "così com\'è" (as is), senza garanzie di alcun tipo, espresse o implicite, incluse, a titolo esemplificativo e non esaustivo, le garanzie implicite di commerciabilità, idoneità per uno scopo particolare e non violazione di diritti di terzi, ai sensi dell\'art. 11 della GPLv2.',
        ],
      },
      {
        heading: "Limitazione di responsabilità",
        body: [
          'Nei limiti consentiti dalla legge applicabile, Giovanni Solone ("Marvellous Codeworks") non è responsabile per la perdita di sessioni, schede o dati di navigazione; il malfunzionamento dell\'estensione a seguito di aggiornamenti del browser; l\'eliminazione o il danneggiamento di file su Google Drive; qualsiasi danno diretto, indiretto, incidentale o consequenziale derivante dall\'uso o dall\'impossibilità di utilizzare l\'estensione.',
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
        body: [
          "privacy@marvellouscode.works",
          "github.com/gioxx/MarvellousSuspender/issues",
        ],
      },
    ],
  },

  en: {
    title: "Terms of Use",
    effectiveDate: "2026-07-01",
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
          "The Google Drive backup feature is optional. To use it, you must authenticate with your Google account and authorise TMS to access the files it creates (scope drive.file). You are solely responsible for your Google account and its data. Google's Terms of Service apply (policies.google.com/terms).",
        ],
      },
      {
        heading: "No Warranty",
        body: [
          'TMS is provided "as is", without warranty of any kind, express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose and non-infringement, pursuant to GPLv2 §11.',
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
        body: [
          "privacy@marvellouscode.works",
          "github.com/gioxx/MarvellousSuspender/issues",
        ],
      },
    ],
  },
};
