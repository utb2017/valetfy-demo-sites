import { CalendarCheck, HeartHandshake, Phone } from "lucide-react";

import { LOTUS_IMAGES } from "@/lib/lotuspetspa/images";
import { serviceAreas } from "@/lib/lotuspetspa/guide-data";
import { LOTUS_SITE } from "@/lib/lotuspetspa/site";
import { LotusPetSpaImage } from "@/components/lotuspetspa/lotus-pet-spa-image";

export function HeroSection() {
  return (
    <section
      aria-label="Mobile dog grooming in Columbus"
      className="relative overflow-hidden bg-[#4A3B6B] pt-10 text-[#FFFFFF]"
    >
      <div className="absolute inset-x-0 bottom-0 h-28 bg-white" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 sm:px-6 md:pb-16 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_560px] lg:gap-14">
          <div className="pb-2 text-center lg:text-left">
            <h1 className="text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
              Luxury mobile spa grooming at your door
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#E8E1F2] lg:mx-0">
              One-on-one, cage-free grooming care for pets across Columbus,
              Muscogee County, Phenix City, and the Fort Benning corridor.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <a
                href={LOTUS_SITE.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C9A66B] px-8 py-4 text-base font-black text-[#241A36] shadow-xl transition hover:bg-[#D9B875] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
                style={{ color: "#241A36" }}
              >
                <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                Book Now
              </a>
              <a
                href={LOTUS_SITE.phoneTel}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#FFFFFF]/70 px-8 py-4 text-base font-black text-[#FFFFFF] transition hover:bg-[#FFFFFF] hover:text-[#4A3B6B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
                style={{ color: "#FFFFFF" }}
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                Call {LOTUS_SITE.phoneDisplay}
              </a>
            </div>

            <div className="mt-8 hidden flex-wrap justify-center gap-2 md:flex lg:justify-start">
              {serviceAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-[#FFFFFF]/20 bg-[#FFFFFF]/10 px-3 py-1.5 text-xs font-bold text-[#FFFFFF]"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#FFFFFF] p-3 shadow-2xl">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[1.45rem] bg-[#DDEEF2]">
                <LotusPetSpaImage
                  src={LOTUS_IMAGES.hero}
                  alt="Lotus Pet Spa Mobile Grooming logo with lotus, bamboo, candle, stones, and grooming shears"
                  fill
                  sizes="(max-width: 1024px) 92vw, 560px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="absolute -bottom-5 left-4 right-4 rounded-3xl border border-[#FFFFFF]/70 bg-[#FFFFFF]/95 p-4 text-[#2E2344] shadow-xl backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3EFF8] text-[#4A3B6B]">
                  <HeartHandshake className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-black">
                    Calm, one-on-one spa care
                  </p>
                  <p className="text-xs leading-5 text-[#596279]">
                    Patient handling, polished grooms, and appointment-focused
                    comfort.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
