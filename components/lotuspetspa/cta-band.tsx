import { LOTUS_SITE } from "@/lib/lotuspetspa/site";

export function CtaBand() {
  return (
    <section aria-label="Book a grooming appointment" className="bg-[#4A3B6B] py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-[#FFFFFF] sm:text-4xl">
          Ready for April&apos;s mobile spa care?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#E8E1F2]">
          Book online through MoeGo, or call/text {LOTUS_SITE.phoneDisplay}.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={LOTUS_SITE.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full bg-[#C9A66B] px-10 py-4 text-center text-base font-black text-[#241A36] shadow-lg transition hover:bg-[#D9B875] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF] sm:w-auto"
            style={{ color: "#241A36" }}
          >
            Book Now
          </a>
          <a
            href={LOTUS_SITE.smsUrl}
            className="w-full rounded-full border-2 border-[#FFFFFF]/80 px-10 py-4 text-center text-base font-black text-[#FFFFFF] transition hover:bg-[#FFFFFF] hover:text-[#4A3B6B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF] sm:w-auto"
            style={{ color: "#FFFFFF" }}
          >
            Text April
          </a>
        </div>
      </div>
    </section>
  );
}
