import { Check } from 'lucide-react'
import { WOOF_WASH_IMAGES } from '@/lib/woofwash/cloudinary'
import { WoofWashImage } from '@/components/woofwash/woof-wash-image'

const BOOKING_URL = 'https://booking.moego.pet/ol/book?name=WoofWash'

interface PriceTier {
  size: string
  weight: string
  price: string
}

interface ServiceCard {
  name: string
  imageSrc: string
  imageAlt: string
  description: string
  includes: string[]
  tiers: PriceTier[]
  tierNote?: string
  featured?: boolean
}

const services: ServiceCard[] = [
  {
    name: 'Full Groom',
    imageSrc: WOOF_WASH_IMAGES.fullGroom,
    imageAlt: 'Full groom dog grooming service in Austin, TX Travis County',
    description: 'The complete grooming experience for your pup.',
    includes: [
      'Haircut',
      'Blueberry Facial',
      'Sanitary Trim',
      'Bath',
      'Oatmeal Shampoo & Conditioner',
      'Blow Dry',
      'Brush',
      'Nail Trimming',
      'Ear Cleaning',
      'Organic Finishing Spray',
      'Bow/Bandana',
    ],
    tiers: [
      { size: 'Small', weight: '0–20 lbs', price: '$130' },
      { size: 'Medium', weight: '21–54 lbs', price: '$150' },
      { size: 'Large', weight: '55–99 lbs', price: '$180' },
      { size: 'X-Large', weight: '100+ lbs', price: '$200+' },
    ],
    featured: true,
  },
  {
    name: 'Bath',
    imageSrc: WOOF_WASH_IMAGES.bath,
    imageAlt: 'Dog bath grooming service in Austin, TX Travis County',
    description: 'A thorough, spa-quality bath to keep your pup fresh.',
    includes: [
      'Blueberry Facial',
      'Bath',
      'Oatmeal Shampoo & Conditioner',
      'Blow Dry',
      'Brush',
      'Ear Cleaning',
      'Bow/Bandana',
    ],
    tiers: [
      { size: 'Small', weight: '0–20 lbs', price: '$100' },
      { size: 'Medium', weight: '21–54 lbs', price: '$120' },
      { size: 'Large', weight: '55–99 lbs', price: '$140' },
      { size: 'X-Large', weight: '100+ lbs', price: '$160+' },
    ],
  },
  {
    name: 'Add-Ons',
    imageSrc: WOOF_WASH_IMAGES.addOns,
    imageAlt: 'Dog grooming add-on services in Austin, TX Travis County',
    description: 'Enhance any full groom or bath with extra care.',
    includes: [],
    tiers: [
      { size: 'Nail Trimming', weight: '', price: '$30' },
      { size: 'De-Matting', weight: '', price: '$50+' },
      { size: 'Deshedding', weight: '', price: '$50+' },
      { size: 'Flea/Tick Bath', weight: '', price: '$40+' },
    ],
    tierNote: 'Add to any full groom or bath',
  },
]

function ServiceCard({ service }: { service: ServiceCard }) {
  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-xl ${
        service.featured
          ? 'border-[#153fb0] shadow-lg ring-2 ring-[#153fb0]/20'
          : 'border-gray-200 shadow-md'
      }`}
      aria-label={`${service.name} service`}
    >
      {service.featured && (
        <div
          className="absolute left-0 right-0 top-0 py-1 text-center text-xs font-bold uppercase tracking-widest text-white"
          style={{ backgroundColor: '#153fb0' }}
        >
          Most Popular
        </div>
      )}

      {/* Circle photo */}
      <div className={`flex justify-center pb-4 ${service.featured ? 'pt-10' : 'pt-6'}`}>
        <div className="relative h-28 w-28 overflow-hidden rounded-full ring-4 ring-white shadow-md">
          <WoofWashImage
            src={service.imageSrc}
            alt={service.imageAlt}
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-8">
        <h3
          className="mb-1 text-center text-xl font-extrabold"
          style={{ color: '#153fb0' }}
        >
          {service.name}
        </h3>
        <p className="mb-4 text-center text-sm" style={{ color: '#33415c' }}>
          {service.description}
        </p>

        {/* Includes */}
        {service.includes.length > 0 && (
          <div className="mb-5">
            <p
              className="mb-2 text-xs font-bold uppercase tracking-wider"
              style={{ color: '#00a2ee' }}
            >
              Includes
            </p>
            <ul className="grid grid-cols-1 gap-1" role="list">
              {service.includes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#33415c' }}>
                  <Check
                    className="mt-0.5 h-3.5 w-3.5 flex-shrink-0"
                    style={{ color: '#0077c0' }}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pricing tiers */}
        <div className="mt-auto">
          {service.tierNote && (
            <p
              className="mb-2 text-xs font-semibold italic"
              style={{ color: '#33415c' }}
            >
              {service.tierNote}
            </p>
          )}
          <div
            className="overflow-hidden rounded-xl"
            style={{ backgroundColor: '#f4f7fb' }}
          >
            {service.tiers.map((tier, i) => (
              <div
                key={tier.size}
                className={`flex items-center justify-between px-4 py-2.5 ${
                  i < service.tiers.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <div>
                  <span className="text-sm font-semibold" style={{ color: '#153fb0' }}>
                    {tier.size}
                  </span>
                  {tier.weight && (
                    <span className="ml-1.5 text-xs" style={{ color: '#33415c' }}>
                      ({tier.weight})
                    </span>
                  )}
                </div>
                <span className="text-base font-extrabold" style={{ color: '#f5633d' }}>
                  {tier.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

export function PricingSection() {
  return (
    <section
      id="pricing"
      aria-label="Available Services & Pricing"
      className="scroll-mt-header bg-white py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-4 text-center">
          <p
            className="mb-2 text-xs font-bold uppercase tracking-widest"
            style={{ color: '#00a2ee' }}
          >
            Austin & Travis County
          </p>
          <h2
            className="text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-4xl md:text-5xl"
            style={{ color: '#153fb0' }}
          >
            Available Services
          </h2>
        </div>

        {/* Pricing banner image */}
        <div className="relative mb-12 mt-8 aspect-[21/6] w-full overflow-hidden rounded-2xl shadow-lg sm:aspect-[21/5]">
          <WoofWashImage
            src={WOOF_WASH_IMAGES.pricingBanner}
            alt="Dog grooming prices in Austin, TX Travis County — Woof Wash mobile grooming"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.name} service={service} />
          ))}
        </div>

        {/* Pricing disclaimer */}
        <p
          className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed"
          style={{ color: '#33415c' }}
        >
          Prices may vary depending on your dog&apos;s behavior, coat/skin condition, grooming
          duration, and weight. We&apos;ll always keep you informed during your appointment.
        </p>

        {/* Book CTA */}
        <div className="mt-8 text-center">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full px-10 py-4 text-base font-bold text-white shadow-lg transition-all hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: '#f5633d', outlineColor: '#f5633d' }}
          >
            Book Grooming
          </a>
        </div>
      </div>
    </section>
  )
}
