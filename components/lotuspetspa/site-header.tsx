"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";

import { LOTUS_IMAGES } from "@/lib/lotuspetspa/images";
import { LOTUS_SITE } from "@/lib/lotuspetspa/site";
import { LotusPetSpaImage } from "@/components/lotuspetspa/lotus-pet-spa-image";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Reviews", href: "#reviews" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#4A3B6B]/95 backdrop-blur"
      style={{ color: "#FFFFFF" }}
      role="banner"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Lotus Pet Spa home"
          className="inline-flex flex-shrink-0"
        >
          <LotusPetSpaImage
            src={LOTUS_IMAGES.logo}
            alt="Lotus Pet Spa Mobile Grooming"
            width={150}
            height={112}
            priority
            className="h-14 w-auto object-contain sm:h-16"
            style={{
              filter:
                "drop-shadow(0 2px 6px rgba(0,0,0,0.28)) drop-shadow(0 0 10px rgba(255,255,255,0.18))",
            }}
          />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-bold text-[#FFFFFF] transition hover:text-[#FFFFFF]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={LOTUS_SITE.phoneTel}
            aria-label={`Call ${LOTUS_SITE.phoneDisplay}`}
            className="flex items-center gap-1.5 text-sm font-bold text-[#FFFFFF] transition hover:text-[#FFFFFF]"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {LOTUS_SITE.phoneDisplay}
          </a>
          <a
            href={LOTUS_SITE.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#C9A66B] px-5 py-2.5 text-sm font-black text-[#241A36] shadow-sm transition hover:bg-[#D9B875] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
            style={{ color: "#241A36" }}
          >
            Book Now
          </a>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((value) => !value)}
          className="rounded-xl p-2 text-[#FFFFFF] transition hover:bg-[#FFFFFF]/10 lg:hidden"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {mobileOpen ? (
        <div id="mobile-menu" className="border-t border-white/15 bg-[#4A3B6B] lg:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1 px-4 pb-4 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2.5 text-base font-bold text-[#FFFFFF] transition hover:bg-[#FFFFFF]/10 hover:text-[#FFFFFF]"
              >
                {link.label}
              </a>
            ))}
            <a
              href={LOTUS_SITE.phoneTel}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-base font-bold text-[#FFFFFF] transition hover:bg-[#FFFFFF]/10 hover:text-[#FFFFFF]"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {LOTUS_SITE.phoneDisplay}
            </a>
            <a
              href={LOTUS_SITE.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 rounded-full bg-[#C9A66B] px-5 py-3 text-center text-base font-black text-[#241A36] shadow-sm transition hover:bg-[#D9B875]"
              style={{ color: "#241A36" }}
            >
              Book Now
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
