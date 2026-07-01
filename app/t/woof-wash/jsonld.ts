// PetGroomer / LocalBusiness structured data for the Woof Wash demo.
import { WOOF_WASH_IMAGES, woofWashImageUrl } from '@/lib/woofwash/cloudinary'

const INSTAGRAM_URL = 'https://www.instagram.com/woofwashatx/'
const FACEBOOK_URL = 'https://www.facebook.com/people/Woof-Wash/61558634396477/'

export const woofWashJsonLd = {
  "@context": "https://schema.org",
  "@type": ["PetGroomer", "LocalBusiness"],
  name: "Woof Wash LLC",
  description:
    "Eco-friendly, cage-free, force-free mobile dog grooming serving Austin and all of Travis County, TX. Renewable-energy-powered vans, all-natural biodegradable products.",
  url: "https://woofwash.com",
  telephone: "+15125228417",
  email: "hello@woofwash.com",
  priceRange: "$100–$200",
  image: woofWashImageUrl(WOOF_WASH_IMAGES.hero, { width: 1200, quality: 'auto:good' }),
  logo: woofWashImageUrl(WOOF_WASH_IMAGES.logo, { width: 320, quality: 'auto' }),
  serviceType: "Mobile Dog Grooming",
  areaServed: [
    {
      "@type": "City",
      name: "Austin",
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Travis County",
        containedInPlace: { "@type": "State", name: "Texas" },
      },
    },
    {
      "@type": "AdministrativeArea",
      name: "Travis County",
      containedInPlace: { "@type": "State", name: "Texas" },
    },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "15:00",
    },
  ],
  makesOffer: [
    {
      "@type": "Offer",
      name: "Full Groom",
      description:
        "Haircut, Blueberry Facial, Sanitary Trim, Bath, Oatmeal Shampoo & Conditioner, Blow Dry, Brush, Nail Trimming, Ear Cleaning, Organic Finishing Spray & Bow/Bandana.",
      priceRange: "$130–$200+",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "Bath",
      description:
        "Blueberry Facial, Bath, Oatmeal Shampoo & Conditioner, Blow Dry, Brush, Ear Cleaning & Bow/Bandana.",
      priceRange: "$100–$160+",
      priceCurrency: "USD",
    },
  ],
  potentialAction: {
    "@type": "ReserveAction",
    name: "Book a Grooming Appointment",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://booking.moego.pet/ol/book?name=WoofWash",
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
    result: { "@type": "Reservation", name: "Dog Grooming Reservation" },
  },
  sameAs: [
    INSTAGRAM_URL,
    FACEBOOK_URL,
  ],
};
