# Task: Load Scott's REAL site on scott.dev.sites.valetfy.com (kill the handyman placeholder)

## Problem
https://scott.dev.sites.valetfy.com/ currently renders the generic block template with **wrong filler** — "Scott's Home Services / handyman / drywall / Central Coast." That is the wrong business. Scott is **Scott's Mobile Dog Grooming** (cage-free mobile dog grooming, greater Austin TX). Load his real site, mirroring how woof-wash got a premium template (`/t/woof-wash`).

Brand: **`Valetfy`** exactly.

## Already staged for you (verbatim — do not edit the markup)
- `public/scott/index.html` — Scott's **real site, copied verbatim**, asset URLs pointed at his live deploy (`scotts-mobile-grooming.vercel.app`), `noindex` added, mobile sticky bar hidden. It is served same-origin at **`/scott/`**. `public/scott/privacy.html` too.
- Confirm it renders: open `/scott/` on a preview — you should see the navy/blue dog-grooming site (hero "Happy Dogs, Hassle-Free Grooming"), pricing, service-area map, reviews, "Powered by Valetfy" footer.

## Why an iframe (not injection)
Scott's site is hand-written vanilla CSS. Its class names (`.hero`, `.head`, `.band`, `.btn`, `.section`…) **collide** with the block renderer's `app/globals.css`. Injecting his HTML into the React tree would mangle his layout. So render his site in a **same-origin iframe** (`/scott/`) and overlay the demo's existing `ClaimBar`. Same-origin ⇒ no X-Frame-Options problem; the claim/gift flow keeps working because `ClaimBar` stays in the parent (same `AuthProvider`, same `/api/claim/*`).

## Step 1 — `app/t/scott/layout.tsx` (NEW)
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function ScottLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
```

## Step 2 — `app/t/scott/page.tsx` (NEW)
```tsx
import { notFound } from "next/navigation";

import { ClaimBar } from "@/components/ClaimBar";
import { PageViewTracker } from "@/components/analytics/trackDemoSiteEvent";
import { getDemoSiteBySlug } from "@/lib/getDemoSite";

export const dynamic = "force-dynamic";

// Scott's real site is served verbatim at /scott/ (public/scott/index.html).
// Frame it same-origin and overlay the demo gift/claim bar. Do NOT inject his
// HTML into this React tree — his vanilla CSS collides with the block globals.
export default async function ScottPage() {
  const site = await getDemoSiteBySlug("scott");
  if (!site || site.status === "archived") notFound();

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <PageViewTracker siteId={site.siteId} />
      <iframe
        src="/scott/"
        title="Scott's Mobile Dog Grooming"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
      />
      <ClaimBar site={site} />
    </div>
  );
}
```
- `ClaimBar` renders fixed at the bottom (via `.claim-bar` in globals) and overlays the iframe. If Scott's footer feels cut off, set the iframe `bottom` to ~`56px` and keep the claim bar below — your call, but keep the bar visible.

## Step 3 — `middleware.ts` (edit the existing set)
There is already `const CUSTOM_TEMPLATE_SLUGS = new Set(["woof-wash"]);`. Add scott:
```ts
const CUSTOM_TEMPLATE_SLUGS = new Set(["woof-wash", "scott"]);
```
(The existing `pathname === "/"` guard + rewrite to `/t/${slug}` already handle it — no other middleware change.)

## Step 4 — Fix the lying tenant doc (it's wrong + serializes into the page payload)
`scripts/seedData.ts` has Scott as "Scott's Home Services" with handyman blocks and an `(805)` number. The iframe means those blocks aren't rendered, BUT the doc still feeds `ClaimBar` + the admin panel + the serialized payload. Make the doc truthful. Update the **`scott`** entry's fields (and do a **targeted** doc update — do NOT full-reseed, that would disturb woof-wash's runtime state):
- `businessName`: `Scott's Mobile Dog Grooming`
- `owner`: `{ name: "Scott", email: "scottsmobilegrooming@gmail.com", phone: "(512) 710-0025" }`
- `sourceUrl`: `https://www.scottsmobilegrooming.com`
- keep `monetization: "gift"`, `status: "demo"` (or `"gifted"`), `backlinkEnabled: true`
- Replace the handyman `contentBlocks` with real ones (used only for payload truthfulness now):
  - hero: headline `Happy Dogs, Hassle-Free Grooming — Right to Your Doorstep`, sub `Cage-free, one-on-one mobile dog grooming that comes to your door across Round Rock, Austin & Pflugerville, TX.`, ctaLabel `Book Now`, ctaHref `https://booking.moego.pet/ol/book?name=ScottsMobileDogGrooming`
  - about: `We're dog people` / one-on-one cage-free mobile grooming, greater Austin metro.
  - services: Full-Service Groom (`$120–$220 by size`), Short-Hair Bath Only (`$90–$155`), De-Shedding / Nail Trim / Ear Cleaning add-ons.
  - contact: phone `(512) 710-0025`, email `scottsmobilegrooming@gmail.com`, address `Round Rock · Austin · Pflugerville, TX (mobile — we come to you)`, hours `By appointment`.

## Step 5 — Verify + deploy
- `npm run build` must pass.
- Deploy a preview, then promote (`vercel deploy --prod`). The `scott.dev.sites.valetfy.com` domain + cert already exist.
- **Acceptance test:**
  - `https://scott.dev.sites.valetfy.com/` shows the **navy/blue dog-grooming site** — hero "Happy Dogs, Hassle-Free Grooming," real pricing ($120+), service-area map, "Book Now" → MoeGo, "Powered by Valetfy" footer.
  - **No** handyman / drywall / "Central Coast" content anywhere.
  - The bottom gift bar shows: **"This site's yours — free, courtesy of Valetfy → Claim it"**.
  - `/scott/` (the framed doc) returns 200 and images load.
  - woof-wash + other tenants + `/admin` unchanged.

## Guardrails
- Do NOT touch the woof-wash template, the block renderer, `AuthProvider`, Stripe, or other tenants.
- Do NOT inject Scott's HTML into the React tree (iframe only — CSS isolation).
- `Valetfy` spelled exactly. Demo stays `noindex`.
- Scott is a **gift** (`monetization: "gift"`) — never a paid/$9.99 claim.
