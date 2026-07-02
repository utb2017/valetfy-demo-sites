# Lotus Pet Spa Mobile — v0 project

**Created:** 2026-06-29  
**v0 chat:** [Luxury dog grooming website](https://v0.dev/chat/jqnya9JVM5s) (`jqnya9JVM5s`)

## Links

| Resource | URL |
| --- | --- |
| **Demo preview** | https://lotus-pet-spa-mobile.dev.sites.valetfy.com (after deploy) |
| **Firestore** | `demoSites/lotus-pet-spa-mobile` |
| **MoeGo booking** | https://booking.moego.pet/ol/LotusPetSpaMobileGroomingLLC/book |
| **Facebook** | https://www.facebook.com/p/Lotus-Pet-Spa-Mobile-Grooming-61560653240173/ |
| **Parked domain** | https://lotuspetspamobile.com |

## Repo layout (mirrors Woof Wash)

```
app/t/lotus-pet-spa-mobile/   page, layout, jsonld, lotuspetspa.css
components/lotuspetspa/       premium template sections
lib/lotuspetspa/site.ts       business constants
lib/lotuspetspa/images.ts     placeholder images → swap for Cloudinary
docs/dispatch/lotus-pet-spa-mobile-v0.prompt.md
```

## Infrastructure (shared — no new project)

- **GitHub:** same repo `valetfy-demo-sites`
- **Vercel:** same project, wildcard `*.dev.sites.valetfy.com`
- **Stripe:** shared `STRIPE_DEMO_SITES_*` + ClaimBar checkout
- **Firebase Auth:** add subdomain to authorized domains if claim login fails

## Next steps

1. Aaron gathers logo, hero, service photos, confirmed pricing
2. Upload assets → Cloudinary (`lotus-pet-spa-mobile/` prefix) or send to v0 chat
3. v0 polish pass using `docs/dispatch/lotus-pet-spa-mobile-v0.prompt.md`
4. `vercel deploy --prod` (or promote preview)
5. Outreach to April with preview URL
