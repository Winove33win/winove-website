Deploy to Plesk
===============

What is included
- `dist-for-deploy.zip` — Vite production build (contains `index.html` and `assets/`).
- `backend/index.js` — serves the build from `backend/dist`.
- `backend/scripts/generate-sitemap.mjs` — grava `sitemap.xml` no caminho consumido pelo `robots.txt`.

Goal
- After each pull from GitHub, Plesk runs the Node app and it serves the built frontend from `backend/dist` without manual tweaks.

Recommended steps (Plesk GUI)
1. Open Domains → your domain → File Manager.
2. Go to the app root that contains `backend/index.js`.
3. Upload `dist-for-deploy.zip` (or keep `backend/dist` tracked in Git if you prefer).
4. Extract it so you have:
   - `backend/dist/index.html`
   - `backend/dist/assets/...`
5. In Domains → Node.js, restart the application.

After the deploy script finishes, confirm that `/httpdocs/sitemap.xml` exists (gerado pelo `npm --prefix backend run sitemap`) para que o arquivo indicado no `robots.txt` (`https://winove.com.br/sitemap.xml`) continue acessível.

Notes
- The server maps `/assets/*` to `backend/dist/assets` and serves `backend/dist/index.html` for SPA routes.
- If assets 404 or load as `text/html`, make sure the files exist in `backend/dist/assets` and that the Node process restarted.
- Adjust CSP in `backend/index.js` if you add new external sources.
- Keep the environment variables in `backend/.env` (copy `backend/.env.example` and adjust values). Loading from that path avoids
  the "Missing required database environment variables" error when Plesk starts the app from a different working directory.
- Minimum variables to define in `backend/.env`:
  - Database: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (and optionally `DB_CONN_LIMIT`).
  - Server/Base URLs: `APP_BASE_URL`, `PUBLIC_BASE_URL`, `PORT` (if Passenger does not inject it).
  - Proposals panel: `COMMERCIAL_PANEL_PASSWORD` (and optionally `COMMERCIAL_PANEL_USERNAME`).
  - Email: `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM`, `CONTACT_EMAIL`.
- Before running `npm --prefix backend run sitemap`, set the following environment variables: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` (optionally `DB_PORT`, defaulting to `3306`). All four required variables must be present or the script will exit with an error.
- Protect the commercial proposals panel by defining `COMMERCIAL_PANEL_PASSWORD` (and optionally `COMMERCIAL_PANEL_USERNAME`) in the environment; without the password the route `/comercial-propostas` will return 404.

