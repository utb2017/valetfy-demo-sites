import Link from 'next/link'
import { Phone, Mail, Instagram, Facebook } from 'lucide-react'
import { WOOF_WASH_IMAGES } from '@/lib/woofwash/cloudinary'
import { WoofWashImage } from '@/components/woofwash/woof-wash-image'

const BOOKING_URL = 'https://booking.moego.pet/ol/book?name=WoofWash'
const PHONE_TEL = 'tel:+15125228417'
const PHONE_DISPLAY = '512-522-8417'
const EMAIL = 'hello@woofwash.com'
const INSTAGRAM_URL = 'https://www.instagram.com/woofwashatx/'
const FACEBOOK_URL = 'https://www.facebook.com/people/Woof-Wash/61558634396477/'

export function SiteFooter() {
  return (
    <footer
      style={{ backgroundColor: '#0077c0' }}
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label="Woof Wash — Home">
              <WoofWashImage
                src={WOOF_WASH_IMAGES.logo}
                alt="Woof Wash — mobile dog grooming Austin TX Travis County"
                width={140}
                height={40}
                className="h-9 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              Eco-friendly, cage-free mobile dog grooming in Austin &amp; Travis County, TX.
              We come to you.
            </p>
            {/* Social */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Woof Wash on Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Woof Wash on Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
              >
                <Facebook className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/60">
              Navigation
            </p>
            <ul className="space-y-2.5" role="list">
              {[
                { label: 'About', href: '#about' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'Contact', href: '#contact' },
                { label: 'Book Grooming', href: BOOKING_URL, external: true },
              ].map(({ label, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/60">
              Contact
            </p>
            <ul className="space-y-3" role="list">
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 flex-shrink-0 text-white/60" aria-hidden="true" />
                <a
                  href={PHONE_TEL}
                  className="text-sm text-white/80 transition-colors hover:text-white"
                  aria-label={`Call us at ${PHONE_DISPLAY}`}
                >
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 flex-shrink-0 text-white/60" aria-hidden="true" />
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-sm text-white/80 transition-colors hover:text-white"
                >
                  {EMAIL}
                </a>
              </li>
              <li className="text-sm text-white/80">
                Serving Austin &amp; Travis County, TX
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/60">
              Hours
            </p>
            <dl className="space-y-2">
              {[
                { day: 'Mon – Fri', hours: '8:00 am – 6:00 pm' },
                { day: 'Saturday', hours: '9:00 am – 3:00 pm' },
                { day: 'Sunday', hours: 'Closed' },
              ].map(({ day, hours }) => (
                <div key={day} className="flex items-center justify-between gap-4">
                  <dt className="text-sm text-white/70">{day}</dt>
                  <dd className="text-sm font-semibold text-white">{hours}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/20 pt-8 sm:flex-row">
          <p className="text-xs text-white/60">
            &copy; {new Date().getFullYear()} Woof Wash LLC. All rights reserved.
          </p>
          <p className="text-xs text-white/60">
            Powered by{' '}
            <a
              href="https://valetfy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white/80 underline underline-offset-2 transition-colors hover:text-white"
            >
              Valetfy
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
