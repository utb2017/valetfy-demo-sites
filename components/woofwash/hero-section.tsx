import { MapPin, Leaf, Home } from 'lucide-react'
import { WOOF_WASH_IMAGES } from '@/lib/woofwash/cloudinary'
import { WoofWashImage } from '@/components/woofwash/woof-wash-image'

const BOOKING_URL = 'https://booking.moego.pet/ol/book?name=WoofWash'
const SMS_URL = 'sms:+15125228417'

export function HeroSection() {
  return (
    <section
      aria-label="Hero — Mobile Dog Grooming in Austin"
      style={{ backgroundColor: '#0077c0' }}
      className="relative overflow-hidden pb-16 pt-12 md:pb-20 md:pt-16"
    >
      {/* Subtle background texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 70% 50%, #ffffff 0%, transparent 60%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">
          {/* Left — copy */}
          <div className="flex-1 text-center lg:text-left">
            {/* Location pills */}
            <div className="mb-6 flex flex-wrap justify-center gap-2 lg:justify-start">
              {[
                { icon: MapPin, label: 'Austin' },
                { icon: MapPin, label: 'Travis County' },
                { icon: Home, label: 'We come to you' },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
                >
                  <Icon className="h-3 w-3" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>

            {/* H1 */}
            <h1 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
              Mobile Dog Grooming,{' '}
              <span className="block">Where Tail Wagging</span>
              <span className="block">Begins</span>
            </h1>

            <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/85 text-pretty mx-auto lg:mx-0">
              Cage-free, force-free grooming that comes to you — in clean, quiet
              vans powered by renewable energy.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                style={{ backgroundColor: '#f5633d' }}
              >
                Book Grooming
              </a>
              <a
                href={SMS_URL}
                className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-3.5 text-base font-bold text-white transition-all hover:bg-white hover:text-[#0077c0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Text Us
              </a>
            </div>

            {/* Trust badge row */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              <span className="inline-flex items-center gap-1.5 text-sm text-white/75">
                <Leaf className="h-4 w-4 text-green-300" aria-hidden="true" />
                100% Eco-Friendly
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-white/75">
                <span className="h-1 w-1 rounded-full bg-white/40" aria-hidden="true" />
                Cage-Free
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-white/75">
                <span className="h-1 w-1 rounded-full bg-white/40" aria-hidden="true" />
                Force-Free
              </span>
            </div>
          </div>

          {/* Right — hero photo */}
          <div className="w-full max-w-md flex-shrink-0 lg:max-w-lg xl:max-w-xl">
            <div className="relative rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-white/20">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                <WoofWashImage
                  src={WOOF_WASH_IMAGES.hero}
                  alt="Happy dog being groomed in a Woof Wash mobile grooming van in Austin, TX Travis County"
                  fill
                  sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 520px"
                  className="object-cover"
                  priority
                />
              </div>
              {/* Floating badge */}
              <div
                className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-xl px-4 py-2.5 shadow-lg"
                style={{ backgroundColor: '#f5633d' }}
              >
                <Leaf className="h-4 w-4 text-white" aria-hidden="true" />
                <span className="text-sm font-bold text-white">Renewable Energy Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
