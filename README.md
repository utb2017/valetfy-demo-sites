# valetfy-demo-sites

Multi-tenant demo website renderer for the Valetfy demo-sites wedge lane.

- **Dev Firebase:** `valetfy-main-dev` (`demoSites` collection)
- **Dev domains:** `*.dev.sites.valetfy.com`
- **Plan:** [docs/demo-sites-wedge-plan.md](./docs/demo-sites-wedge-plan.md)

## Quick start

```bash
cp .env.example .env.local
# Fill FIREBASE_ADMIN_* from valetfy .env.dev-preview

npm install
npm run seed
npm run dev
```

Local tenant URLs (add to hosts or use `.localhost`):

- http://scott.localhost:3000
- http://woof-wash.localhost:3000

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server |
| `npm run seed` | Upsert `scott` + `woof-wash` into Firestore |
| `npm run build` | Production build |

## Vercel

Project name: **`valetfy-demo-sites`**. Add wildcard domain `*.dev.sites.valetfy.com`.

## Guardrails

This repo is isolated from the core `valetfy` app. Do not import console/terminal/guest code from the main monolith.
