import { BadgeDollarSign, Check, ChevronDown, Sparkles } from "lucide-react";

import {
  addOns,
  lotusSpaPackage,
  serviceGroups,
} from "@/lib/lotuspetspa/guide-data";
import { LOTUS_SITE } from "@/lib/lotuspetspa/site";

function Price({ value }: { value?: string }) {
  return (
    <span className="shrink-0 rounded-full bg-[#F3EFF8] px-3 py-1 text-sm font-extrabold text-[#4A3B6B]">
      {value || "Book for pricing"}
    </span>
  );
}

export function PricingSection() {
  return (
    <section
      id="services"
      aria-label="Services and pricing"
      className="scroll-mt-header bg-[#FFFFFF] py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-[#2E2344] sm:text-4xl md:text-5xl">
            Services & pricing from April&apos;s guide
          </h2>
          <p className="mt-4 text-base leading-7 text-[#35405A] sm:text-lg">
            The menu below mirrors the source guide: full grooms, mini grooms,
            doodle packages, bath and dry, stand-alone nail services, and every
            listed add-on price. When the guide did not list a dollar amount,
            the site says to book for pricing instead of inventing one.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="space-y-4">
            {serviceGroups.map((group, index) => (
              <details
                key={group.title}
                open={index === 0}
                className="group overflow-hidden rounded-3xl border border-[#DED6EB] bg-[#FFFFFF] shadow-sm transition hover:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 sm:px-6">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#2E2344] sm:text-xl">
                      {group.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[#35405A]">
                      {group.summary}
                    </p>
                  </div>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-[#4A3B6B] transition group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>

                <div className="border-t border-[#EEE8F5] bg-[#FBFAFD] px-5 py-5 sm:px-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {group.items.map((item) => (
                      <div
                        key={item.name}
                        className="rounded-2xl border border-[#E7E0F1] bg-[#FFFFFF] p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-bold text-[#2E2344]">
                            {item.name}
                          </p>
                          <Price value={item.price} />
                        </div>
                        {item.note ? (
                          <p className="mt-2 text-xs leading-5 text-[#596279]">
                            {item.note}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>

                  {group.includes?.length ? (
                    <div className="mt-5 rounded-2xl bg-[#F3EFF8] p-5">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4A3B6B]">
                        Includes
                      </p>
                      <ul className="mt-3 grid gap-2 sm:grid-cols-2" role="list">
                        {group.includes.map((item) => (
                          <li
                            key={item}
                            className="flex gap-2 text-sm leading-6 text-[#35405A]"
                          >
                            <Check
                              className="mt-1 h-4 w-4 shrink-0 text-[#6BB5A8]"
                              aria-hidden="true"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </details>
            ))}
          </div>

          <aside className="rounded-3xl bg-[#2E2344] p-6 text-[#FFFFFF] shadow-xl lg:sticky lg:top-24">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A66B]">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-2xl font-extrabold">
              {lotusSpaPackage.name}
            </h3>
            <p className="mt-2 text-4xl font-black text-[#F2DCA8]">
              {lotusSpaPackage.price}
            </p>
            <p className="mt-4 text-sm leading-6 text-[#E8E1F2]">
              {lotusSpaPackage.description}
            </p>
            <a
              href={LOTUS_SITE.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#C9A66B] px-6 py-3 text-sm font-black text-[#241A36] shadow-lg transition hover:bg-[#D9B875] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
              style={{ color: "#241A36" }}
            >
              Book with MoeGo
            </a>
          </aside>
        </div>

        <div className="mt-16">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h3 className="text-2xl font-extrabold text-[#2E2344] sm:text-3xl">
                Add-ons from the guide
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#35405A]">
                All listed add-ons are included here, including the special
                handling, household, skin, coat, paw, teeth, and spa services.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DED6EB] px-4 py-2 text-sm font-bold text-[#4A3B6B]">
              <BadgeDollarSign className="h-4 w-4" aria-hidden="true" />
              No invented prices
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {addOns.map((addOn) => (
              <article
                key={addOn.name}
                className="rounded-2xl border border-[#E7E0F1] bg-[#FBFAFD] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-extrabold text-[#2E2344]">
                    {addOn.name}
                  </h4>
                  <Price value={addOn.price} />
                </div>
                {addOn.description ? (
                  <p className="mt-3 text-xs leading-5 text-[#596279]">
                    {addOn.description}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
