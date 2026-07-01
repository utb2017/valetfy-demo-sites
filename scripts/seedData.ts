import type { DemoSiteDoc } from "@/lib/demoSiteTypes";

export type SeedTenant = Omit<
  DemoSiteDoc,
  "createdAt" | "updatedAt" | "registrar"
> & {
  siteId: string;
  sourceUrl?: string;
  registrar?: string;
};

export const SEED_TENANTS: SeedTenant[] = [
  {
    siteId: "scott",
    businessName: "Scott's Home Services",
    slug: "scott",
    owner: {
      name: "Scott Miller",
      email: "hello@scotthomeservices.example",
      phone: "(805) 555-0142",
    },
    sourceUrl: "https://scottsmobilegrooming.com",
    status: "demo",
    generatedPages: ["home"],
    theme: {
      primaryColor: "#1e3a5f",
      accentColor: "#c9a227",
      backgroundColor: "#f7f7f5",
      fontFamily: "sans",
    },
    contentBlocks: [
      {
        type: "hero",
        headline: "Reliable home repairs & maintenance",
        subheadline:
          "Licensed, insured, and on time — serving the Central Coast since 2012.",
        ctaLabel: "Get a free estimate",
        ctaHref: "#contact",
        imageUrl:
          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80",
      },
      {
        type: "about",
        title: "About Scott",
        body: "From drywall to deck repairs, Scott's Home Services handles the jobs you keep putting off. Straightforward pricing, respectful crews, and work that holds up.",
      },
      {
        type: "services",
        title: "Services",
        items: [
          {
            name: "Handyman visits",
            description: "Small fixes, mounting, caulking, and punch lists.",
            price: "From $95/visit",
          },
          {
            name: "Drywall & paint touch-ups",
            description: "Patch, texture match, and finish-ready paint.",
            price: "Quote on site",
          },
          {
            name: "Seasonal maintenance",
            description: "Gutter cleaning, weather sealing, and safety checks.",
            price: "From $175",
          },
        ],
      },
      {
        type: "contact",
        title: "Contact",
        phone: "(805) 555-0142",
        email: "hello@scotthomeservices.example",
        address: "San Luis Obispo, CA",
        hours: "Mon–Sat, 8am–6pm",
      },
    ],
    backlinkEnabled: true,
    subscriptionStatus: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    dnsRevealUnlocked: false,
    monetization: "gift",
  },
  {
    siteId: "woof-wash",
    businessName: "Woof Wash Mobile Grooming",
    slug: "woof-wash",
    owner: {
      name: "Jamie Park",
      email: "book@woofwash.example",
      phone: "(805) 555-0198",
    },
    sourceUrl: "https://woofwash.com",
    status: "demo",
    generatedPages: ["home"],
    theme: {
      primaryColor: "#2d6a4f",
      accentColor: "#f4a261",
      backgroundColor: "#fbf9f6",
      fontFamily: "serif",
    },
    contentBlocks: [
      {
        type: "hero",
        headline: "Stress-free grooming at your curb",
        subheadline:
          "Full-service baths, breed-specific cuts, and nail care — we come to you.",
        ctaLabel: "Book a groom",
        ctaHref: "#contact",
        imageUrl:
          "https://images.unsplash.com/photo-1516738901171-8eb4ec13bd37?w=1200&q=80",
      },
      {
        type: "about",
        title: "Why Woof Wash",
        body: "Our mobile salon keeps pups calm and owners convenient. Eco-friendly products, transparent pricing, and groomers who actually listen to how you want your dog to look.",
      },
      {
        type: "services",
        title: "Packages",
        items: [
          {
            name: "Fresh & Fluffy",
            description: "Bath, blow dry, brush out, ear cleaning, and nails.",
            price: "$65+",
          },
          {
            name: "Full Groom",
            description: "Breed cut or trim, bath, and finishing details.",
            price: "$95+",
          },
          {
            name: "Puppy intro",
            description: "Gentle first visit for dogs under 12 months.",
            price: "$55",
          },
        ],
      },
      {
        type: "contact",
        title: "Book today",
        phone: "(805) 555-0198",
        email: "book@woofwash.example",
        address: "Mobile — SLO County",
        hours: "Tue–Sun, 9am–5pm",
      },
    ],
    backlinkEnabled: true,
    subscriptionStatus: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    dnsRevealUnlocked: false,
    monetization: "paid",
  },
  {
    siteId: "lotus-pet-spa-mobile",
    businessName: "Lotus Pet Spa Mobile Grooming",
    slug: "lotus-pet-spa-mobile",
    owner: {
      name: "April",
      email: "book@lotuspetspamobile.com",
      phone: "(706) 801-6787",
    },
    sourceUrl: "https://lotuspetspamobile.com",
    status: "demo",
    generatedPages: ["home"],
    theme: {
      primaryColor: "#5B4B8A",
      accentColor: "#7EBFB3",
      backgroundColor: "#F7F5FA",
      fontFamily: "sans",
    },
    contentBlocks: [
      {
        type: "hero",
        headline: "Luxury mobile grooming — relaxing paw zen at your door",
        subheadline:
          "One-on-one spa care from an internationally certified master groomer. Columbus, GA & Muscogee County.",
        ctaLabel: "Book on MoeGo",
        ctaHref: "https://booking.moego.pet/ol/LotusPetSpaMobileGroomingLLC/book",
        imageUrl:
          "https://images.unsplash.com/photo-1516738901171-8eb4ec13bd37?w=1200&q=80",
      },
      {
        type: "about",
        title: "About April & Lotus Pet Spa",
        body: "April is an internationally certified master groomer and competition groomer behind Lotus Pet Spa Mobile Grooming, LLC — luxury mobile grooming with calm, personal attention for every dog.",
      },
      {
        type: "services",
        title: "Services",
        items: [
          {
            name: "Full Groom",
            description: "Complete bath, trim, and finishing in our mobile spa van.",
            price: "From $75+",
          },
          {
            name: "Bath & Brush",
            description: "Spa bath, blow dry, brush out, and nail care.",
            price: "From $60+",
          },
          {
            name: "Add-ons",
            description: "Teeth brushing, paw pad moisturizer, and more.",
            price: "Ask for quote",
          },
        ],
      },
      {
        type: "contact",
        title: "Book today",
        phone: "(706) 801-6787",
        email: "book@lotuspetspamobile.com",
        address: "Mobile — Columbus, GA & Muscogee County",
        hours: "By appointment",
      },
    ],
    backlinkEnabled: true,
    subscriptionStatus: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    dnsRevealUnlocked: false,
    monetization: "paid",
  },
];
