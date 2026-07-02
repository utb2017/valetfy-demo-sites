# Task: Lotus Pet Spa Mobile — premium demo site (v0 polish pass)

## Repo
- **Edit + deploy:** `C:\valetfy-demo-sites`
- **Reference (read-only):** Woof Wash template at `app/t/woof-wash/` + `components/woofwash/`
- **Sibling scaffold already in repo:** `app/t/lotus-pet-spa-mobile/` + `components/lotuspetspa/`

## Business (Columbus, GA — NOT Indiana lotuspetspa.com)

| Field | Value |
| --- | --- |
| **Legal name** | Lotus Pet Spa Mobile Grooming, LLC |
| **Owner** | April — Internationally Certified Master Groomer |
| **Phone** | (706) 801-6787 |
| **Booking** | https://booking.moego.pet/ol/LotusPetSpaMobileGroomingLLC/book |
| **Facebook** | https://www.facebook.com/p/Lotus-Pet-Spa-Mobile-Grooming-61560653240173/ |
| **Domain (parked)** | lotuspetspamobile.com — owner has domain but no real site |
| **Market** | Columbus, Muscogee County, Phenix City, Fort Benning corridor |
| **Positioning** | Luxury one-on-one mobile spa, “relaxing paw zen” |

## Demo URLs
- Preview: `https://lotus-pet-spa-mobile.dev.sites.valetfy.com`
- Firestore slug: `lotus-pet-spa-mobile`
- Claim bar + Stripe checkout already wired (same as Woof Wash)

## Design direction
- **Palette:** Lotus spa — purple `#5B4B8A`, teal `#7EBFB3`, gold CTA `#D4A574`
- **Tone:** Calm luxury, not Austin eco-van (Woof Wash). Soft spa, master groomer credibility.
- **Replace placeholder Unsplash images** in `lib/lotuspetspa/images.ts` with owner assets (Cloudinary when ready).

## v0 goals
1. Polish hero, about, pricing, and trust sections with real copy once assets arrive.
2. Keep **ClaimBar** at bottom — do not remove Valetfy claim/subscribe flow.
3. Mobile-first; sticky book CTA; MoeGo booking links open in new tab.
4. noindex metadata (demo subdomain).

## Assets checklist (owner / Aaron gathering)
- [ ] Logo
- [ ] Hero photo (van or groom)
- [ ] Service/pricing banner
- [ ] Full groom / bath / add-on photos
- [ ] About photo (April or team)
- [ ] Confirmed pricing from Facebook / MoeGo

## Investigation notes
See `.firecrawl/lotus-pet-spa-mobile-investigation.md`

## Do not break
- `ClaimBar` + phone auth login flow
- Middleware rewrite for slug `lotus-pet-spa-mobile` on `/` only
- Shared Stripe product (`STRIPE_DEMO_SITES_*`) — no new Stripe product per site
