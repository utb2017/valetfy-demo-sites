import { Star } from "lucide-react";

import { reviews } from "@/lib/lotuspetspa/guide-data";
import { LotusPetSpaImage } from "@/components/lotuspetspa/lotus-pet-spa-image";

export function ReviewsSection() {
  return (
    <section
      id="reviews"
      aria-label="Client reviews"
      className="scroll-mt-header bg-[#F3EFF8] py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#2E2344] sm:text-4xl md:text-5xl">
            The pups already know April
          </h2>
          <p className="mt-4 text-base leading-7 text-[#35405A] sm:text-lg">
            Six guide-backed testimonials, paired with the best dog photos from
            the asset drop.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review, index) => (
            <article
              key={`${review.author}-${review.pet || index}`}
              className="flex min-h-[260px] flex-col overflow-hidden rounded-3xl border border-white/70 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#DDD3EA]">
                <LotusPetSpaImage
                  src={review.image}
                  alt={`${review.pet || review.author} review photo for Lotus Pet Spa`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div
                  className="flex gap-1 text-[#C9A66B]"
                  aria-label="5 star review"
                >
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="h-4 w-4 fill-current"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-6 text-[#35405A]">
                  &quot;{review.quote}&quot;
                </p>
                <p className="mt-5 text-sm font-extrabold text-[#2E2344]">
                  {review.pet ? `${review.author} / ${review.pet}` : review.author}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
