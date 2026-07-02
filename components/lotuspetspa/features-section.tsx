import { CheckCircle2, MapPin, Sparkles, type LucideIcon } from "lucide-react";

import {
  amenities,
  payments,
  serviceAreas,
} from "@/lib/lotuspetspa/guide-data";
import { LOTUS_IMAGES } from "@/lib/lotuspetspa/images";
import { LOTUS_SITE } from "@/lib/lotuspetspa/site";
import { LotusPetSpaImage } from "@/components/lotuspetspa/lotus-pet-spa-image";

function FeaturePanel({
  title,
  body,
  icon: Icon,
}: {
  title: string;
  body: string;
  icon: LucideIcon;
}) {
  return (
    <article className="rounded-3xl border border-[#E7E0F1] bg-[#FFFFFF] p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3EFF8] text-[#4A3B6B]">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-xl font-extrabold text-[#2E2344]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#35405A]">{body}</p>
    </article>
  );
}

export function FeaturesSection() {
  return (
    <section aria-label="Why choose Lotus Pet Spa" className="bg-[#FBFAFD] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[460px_minmax(0,1fr)] lg:items-center">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#FFFFFF] p-3 shadow-xl">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.45rem] bg-[#DDEEF2]">
              <LotusPetSpaImage
                src={LOTUS_IMAGES.features}
                alt="Charlie smiling after a Lotus Pet Spa grooming appointment"
                fill
                sizes="(max-width: 1024px) 92vw, 460px"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#2E2344] sm:text-4xl">
              Calm mobile grooming built around one-on-one care
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#35405A] sm:text-lg">
              Lotus Pet Spa Mobile Grooming is locally owned by April and built
              for pet parents who want a calmer option than a busy shop visit.
              The guide highlights cage-free care, mobile convenience, and
              environmentally friendly grooming products.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <FeaturePanel
                icon={Sparkles}
                title="Spa-level products"
                body="Baths and grooms use pH-balanced products with no sulfates, parabens, phthalates, or silicone."
              />
              <FeaturePanel
                icon={MapPin}
                title="Mobile service area"
                body={serviceAreas.join(" / ")}
              />
              <FeaturePanel
                icon={CheckCircle2}
                title="Easy to pay"
                body={`Accepts ${payments.join(", ")}. Amenities include ${amenities.join(", ")}.`}
              />
            </div>

            <a
              href={LOTUS_SITE.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-full bg-[#4A3B6B] px-7 py-3 text-sm font-black text-[#FFFFFF] shadow-md transition hover:bg-[#302348]"
              style={{ color: "#FFFFFF" }}
            >
              Check availability
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
