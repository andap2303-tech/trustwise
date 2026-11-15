# Trustwise · demo website

Live: **https://trustwise1.netlify.app/**

React 19 + Vite + TypeScript + Tailwind CSS + Recharts. Everything runs in the browser; nothing is stored on a server.
All numbers come from the project notebook (`../notebook/Trustwise_Project.ipynb`); the constants are in `src/lib/engine.ts`.

## Pages
`/` home · `/check` 16-question reserves check · `/results` board summary · `/learn` trustee guide and methodology ·
`/pricing` plans and Board-plan demo · `/partners` for accountants · `/about` · `/faq`

## Run locally
```bash
npm install
npm run dev      # local preview
npm run build    # creates dist/
```

## Deployment
The site is hosted on Netlify. Settings are in `netlify.toml` (base directory `website`, build `npm run build`, publish `dist`).
