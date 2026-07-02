import { HeartHandshake, Scissors, Star } from "lucide-react";

import { LOTUS_IMAGES } from "@/lib/lotuspetspa/images";
import { LOTUS_SITE } from "@/lib/lotuspetspa/site";
import { LotusPetSpaImage } from "@/components/lotuspetspa/lotus-pet-spa-image";

const qualities = [
  {
    icon: Scissors,
    title: "Attention to detail",
    body: "Clients call out April's detail and outstanding customer service.",
  },
  {
    icon: HeartHandshake,
    title: "Patient and kind",
    body: "The guide reviews describe her as patient, kind, loving, and gentle.",
  },
  {
    icon: Star,
    title: "Professional care",
    body: "April is positioned as a master groomer focused on one-on-one comfort.",
  },
];

export function AboutSection() {
  return (
    <section
      id="about"
      aria-label="About April"
      className="scroll-mt-header bg-white py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#2E2344] sm:text-4xl md:text-5xl">
              About April
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#35405A]">
              Lotus Pet Spa Mobile Grooming, LLC is led by April, a master
              groomer serving the Columbus, GA area. Her client reviews keep
              coming back to the same themes: patient handling, professional
              service, attention to detail, and pets who look and feel better
              after their spa day.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {qualities.map(({ icon: Icon, title, body }) => (
                <article
                  key={title}
                  className="rounded-3xl border border-[#E7E0F1] bg-[#FBFAFD] p-5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3EFF8] text-[#4A3B6B]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-base font-extrabold text-[#2E2344]">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#596279]">
                    {body}
                  </p>
                </article>
              ))}
            </div>

            <a
              href={LOTUS_SITE.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-full bg-[#C9A66B] px-7 py-3 text-sm font-black text-[#241A36] shadow-md transition hover:bg-[#D9B875]"
              style={{ color: "#241A36" }}
            >
              Book with April
            </a>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-[#F3EFF8] p-3 shadow-xl">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.45rem]">
              <LotusPetSpaImage
                src={LOTUS_IMAGES.heroAlt}
                alt="April surrounded by dogs"
                fill
                sizes="(max-width: 1024px) 92vw, 460px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
