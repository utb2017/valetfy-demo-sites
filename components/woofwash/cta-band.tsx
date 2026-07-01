const BOOKING_URL = 'https://booking.moego.pet/ol/book?name=WoofWash'
const SMS_URL = 'sms:+15125228417'

export function CtaBand() {
  return (
    <section
      aria-label="Book a grooming appointment"
      style={{ backgroundColor: '#0077c0' }}
      className="py-16 md:py-20"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-white text-balance sm:text-4xl">
          Ready for a Fresh, Happy Pup?
        </h2>
        <p className="mb-8 text-lg text-white/80 text-pretty">
          Book online in minutes or text us — we&apos;ll bring the spa to your door.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full px-10 py-4 text-center text-base font-bold text-white shadow-lg transition-all hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
            style={{ backgroundColor: '#f5633d' }}
          >
            Book Grooming
          </a>
          <a
            href={SMS_URL}
            className="w-full rounded-full border-2 border-white px-10 py-4 text-center text-base font-bold text-white transition-all hover:bg-white hover:text-[#0077c0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
          >
            Text Us
          </a>
        </div>
      </div>
    </section>
  )
}
