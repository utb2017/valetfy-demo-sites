import Link from "next/link";
import { Facebook, Phone } from "lucide-react";

import { shortHours } from "@/lib/lotuspetspa/guide-data";
import { LOTUS_IMAGES } from "@/lib/lotuspetspa/images";
import { LOTUS_SITE } from "@/lib/lotuspetspa/site";
import { LotusPetSpaImage } from "@/components/lotuspetspa/lotus-pet-spa-image";

export function SiteFooter() {
  return (
    <footer className="bg-[#2E2344] text-[#FFFFFF]" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              aria-label="Lotus Pet Spa home"
              className="inline-flex"
            >
              <LotusPetSpaImage
                src={LOTUS_IMAGES.logo}
                alt="Lotus Pet Spa Mobile Grooming"
                width={180}
                height={134}
                className="h-24 w-auto object-contain"
                style={{
                  filter:
                    "drop-shadow(0 2px 6px rgba(0,0,0,0.35)) drop-shadow(0 0 12px rgba(255,255,255,0.16))",
                }}
              />
            </Link>
            <p className="mt-4 text-sm leading-6 text-[#DCD5EA]">
              {LOTUS_SITE.legalName}. Mobile dog grooming in Columbus, GA and
              surrounding service areas.
            </p>
            <a
              href={LOTUS_SITE.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Lotus Pet Spa Facebook"
              className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#FFFFFF]/10 text-[#FFFFFF] transition hover:bg-[#FFFFFF]/20"
            >
              <Facebook className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>

          <nav aria-label="Footer navigation">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-[#C8BDD7]">
              Navigation
            </p>
            <ul className="space-y-3" role="list">
              {[
                { label: "Services", href: "#services" },
                { label: "Reviews", href: "#reviews" },
                { label: "About", href: "#about" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a className="text-sm font-bold text-[#E8E1F2] hover:text-[#FFFFFF]" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-[#C8BDD7]">
              Contact
            </p>
            <ul className="space-y-3" role="list">
              <li>
                <a
                  href={LOTUS_SITE.phoneTel}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#E8E1F2] hover:text-[#FFFFFF]"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {LOTUS_SITE.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={LOTUS_SITE.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-[#E8E1F2] hover:text-[#FFFFFF]"
                >
                  Book via MoeGo
                </a>
              </li>
              <li className="text-sm text-[#DCD5EA]">Columbus, GA / Muscogee County</li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-[#C8BDD7]">
              Hours
            </p>
            <dl className="space-y-3">
              {shortHours.map(({ day, hours }) => (
                <div key={day} className="flex justify-between gap-4">
                  <dt className="text-sm text-[#DCD5EA]">{day}</dt>
                  <dd className="text-sm font-black text-[#FFFFFF]">{hours}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[#FFFFFF]/15 pt-8 sm:flex-row">
          <p className="text-xs text-[#C8BDD7]">
            Copyright {new Date().getFullYear()} {LOTUS_SITE.legalName}
          </p>
          <p className="text-xs text-[#C8BDD7]">
            Powered by{" "}
            <a
              href="https://valetfy.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#FFFFFF] underline underline-offset-2 hover:text-[#FFFFFF]"
            >
              Valetfy
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
