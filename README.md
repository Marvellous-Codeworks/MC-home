# Marvellous Codeworks — Home

Official website for [Marvellous Codeworks](https://github.com/Marvellous-Codeworks), a small team building open-source software, from Chromium extensions to self-hostable utilities. The site showcases the projects, pulls live stats from GitHub and the extension stores, surfaces the latest posts from the [blog](https://kb.marvellouscode.works/blog), and hosts the TMS bug-report flow.

Projects currently featured:

- **[The Great-er Tab Discarder](https://www.marvellouscode.works/tgd)**: Chromium extension that discards inactive tabs to reclaim memory
- **[The Marvellous Suspender](https://www.marvellouscode.works/tms)**: Chromium extension that suspends tabs with configurable rules, session management and backups
- **[logdrop](https://www.marvellouscode.works/logdrop)**: self-hostable, PrivateBin-style plain-text drop-off for sharing diagnostic reports privately

Documentation for every project lives in the knowledge base at [kb.marvellouscode.works](https://kb.marvellouscode.works).

## Stack

| Layer         | Technology                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| Framework     | [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) (file-based routing) |
| UI            | React 19, [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives), Tailwind CSS v4                               |
| Data fetching | TanStack Query, server functions                                                                                   |
| Markdown      | react-markdown + remark-gfm (GitHub release notes)                                                                 |
| Runtime       | [Bun](https://bun.sh/)                                                                                             |
| Build         | Vite 8                                                                                                             |
| Language      | TypeScript                                                                                                         |

## Getting started

```bash
bun install
bun run dev
```

Other scripts:

```bash
bun run build      # production build
bun run preview    # preview production build locally
bun run lint       # ESLint
bun run format     # Prettier
```

## Project structure

```
src/
  routes/          # File-based routes: / (home), /tgd, /tms, /logdrop, TMS legal pages
                   # and the /tms/report bug-report flow (+ /api/report endpoints)
  components/      # Shared UI components (nav, footer, galleries, release notes, ...)
  lib/             # Server functions (extension/GitHub stats and releases, blog posts,
                   # bug reports) and i18n (EN/IT)
  assets/          # Images and static assets
  styles.css       # Global styles
```

See [src/routes/README.md](src/routes/README.md) for routing conventions.
