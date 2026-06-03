# Cloudflare deployment guide

This app is split into:

- `frontend/`: Create React App static site.
- `backend/`: FastAPI + MongoDB API used by booking, quote, admin, and GLB model endpoints.

Cloudflare Pages is the right place to deploy the frontend. The Python backend
cannot run on Cloudflare Pages as-is, so keep it hosted on a reachable backend
platform (or migrate it separately to Workers/D1 later) and point the Pages API
proxy at that backend.

## Recommended production shape

- Website: `https://www.your-domain.com` or `https://chauffeur.your-domain.com`
  on Cloudflare Pages.
- Backend API: any HTTPS backend origin running `backend/server.py`, for example
  `https://api-origin.example.com`.
- Cloudflare Pages runtime variable: `BACKEND_URL=https://api-origin.example.com`
  (do not include `/api` at the end).

The frontend calls `/api/...` on the same domain. `frontend/functions/api/[[path]].js`
proxies those requests to `BACKEND_URL`, which avoids browser CORS issues.

## Git-connected Pages deploy

Use these settings in Cloudflare dashboard under **Workers & Pages** -> **Create
application** -> **Pages** -> **Import an existing Git repository**:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Root directory | `frontend` |
| Build command | `npm run build:cloudflare` |
| Build output directory | `build` |

Then add this Pages variable in **Settings** -> **Variables and Secrets** for
both Production and Preview:

| Variable | Value |
| --- | --- |
| `BACKEND_URL` | Your backend origin, for example `https://api-origin.example.com` |

Leave `REACT_APP_BACKEND_URL` unset when using the Pages proxy.

## Direct upload deploy with Wrangler

Run this from a machine that is logged in to Cloudflare:

```bash
cd frontend
npm install
npx wrangler login
npx wrangler pages project create bb-chauffeur --production-branch main
npm run deploy:cloudflare -- --project-name bb-chauffeur --branch main
```

After the first deploy, set `BACKEND_URL` in the Cloudflare Pages dashboard and
redeploy so `/api/*` requests can reach the backend.

## Custom subdomain

1. Make sure your root domain is active in Cloudflare DNS.
2. Open your Pages project.
3. Go to **Custom domains** -> **Set up a custom domain**.
4. Enter the subdomain, for example `chauffeur.your-domain.com` or
   `www.your-domain.com`.
5. Let Cloudflare create/verify the DNS record.

If you choose direct browser API calls instead of the Pages proxy, set
`REACT_APP_BACKEND_URL=https://api.your-domain.com` at build time and configure
the backend with:

```bash
CORS_ORIGINS=https://chauffeur.your-domain.com
```

## Backend production variables

The FastAPI backend needs these environment variables on the backend host:

```bash
MONGO_URL=mongodb+srv://...
DB_NAME=chauffeur
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=replace-with-a-strong-password
CORS_ORIGINS=https://chauffeur.your-domain.com
```

Do not use the default admin password in production.
