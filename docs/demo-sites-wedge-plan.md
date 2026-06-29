# Demo Sites Wedge — Implementation Plan

**Lane:** Fast, polished small-business websites on Valetfy-controlled subdomains (SEO/backlink assets), later gated behind a direct Stripe subscription that unlocks DNS/custom-domain export.

**Status:** Phase 0–1 foundation (this doc). Phases 2–3 are follow-up prompts.

---

## Repo decision: separate `valetfy-demo-sites` project

**Chosen:** Standalone repo + Vercel project `valetfy-demo-sites`, **not** routes inside `valetfy`.

| Factor | Separate repo | Isolated routes in `valetfy` |
|--------|---------------|------------------------------|
| Per-customer assets/build | Own deploy surface; no risk to core hardening | Bloated monolith; couples demo deploys to console releases |
| Guardrails | Zero touch on terminal/console/guest flows | Easy to accidentally import console code or share middleware |
| Wildcard DNS | Clean `*.dev.sites.valetfy.com` → one Vercel project | Conflicts with existing dev app domains |
| Reversibility | Delete repo + Vercel project | Revert large diff across `app/`, `lib/`, middleware |

**Shared infra (same company):**

- Firebase Auth + Firestore **`demoSites`** collection → **`valetfy-main-dev`** (dev), prod TBD
- Stripe account → Valetfy direct subscription (Phase 2); fields stubbed now
- SSO → same Firebase Auth users as core app

**Core `valetfy` repo:** untouched in this phase.

---

## Architecture

```
*.dev.sites.valetfy.com  →  Vercel (valetfy-demo-sites)
         │
         ▼
   middleware: host → slug (siteId)
         │
         ▼
   Server Component: adminDb.doc(`demoSites/{slug}`)
         │
         ▼
   Block renderer (theme + content blocks)
         │
         ├── robots: noindex,nofollow (all demo subdomains)
         ├── footer: "Powered by Valetfy" → https://valetfy.com
         └── claim bar stub: "Claim this site — coming soon"
```

**Factory model:** one Next.js app, one doc per tenant in `demoSites/{siteId}`. Add client = add Firestore doc (+ optional RDAP registrar on create).

---

## Firestore `demoSites/{siteId}`

| Field | Type | Phase |
|-------|------|-------|
| `businessName` | string | 1 |
| `slug` | string | 1 |
| `owner` / contact | object | 1 |
| `sourceUrl` | string? | 1 |
| `registrar` | string? | 1 (RDAP at seed/create) |
| `status` | `draft\|demo\|live\|sold\|archived` | 1 |
| `generatedPages` | string[] | 1 |
| `theme` | object | 1 |
| `contentBlocks` | array | 1 |
| `backlinkEnabled` | boolean | 1 |
| `subscriptionStatus` | string? | stub |
| `stripeCustomerId` | string? | stub |
| `stripeSubscriptionId` | string? | stub |
| `dnsRevealUnlocked` | boolean | stub (false) |
| `createdAt` / `updatedAt` | timestamp | 1 |

Renderer reads via **Firebase Admin SDK** (server-only). No client Firestore reads in Phase 1.

---

## Domains

| Env | Pattern | Notes |
|-----|---------|-------|
| Dev | `*.dev.sites.valetfy.com` | Wildcard CNAME → Vercel |
| Prod (later) | `*.sites.valetfy.com` | Same renderer; indexable only on customer-owned domain post-purchase |

Do **not** reuse the four existing dev app domains (`dev.valetfy.com`, etc.).

---

## Phase roadmap

### Phase 1 — Foundation (this prompt) ✅

- [x] Multi-tenant renderer + middleware
- [x] Dev Firebase wiring (`valetfy-main-dev`)
- [x] Vercel config + wildcard domain docs
- [x] noindex + Powered by Valetfy backlink
- [x] Claim bar stub (no Stripe/DNS)
- [x] Seed tenants: `scott`, `woof-wash`
- [x] RDAP registrar lookup in seed/create path

### Phase 2 — Monetization (next prompt)

- Stripe Checkout / subscription (direct to Valetfy, not Connect destination)
- On paid: `dnsRevealUnlocked = true`
- Registrar-aware DNS reveal guides

### Phase 3 — Admin (later prompt)

- Dual-toggle dashboard (demo vs live admin)
- Analytics hooks

---

## Vercel setup (operator)

1. Import GitHub repo `utb2017/valetfy-demo-sites` → project name **`valetfy-demo-sites`**
2. Env vars (from `valetfy` dev preview): all `FIREBASE_ADMIN_*`, optional `NEXT_PUBLIC_FIREBASE_*` for future client auth
3. Domains: add `dev.sites.valetfy.com` and wildcard `*.dev.sites.valetfy.com` (Vercel DNS or Porkbun CNAME to `cname.vercel-dns.com`)
4. Deploy `main`

---

## Local dev

```bash
cp .env.example .env.local   # or symlink valetfy .env.dev-preview vars
npm install
npm run seed                 # writes demoSites docs to valetfy-main-dev
npm run dev                  # http://scott.localhost:3000
```

---

## Explicit non-goals (Phase 1)

- No changes to `valetfy` main/console/terminal/guest routes
- No prod Firebase, prod domains, or live Stripe
- No Stripe checkout, DNS reveal UI, admin dashboard, or analytics
