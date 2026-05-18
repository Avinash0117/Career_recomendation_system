# Deploying CareerPath.AI

You deploy **two pieces**: the FastAPI API and the static Vite frontend. The browser must be allowed to call the API (CORS) and the frontend must be built with the **public API URL** baked in (`VITE_API_BASE_URL`).

---

## 1. Backend (API)

### Option A — Render (Docker)

1. Push this repo to GitHub.
2. In [Render](https://render.com) → **New** → **Blueprint** → connect the repo.
3. Render reads `render.yaml` at the **repository root** (`job_job/render.yaml`).
4. After the service is live, copy its URL, e.g. `https://careerpath-api-xxxx.onrender.com`.
5. In the Render service → **Environment** → set:
   - `CORS_ORIGINS` = your frontend origin(s), comma-separated, e.g. `https://your-app.vercel.app`  
     (no trailing slash; no `*` in production if you use cookies later).

**Checks:** `GET /health` and `GET /docs` on your API URL.

### Option B — Docker anywhere

From `career-recommendation-system/backend`:

```bash
docker build -t careerpath-api .
docker run -p 8000:8000 -e CORS_ORIGINS=https://your-frontend.example careerpath-api
```

Use `-e PORT=8080` if the host expects another port.

---

## 2. Frontend (static site)

Build: `npm ci && npm run build` inside `career-recommendation-system/frontend`.

**Required environment variable at build time:**

| Variable | Example |
|----------|---------|
| `VITE_API_BASE_URL` | `https://careerpath-api-xxxx.onrender.com` |

Copy `frontend/.env.example` to `frontend/.env` locally, or set the variable in **Vercel / Netlify / Cloudflare Pages** project settings before building.

### Vercel

1. **New Project** → import repo.
2. **Root Directory:** `career-recommendation-system/frontend`
3. **Build:** `npm run build` (default), **Output:** `dist`
4. **Environment Variables:** `VITE_API_BASE_URL` = your Render API URL (no trailing slash).
5. `vercel.json` is included for SPA routing.

### Netlify

Same root directory and build; `public/_redirects` handles SPA fallback.

---

## 3. Order of operations

1. Deploy **API** first → note the URL.
2. Set **`CORS_ORIGINS`** on the API to the exact frontend URL(s).
3. Deploy **frontend** with **`VITE_API_BASE_URL`** pointing at the API.
4. Redeploy the frontend if you change the API URL (Vite inlines env at build time).

---

## 4. Cold starts & NLTK

The first API request after idle may download NLTK data and load the model; on free tiers this can take **30–90 seconds**. Subsequent requests are faster. For production hardening you could bake NLTK corpora into the image or run a warm-up job—optional follow-up.
