import { LOTUS_IMAGES } from "./images"

export type PriceLabel = string

export type ServiceItem = {
  name: string
  price?: PriceLabel
  note?: string
}

export type ServiceGroup = {
  title: string
  summary: string
  includes?: string[]
  items: ServiceItem[]
}

export type AddOn = {
  name: string
  price?: PriceLabel
  description?: string
}

export type Review = {
  author: string
  pet?: string
  quote: string
  image: string
}

export const hours = [
  { day: "Monday", hours: "8:00 AM - 4:30 PM" },
  { day: "Tuesday", hours: "8:00 AM - 4:30 PM" },
  { day: "Wednesday", hours: "8:00 AM - 4:30 PM" },
  { day: "Thursday", hours: "8:00 AM - 4:30 PM" },
  { day: "Friday", hours: "8:00 AM - 4:30 PM" },
  { day: "Saturday", hours: "8:00 AM - 2:30 PM" },
  { day: "Sunday", hours: "Closed" },
] as const

export const shortHours = [
  { day: "Mon-Fri", hours: "8:00 AM - 4:30 PM" },
  { day: "Saturday", hours: "8:00 AM - 2:30 PM" },
  { day: "Sunday", hours: "Closed" },
] as const

export const serviceAreas = [
  "Columbus, GA",
  "Muscogee County",
  "Phenix City",
  "Fort Benning corridor",
] as const

export const amenities = [
  "Accepts walk-ins",
  "Cage-free",
  "Pet supplies",
  "Locally owned",
] as const

export const payments = [
  "Credit cards",
  "Apple Pay",
  "Android Pay",
] as const

const fullGroomIncludes = [
  "Specialty shampoo and conditioner for your pet's skin and coat",
  "Tearless facial wash",
  "Fluff dry",
  "Brush and comb out",
  "Nail trim or nail grind",
  "Ear cleaning",
  "Ear plucking unless specified",
  "All-over haircut",
  "Specialty coat spray",
  "Scented spray",
  "Bandana, neck tie, or neck bow",
]

const miniGroomIncludes = [
  "Specialty shampoo and conditioner for your pet's skin and coat",
  "Tearless facial wash",
  "Fluff dry",
  "Brush and comb out",
  "Paw pad trim",
  "Sanitary area trim",
  "Nail trim or nail grind",
  "Ear cleaning",
  "Ear plucking unless specified",
  "Specialty coat spray",
  "Scented spray",
  "Bandana, neck tie, or neck bow",
]

const bathDryIncludes = [
  "Specialty shampoo and conditioner for your pet's skin and coat",
  "Tearless facial wash",
  "Fluff dry",
  "Brush and comb out",
  "Nail trim or nail grind",
  "Ear cleaning",
  "Specialty coat spray",
  "Scented spray",
  "Bandana, neck tie, or neck bow",
]

export const serviceGroups: ServiceGroup[] = [
  {
    title: "Full Groom Haircut (+ Bath, Nails & Ears)",
    summary:
      "Complete haircut service using environmentally friendly, pH-balanced products made in the USA.",
    includes: fullGroomIncludes,
    items: [
      { name: "Sanitary Trim & Paw Pads", price: "$10" },
      { name: "Clean Feet", price: "$10" },
      { name: "Small Breed - Full Groom", price: "Book for pricing" },
      { name: "Medium Breed - Full Groom", price: "Book for pricing" },
      { name: "Large Breed - Full Groom", price: "Book for pricing" },
      { name: "XL Breed - Full Groom", price: "Book for pricing" },
    ],
  },
  {
    title: "Mini Groom Sani/Paw Pad Trim (+ Bath, Nails & Ears)",
    summary:
      "A lighter groom focused on bath, nails, ears, paw pads, and sanitary area trimming.",
    includes: miniGroomIncludes,
    items: [
      { name: "Puppy Mini Groom", price: "$100" },
      { name: "Mini Groom - Small Breed", price: "Book for pricing" },
      { name: "Mini Groom - Medium Breed", price: "Book for pricing" },
      { name: "Mini Groom - Large Breed", price: "Book for pricing" },
      { name: "Mini Groom - XL Breed", price: "Book for pricing" },
    ],
  },
  {
    title: "Doodle Full Groom Haircut (+ Bath, Nails & Ears)",
    summary:
      "Full haircut package for doodles with the same bath, nail, ear, coat spray, and finishing details.",
    includes: fullGroomIncludes,
    items: [
      { name: "Doodle Puppy - Full Groom (Under 6 months)", price: "Book for pricing" },
      { name: "Doodle - Full Groom - Medium", price: "Book for pricing" },
      { name: "Doodle - Full Groom - Large", price: "Book for pricing" },
      { name: "Doodle - Full Groom - Extra Large", price: "Book for pricing" },
    ],
  },
  {
    title: "Doodle Mini Groom Sani/Paw Pad (+ Bath, Nails & Ears)",
    summary:
      "Light doodle haircut service with bath, blow dry, brush and fluff, nails, ears, and bandana.",
    includes: [
      "Bath with shampoo and conditioner",
      "Blow dry",
      "Brush and fluff",
      "Light haircut",
      "Nail trim or file",
      "Ears cleaned or plucked unless specified",
      "Bandana",
    ],
    items: [
      { name: "Mini Doodle - Mini Groom", price: "Book for pricing" },
      { name: "Doodle Puppy - Mini Groom (Under 6 months)", price: "Book for pricing" },
      { name: "Doodle - Mini Groom - Extra Large", price: "$250" },
    ],
  },
  {
    title: "Bath & Dry (+ Nails, Ears & Brush)",
    summary:
      "Bath and dry service with nails, ears, brush-out, coat spray, scented spray, and finishing accessory.",
    includes: bathDryIncludes,
    items: [
      {
        name: "Puppy Price (6 months & under)",
        price: "$90",
        note: "Prices vary on age, breed, coat type, condition, and temperament.",
      },
      { name: "Small Short Hair Breeds", price: "Book for pricing", note: "Chihuahua, Frenchie, Dachshund, and similar breeds." },
      { name: "Medium Short Hair Breeds", price: "Book for pricing", note: "Beagle, Basset Hound, Basenji, English Bulldog, and similar breeds." },
      { name: "Large Short Hair Breeds", price: "Book for pricing", note: "Pitbull, Boxer, Doberman, Weimaraner, and similar breeds." },
      { name: "XL Short Hair Breeds", price: "Book for pricing", note: "Rottweiler, Labrador, and similar breeds." },
      { name: "XL Double Coated Breed", price: "Book for pricing", note: "German Shepherd, Husky, and similar breeds." },
    ],
  },
  {
    title: "Service For Only This (Nothing More)",
    summary:
      "Stand-alone nail and ear appointments for pets not receiving a bath or groom.",
    items: [
      {
        name: "Nail Trim/File & Ear Cleaning Combo",
        price: "Book for pricing",
        note: "Already included in all baths and grooms.",
      },
      {
        name: "Nail Trim/File",
        price: "Book for pricing",
        note: "Appointment for a nail trim/file only.",
      },
    ],
  },
]

export const lotusSpaPackage: AddOn = {
  name: "Lotus Spa Package",
  price: "$15",
  description:
    "Blueberry Facial Massage, Vanilla Mint teeth brushing with Cool Mint breath spray, and moisturizing paw and nose cream.",
}

export const addOns: AddOn[] = [
  { name: "Paw Pads Only", price: "$10" },
  { name: "Special Handling Fee", price: "$10" },
  { name: "Light neaten up", price: "$10" },
  { name: "Additional Household Sani + Paw Pad Trim", price: "$15" },
  { name: "Vital Mask Deep Conditioning Treatment", price: "$10" },
  { name: "Clean Face & Clean Feet", price: "$20" },
  { name: "Hand Stripping/Coat Carding", price: "$30" },
  {
    name: "Medicated Shampoo",
    price: "$15",
    description: "Prebiotic shampoo plus prebiotic conditioner.",
  },
  { name: "Dirty Coat (extra shampoo + water)", price: "$10" },
  { name: "Matted/Pelt Fee", price: "$20" },
  { name: "Impacted coat/Carding", price: "$30" },
  { name: "Blueberry Facial Massage", price: "$5" },
  { name: "Feces on Rear/Blade Cleanup", price: "$10" },
  {
    name: "Dog Paw Relief Fizz Tablet",
    price: "$10",
    description:
      "Tea tree oil, sunflower oil, and kelp extract to help soothe itchy, yeasty, red, irritated, or odorous paws.",
  },
  {
    name: "CO2 Skin Therapy Tablet",
    price: "$10",
    description:
      "All-inclusive CO2 spa care tablet for skin and coat concerns like dandruff, hot spots, yeast, odor, itchiness, eczema, and extra moisturizer.",
  },
  lotusSpaPackage,
  {
    name: "Additional Household Ear Cleaning",
    price: "$10",
    description: "For an additional household dog not receiving other grooming services.",
  },
  {
    name: "Additional Household Nail Trim/Filing & Ear Cleaning",
    price: "$25",
    description: "For an additional household dog not receiving other grooming services.",
  },
  {
    name: "Fresh Breath Teeth Brushing & Cool Mint Breath Spray",
    price: "$10",
    description:
      "Nature's enzymatic toothpaste with neem oil, grapefruit seed extract, aloe, baking soda, and enzymes.",
  },
  {
    name: "Additional Household Nail Trim/File",
    price: "$20",
    description: "Recommended every 3-4 weeks to help the quick recede over time.",
  },
  {
    name: "Shed Less Treatment",
    price: "$30",
    description:
      "Specialty deshed shampoo, deshed conditioner, and extra brushing. Guide notes pricing starts at $25+ depending on size and coat condition.",
  },
  {
    name: "Soothing Flea and Tick Shampoo",
    price: "$15",
    description:
      "10 minute soak plus cleanup. Please tell April before the appointment if your pet has fleas.",
  },
  {
    name: "De-matting",
    price: "$15",
    description: "Guide notes this can start at $10 depending on coat condition.",
  },
  {
    name: "Wellness Medicated Shampoo",
    price: "Book for pricing",
    description:
      "For musty odor, circular or patchy hair loss, and conditions caused by bacteria, yeast, or fungi. Includes a 9 oz bottle to keep.",
  },
  {
    name: "Nail painting (Includes Moisturizing Paw Cream)",
    price: "Book for pricing",
    description:
      "Pet-safe, non-toxic, water-based polish. Let April know the color so she can have it in stock.",
  },
]

export const reviews: Review[] = [
  {
    author: "Renardo",
    quote:
      "April really displays attention to detail when it comes to your pet's grooming needs and always provides outstanding customer service!",
    image: LOTUS_IMAGES.reviewRenardo,
  },
  {
    author: "Ruth",
    pet: "Pipey",
    quote:
      "Pipey was so happy after her haircut. April is patient and kind. I wouldn't trust my doggie with anyone else.",
    image: LOTUS_IMAGES.reviewRuth,
  },
  {
    author: "Mary",
    pet: "Candy",
    quote: "April is so nice and professional. Candy loves her.",
    image: LOTUS_IMAGES.reviewMary,
  },
  {
    author: "Cathy",
    pet: "Lucy",
    quote:
      "Lucy loves April! She is always professional, loving and gentle with Lucy. Lucy always looks so good after her grooming!",
    image: LOTUS_IMAGES.reviewCathy,
  },
  {
    author: "Linda",
    quote: "Always does an amazing job with her.",
    image: LOTUS_IMAGES.reviewLinda,
  },
  {
    author: "Dena",
    pet: "Charley",
    quote: "Love April! Charley always looks so good after his grooming!",
    image: LOTUS_IMAGES.reviewDena,
  },
]
