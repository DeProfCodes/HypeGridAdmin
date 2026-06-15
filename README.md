# HypeGrid Admin Portal

The internal admin/portal dashboard for **HypeGrid**. Built with Vite + React,
Tailwind, and shadcn/ui.

## What it does

- JWT auth against the HypeGrid backend (login, `/api/auth/me`, refresh, logout).
- A self-contained **demo mode** ("Explore demo") that runs entirely on bundled
  mock data with no backend calls — useful for presentations.
- Manages campaigns, campaign requests, enquiries, clients, creators,
  deliverables, quotes, invoices/payments, payouts, reports, team/users, and
  settings.

## Architecture

```
src/api/       HTTP client (auth + refresh), per-resource API clients,
               hypegridClient.js (mode-aware data + auth service)
src/data/mock/ demo-mode datasets + in-memory entity store
src/stores/    Zustand stores + global mock/live config
src/app/config/ env-driven runtime config (API base URL, flags)

Pages/components → hypegrid data service / stores → API clients or mock data
```

Pages never call the API directly — they go through `hypegrid.entities.*` /
`hypegrid.auth.*` (`src/api/hypegridClient.js`) or the stores, which switch
between live API and mock data based on the current mode.

## Modes

- **Real mode** — log in with backend credentials. Tokens are stored and attached
  as `Authorization: Bearer`; the session refreshes on 401.
- **Demo mode** — the "Explore demo" button seeds mock data and runs offline.

Dev backend SuperAdmin (development only — change before production):

```
admin@hypegrid.co.za
ChangeMe123!
```

## Local development

```bash
npm install
cp .env.example .env     # then edit VITE_HYPEGRID_API_BASE_URL
npm run dev
```

## Environment

The API base URL is **always** env-driven (`VITE_HYPEGRID_API_BASE_URL`) and never
hardcoded. See `.env.example` for all variables.

## Production build

```bash
npm run build     # outputs dist/
npm run preview   # preview dist/ locally
```

## Deployment

Deploys to Vercel as a static SPA. See [`DEPLOYMENT.md`](./DEPLOYMENT.md).
