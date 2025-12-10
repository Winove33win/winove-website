Deploy to Plesk
===============

What is included
- `dist-for-deploy.zip` — Vite production build (contains `index.html` and `assets/`).
- `backend/index.js` — serves the build from `backend/dist`.
- `backend/scripts/generate-sitemap.mjs` — grava `sitemap.xml` no caminho consumido pelo `robots.txt`.

Goal
- After each pull from GitHub, Plesk runs the Node app and it serves the built frontend from `backend/dist` without manual tweaks.
- Before deploying or merging, run `npm --prefix backend run check:merge-markers` to ensure no Git conflict markers (`<<<` or `>>>`) remain in the working tree.

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
- Before running `npm --prefix backend run sitemap`, set the following environment variables: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` (optionally `DB_PORT`, defaulting to `3306`). All four required variables must be present or the script will exit with an error.

