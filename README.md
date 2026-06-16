# Marvellous Codeworks — Home

Official website for [Marvellous Codeworks](https://github.com/Marvellous-Codeworks), home of two open-source Chromium extensions (for now! 🙃):

- **The Great-er Tab Discarder** — discards inactive tabs to reclaim memory
- **The Marvellous Suspender** — suspends tabs with configurable rules and session management

## Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) (file-based routing) |
| UI | React 19, [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives), Tailwind CSS v4 |
| Data fetching | TanStack Query, server functions |
| Runtime | [Bun](https://bun.sh/) |
| Build | Vite 8 |
| Language | TypeScript |

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
  routes/          # File-based routes (index.tsx → /, tgd.tsx → /tgd, tms.tsx → /tms)
  components/      # Shared UI components
  lib/             # Server functions (extension stats, GitHub stats) and i18n
  assets/          # Images and static assets
  styles.css       # Global styles
```

See [src/routes/README.md](src/routes/README.md) for routing conventions.
