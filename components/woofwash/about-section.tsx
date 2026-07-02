import { Heart, Leaf, Star } from 'lucide-react'
import { WOOF_WASH_IMAGES } from '@/lib/woofwash/cloudinary'
import { WoofWashImage } from '@/components/woofwash/woof-wash-image'

const BOOKING_URL = 'https://booking.moego.pet/ol/book?name=WoofWash'

const stats = [
  { icon: Heart, label: 'Pet-Centric', value: 'Always' },
  { icon: Leaf, label: 'Renewable Energy', value: '100%' },
  { icon: Star, label: 'Force-Free', value: 'Always' },
]

export function AboutSection() {
  return (
    <section
      id="about"
      aria-label="About Woof Wash"
      className="scroll-mt-header py-16 md:py-24"
      style={{ backgroundColor: '#f4f7fb' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Photo */}
          <div className="w-full max-w-md flex-shrink-0 lg:max-w-lg">
            <div className="relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl">
                <WoofWashImage
                  src={WOOF_WASH_IMAGES.about}
                  alt="Woof Wash team — passionate dog groomers in Austin, TX Travis County"
                  fill
                  sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 520px"
                  className="object-cover"
                />
              </div>
              {/* Stats bar */}
              <div
                className="absolute -bottom-5 left-4 right-4 flex items-center justify-around rounded-xl px-4 py-4 shadow-xl"
                style={{ backgroundColor: '#0077c0' }}
              >
                {stats.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="text-center">
                    <Icon className="mx-auto mb-1 h-4 w-4 text-white/80" aria-hidden="true" />
                    <p className="text-base font-extrabold text-white">{value}</p>
                    <p className="text-[10px] font-semibold text-white/70">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="mt-6 flex-1 text-center lg:mt-0 lg:text-left">
            <p
              className="mb-2 text-xs font-bold uppercase tracking-widest"
              style={{ color: '#00a2ee' }}
            >
              Our Story
            </p>
            <h2
              className="mb-5 text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-4xl"
              style={{ color: '#153fb0' }}
            >
              We&apos;re Dog People
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-pretty" style={{ color: '#33415c' }}>
              Woof Wash is driven by a love for pets, aiming to redefine dog grooming in Austin,
              Texas. Founded by a devoted local small business owner, we address common grooming
              challenges with care and efficiency.
            </p>
            <p className="mb-6 text-base leading-relaxed" style={{ color: '#33415c' }}>
              Our vans operate sustainably on renewable energy, reflecting our dedication to
              environmental responsibility. With our pet-centric approach and unmatched service
              quality, we prioritize both your dog&apos;s well-being and your convenience. As fellow
              dog parents, we understand these furry companions are family. Choose Woof Wash for a
              grooming experience that puts you and your dog first.
            </p>

            {/* Pillars */}
            <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { heading: 'Eco-Friendly', sub: 'Biodegradable, all-natural products' },
                { heading: 'Cage-Free', sub: 'No cages, ever. One dog at a time.' },
                { heading: 'Force-Free', sub: 'Expert, gentle, stress-free care' },
              ].map(({ heading, sub }) => (
                <div
                  key={heading}
                  className="rounded-xl border border-[#d1dbe8] bg-white p-4 text-left shadow-sm"
                >
                  <p className="mb-0.5 text-sm font-bold" style={{ color: '#153fb0' }}>
                    {heading}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: '#33415c' }}>
                    {sub}
                  </p>
                </div>
              ))}
            </div>

            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-base font-bold text-white shadow-md transition-all hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ backgroundColor: '#f5633d', outlineColor: '#f5633d' }}
            >
              Join Us Today
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
