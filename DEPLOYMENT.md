# HypeGrid Admin Portal — Deployment (Vercel)

The internal admin/portal dashboard. A Vite + React SPA with JWT auth against the
HypeGrid backend plus a self-contained **demo mode** ("Explore demo") that runs on
bundled mock data with no backend calls. The page layer never talks to the API
directly — it goes through the HypeGrid data service (`src/api/hypegridClient.js`)
and the stores.

## Vercel project settings

| Setting           | Value           |
| ----------------- | --------------- |
| Framework Preset  | Vite            |
| Build Command     | `npm run build` |
| Output Directory  | `dist`          |
| Install Command   | `npm install`   |
| Node.js Version   | 20.x (or 18.x)  |

`vercel.json` configures SPA routing (all paths rewrite to `/index.html`) so
`/campaigns`, `/clients/:id`, etc. work on hard refresh / deep links.

## Environment variables

Set in **Vercel → Project → Settings → Environment Variables**. See `.env.example`.

| Variable                       | Example                        | Notes                                                       |
| ------------------------------ | ------------------------------ | ----------------------------------------------------------- |
| `VITE_HYPEGRID_API_BASE_URL`   | `https://api.hypegrid.co.za`   | Backend base URL. **Required.** Never hardcoded in code.    |
| `VITE_HYPEGRID_USE_MOCKS`      | `false`                        | `true` boots straight into demo/mock mode.                  |
| `VITE_ENABLE_API_LOGGING`      | `false`                        | Verbose API logging in the console. Keep `false` in prod.   |

> All build-time env vars must be prefixed `VITE_` to reach the client.

## Auth

- **Real mode** — login posts to `/api/auth/login`, stores `access_token` /
  `refresh_token`, calls `/api/auth/me`, attaches `Authorization: Bearer`, and
  refreshes on 401. Logout revokes the refresh token.
- **Demo mode** — the "Explore demo" button seeds mock data and flips mock mode
  on with no backend calls. Useful for presentations.

Dev backend SuperAdmin (development only — change before production):

```
admin@hypegrid.co.za
ChangeMe123!
```

## Backend CORS reminder

After deploying, the backend must allow the portal's origin(s) in CORS. See
[`HypeGrid/docs/CORS_AND_DEPLOYMENT.md`](../HypeGrid/docs/CORS_AND_DEPLOYMENT.md).
Expected production origins:

```
https://portal.hypegrid.co.za
https://admin.hypegrid.co.za
```

Allow Vercel preview `*.vercel.app` URLs too if you need real login from previews.

## Test the production build locally

```bash
npm install
npm run build
npm run preview   # serves dist/ at http://localhost:4173
```

Verify: demo login works offline; with `VITE_HYPEGRID_API_BASE_URL` pointed at a
running backend, real login + dashboard + CRUD pages load live data, and items
submitted from the public website (campaign requests, enquiries, creator
applications) appear in the portal.
