import { WOOF_WASH_IMAGES } from '@/lib/woofwash/cloudinary'
import { WoofWashImage } from '@/components/woofwash/woof-wash-image'

const BOOKING_URL = 'https://booking.moego.pet/ol/book?name=WoofWash'

interface FeatureRowProps {
  id: string
  eyebrow: string
  heading: string
  body: string
  imageSrc: string
  imageAlt: string
  reverse?: boolean
  cta?: { label: string; href: string; target?: string }
}

function FeatureRow({
  id,
  eyebrow,
  heading,
  body,
  imageSrc,
  imageAlt,
  reverse = false,
  cta,
}: FeatureRowProps) {
  return (
    <div
      id={id}
      className="scroll-mt-header mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 py-16 sm:px-6 md:py-20 lg:flex-row lg:gap-16 lg:px-8"
    >
      {/* Image */}
      <div
        className={`w-full max-w-md flex-shrink-0 lg:max-w-lg xl:max-w-xl ${reverse ? 'lg:order-last' : ''}`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl ring-1 ring-gray-200">
          <WoofWashImage
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 520px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Copy */}
      <div className={`flex-1 text-center lg:text-left ${reverse ? 'lg:order-first' : ''}`}>
        <p
          className="mb-2 text-xs font-bold uppercase tracking-widest"
          style={{ color: '#00a2ee' }}
        >
          {eyebrow}
        </p>
        <h2
          className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-4xl"
          style={{ color: '#153fb0' }}
        >
          {heading}
        </h2>
        <p className="mb-6 text-lg leading-relaxed text-pretty" style={{ color: '#33415c' }}>
          {body}
        </p>
        {cta && (
          <a
            href={cta.href}
            target={cta.target}
            rel={cta.target === '_blank' ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center justify-center rounded-full px-7 py-3 text-base font-bold text-white shadow-md transition-all hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: '#f5633d', outlineColor: '#f5633d' }}
          >
            {cta.label}
          </a>
        )}
      </div>
    </div>
  )
}

export function FeaturesSection() {
  return (
    <section aria-label="Why choose Woof Wash" className="bg-white">
      <div className="divide-y divide-gray-100">
        <FeatureRow
          id="eco-friendly"
          eyebrow="Sustainable Grooming"
          heading="Eco-Friendly, Inside & Out"
          body="We power our mobile vans with renewable energy. Our eco-friendly, all-natural products are gentle and chemical-free for your dog, and biodegradable for the environment."
          imageSrc={WOOF_WASH_IMAGES.ecoFriendly}
          imageAlt="Eco-friendly dog grooming with natural products in Austin, TX Travis County"
        />

        <div style={{ backgroundColor: '#f4f7fb' }}>
          <FeatureRow
            id="stress-free"
            eyebrow="One-on-One Care"
            heading="Stress-Free Grooming for Anxious Dogs"
            body="Our mobile service specializes in comforting anxious dogs with expert, one-on-one care. Our cage-free and force-free approach minimizes stress, while clean, quiet, eco-friendly vans reduce our carbon paw print — ensuring a serene experience for your dog and the environment."
            imageSrc={WOOF_WASH_IMAGES.stressFree}
            imageAlt="Stress-free dog grooming for anxious dogs in Austin, TX Travis County"
            reverse
          />
        </div>

        <FeatureRow
          id="service-area"
          eyebrow="Serving Austin & Travis County"
          heading="Grooming That Comes to Your Door"
          body="Our mobile grooming vans are currently serving the whole of Travis County. If your area isn't listed in our booking form, fear not — join our waitlist today and enjoy $10 off your first groom in our next van!"
          imageSrc={WOOF_WASH_IMAGES.mobileGroomer}
          imageAlt="Mobile dog groomer serving Travis County and Austin, Texas"
          cta={{ label: 'Check Your Area', href: BOOKING_URL, target: '_blank' }}
        />
      </div>
    </section>
  )
}
