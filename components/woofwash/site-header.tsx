'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { WOOF_WASH_IMAGES } from '@/lib/woofwash/cloudinary'
import { WoofWashImage } from '@/components/woofwash/woof-wash-image'

const BOOKING_URL = 'https://booking.moego.pet/ol/book?name=WoofWash'
const PHONE_TEL = 'tel:+15125228417'
const PHONE_DISPLAY = '512-522-8417'

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{ backgroundColor: '#0077c0' }}
      role="banner"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" aria-label="Woof Wash — Home" className="flex-shrink-0">
          <WoofWashImage
            src={WOOF_WASH_IMAGES.logo}
            alt="Woof Wash — mobile dog grooming Austin TX Travis County"
            width={160}
            height={44}
            priority
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-white/90 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={PHONE_TEL}
            aria-label={`Call us at ${PHONE_DISPLAY}`}
            className="flex items-center gap-1.5 text-sm font-semibold text-white/90 transition-colors hover:text-white"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {PHONE_DISPLAY}
          </a>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-5 py-2 text-sm font-bold text-white shadow-sm transition-all hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            style={{ backgroundColor: '#f5633d' }}
          >
            Book Grooming
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded p-2 text-white lg:hidden"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="border-t border-white/20 lg:hidden"
          style={{ backgroundColor: '#0077c0' }}
        >
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col gap-1 px-4 pb-4 pt-2"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded px-2 py-2.5 text-base font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href={PHONE_TEL}
              className="flex items-center gap-2 rounded px-2 py-2.5 text-base font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {PHONE_DISPLAY}
            </a>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 rounded-full px-5 py-2.5 text-center text-base font-bold text-white shadow-sm transition-all hover:brightness-110"
              style={{ backgroundColor: '#f5633d' }}
            >
              Book Grooming
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
