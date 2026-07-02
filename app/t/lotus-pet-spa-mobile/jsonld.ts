import {
  addOns,
  amenities,
  payments,
  reviews,
  serviceGroups,
} from "@/lib/lotuspetspa/guide-data";
import { LOTUS_SITE } from "@/lib/lotuspetspa/site";

const offerCatalog = [
  ...serviceGroups.map((group) => ({
    "@type": "OfferCatalog",
    name: group.title,
    description: group.summary,
    itemListElement: group.items.map((item) => ({
      "@type": "Offer",
      name: item.name,
      priceCurrency: "USD",
      price: item.price?.startsWith("$") ? item.price.replace("$", "") : undefined,
      description: item.note,
      category: "Dog grooming",
      availability: "https://schema.org/InStock",
    })),
  })),
  {
    "@type": "OfferCatalog",
    name: "Dog grooming add-ons",
    itemListElement: addOns.map((addOn) => ({
      "@type": "Offer",
      name: addOn.name,
      priceCurrency: "USD",
      price: addOn.price?.startsWith("$") ? addOn.price.replace("$", "") : undefined,
      description: addOn.description,
      category: "Dog grooming add-on",
      availability: "https://schema.org/InStock",
    })),
  },
];

export const lotusPetSpaJsonLd = {
  "@context": "https://schema.org",
  "@type": ["PetGroomer", "LocalBusiness"],
  "@id": `${LOTUS_SITE.demoUrl}/#business`,
  name: LOTUS_SITE.legalName,
  alternateName: LOTUS_SITE.businessName,
  description:
    "One-on-one mobile dog grooming by April serving Columbus, Muscogee County, Phenix City, and the Fort Benning corridor.",
  url: LOTUS_SITE.demoUrl,
  telephone: LOTUS_SITE.phoneE164,
  priceRange: "$5-$250",
  image: `${LOTUS_SITE.demoUrl}/lotus-pet-spa-mobile/og-image.png`,
  logo: `${LOTUS_SITE.demoUrl}/lotus-pet-spa-mobile/apple-touch-icon.png`,
  serviceType: "Mobile Dog Grooming",
  founder: {
    "@type": "Person",
    name: LOTUS_SITE.ownerName,
    jobTitle: "Master Groomer",
  },
  paymentAccepted: payments,
  amenityFeature: amenities.map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: true,
  })),
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "16:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "14:30",
    },
  ],
  areaServed: [
    { "@type": "City", name: "Columbus" },
    { "@type": "AdministrativeArea", name: "Muscogee County" },
    { "@type": "City", name: "Phenix City" },
    { "@type": "Place", name: "Fort Benning corridor" },
  ],
  potentialAction: {
    "@type": "ReserveAction",
    name: "Book a Grooming Appointment",
    target: {
      "@type": "EntryPoint",
      urlTemplate: LOTUS_SITE.bookingUrl,
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
    result: { "@type": "Reservation", name: "Dog Grooming Reservation" },
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Lotus Pet Spa Mobile Grooming services",
    itemListElement: offerCatalog,
  },
  review: reviews.map((review) => ({
    "@type": "Review",
    author: { "@type": "Person", name: review.author },
    reviewBody: review.quote,
    itemReviewed: { "@id": `${LOTUS_SITE.demoUrl}/#business` },
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
    },
  })),
  sameAs: [LOTUS_SITE.facebookUrl],
};
