# Trustwise · Charity Investment Copilot (demo website)

React 19 + Vite + TypeScript + Tailwind v4 + Recharts. All numbers come from `Trustwise_Project.ipynb`
(constants in `src/lib/engine.ts`). Everything runs in the browser; nothing is stored on a server.

## Pages
`/` home · `/check` 16-question reserves check · `/results` board summary · `/learn` trustee guide + methodology ·
`/pricing` plans + Board demo unlock · `/partners` accountants · `/about` · `/faq`

## Run locally
    npm install
    npm run dev

## Publish anonymously on GitHub Pages
1. Create a NEW GitHub account with no names (e.g. `trustwise-team`) and a public repo `trustwise`.
2. Upload the CONTENTS of the `dist/` folder (index.html + assets/ + favicon.svg) to the repo root.
3. Settings → Pages → Source: "Deploy from a branch" → branch `main`, folder `/ (root)` → Save.
4. After ~1 minute the site is live at `https://trustwise-team.github.io/trustwise/`.
   Put that link in `DEMO_URL` in the notebook.

To rebuild after edits: `npm run build` → upload the new `dist/` contents.
