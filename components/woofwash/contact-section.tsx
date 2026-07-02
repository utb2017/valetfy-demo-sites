'use client'

import { useState } from 'react'
import { Phone, Mail, Clock, ExternalLink, CheckCircle } from 'lucide-react'

const BOOKING_URL = 'https://booking.moego.pet/ol/book?name=WoofWash'
const PHONE_TEL = 'tel:+15125228417'
const PHONE_SMS = 'sms:+15125228417'
const PHONE_DISPLAY = '512-522-8417'
const EMAIL = 'hello@woofwash.com'

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section
      id="contact"
      aria-label="Contact Woof Wash"
      className="scroll-mt-header bg-white py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 text-center">
          <p
            className="mb-2 text-xs font-bold uppercase tracking-widest"
            style={{ color: '#00a2ee' }}
          >
            Get in Touch
          </p>
          <h2
            className="text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-4xl"
            style={{ color: '#153fb0' }}
          >
            Contact Us
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed" style={{ color: '#33415c' }}>
            Have a question or want to learn more? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Contact form — col-span-3 */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-[#d1dbe8] bg-white p-8 shadow-sm">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle
                    className="mb-4 h-16 w-16"
                    style={{ color: '#0077c0' }}
                    aria-hidden="true"
                  />
                  <h3 className="mb-2 text-xl font-bold" style={{ color: '#153fb0' }}>
                    Message Sent!
                  </h3>
                  <p className="text-base" style={{ color: '#33415c' }}>
                    Thanks for reaching out. We&apos;ll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form
                  action="https://formsubmit.co/bear@valetfy.com"
                  method="POST"
                  onSubmit={() => setSubmitted(true)}
                  aria-label="Contact form"
                  noValidate
                >
                  {/* Hidden formsubmit fields */}
                  <input type="hidden" name="_subject" value="New Contact Form Submission — Woof Wash" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_template" value="table" />
                  <input type="text" name="_honey" className="hidden" tabIndex={-1} aria-hidden="true" />

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* First name */}
                    <div>
                      <label
                        htmlFor="first-name"
                        className="mb-1.5 block text-sm font-semibold"
                        style={{ color: '#153fb0' }}
                      >
                        First Name <span aria-label="required" style={{ color: '#f5633d' }}>*</span>
                      </label>
                      <input
                        id="first-name"
                        name="first_name"
                        type="text"
                        required
                        autoComplete="given-name"
                        placeholder="Jane"
                        className="w-full rounded-xl border border-[#d1dbe8] bg-[#f4f7fb] px-4 py-3 text-sm text-[#33415c] placeholder:text-[#33415c]/40 focus:border-[#0077c0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077c0]/20 transition-colors"
                      />
                    </div>

                    {/* Last name */}
                    <div>
                      <label
                        htmlFor="last-name"
                        className="mb-1.5 block text-sm font-semibold"
                        style={{ color: '#153fb0' }}
                      >
                        Last Name <span aria-label="required" style={{ color: '#f5633d' }}>*</span>
                      </label>
                      <input
                        id="last-name"
                        name="last_name"
                        type="text"
                        required
                        autoComplete="family-name"
                        placeholder="Smith"
                        className="w-full rounded-xl border border-[#d1dbe8] bg-[#f4f7fb] px-4 py-3 text-sm text-[#33415c] placeholder:text-[#33415c]/40 focus:border-[#0077c0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077c0]/20 transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-1.5 block text-sm font-semibold"
                        style={{ color: '#153fb0' }}
                      >
                        Email <span aria-label="required" style={{ color: '#f5633d' }}>*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="jane@example.com"
                        className="w-full rounded-xl border border-[#d1dbe8] bg-[#f4f7fb] px-4 py-3 text-sm text-[#33415c] placeholder:text-[#33415c]/40 focus:border-[#0077c0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077c0]/20 transition-colors"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-1.5 block text-sm font-semibold"
                        style={{ color: '#153fb0' }}
                      >
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="(512) 000-0000"
                        className="w-full rounded-xl border border-[#d1dbe8] bg-[#f4f7fb] px-4 py-3 text-sm text-[#33415c] placeholder:text-[#33415c]/40 focus:border-[#0077c0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077c0]/20 transition-colors"
                      />
                    </div>

                    {/* Message */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="message"
                        className="mb-1.5 block text-sm font-semibold"
                        style={{ color: '#153fb0' }}
                      >
                        Message <span aria-label="required" style={{ color: '#f5633d' }}>*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        placeholder="Tell us about your dog and any questions you have..."
                        className="w-full resize-none rounded-xl border border-[#d1dbe8] bg-[#f4f7fb] px-4 py-3 text-sm text-[#33415c] placeholder:text-[#33415c]/40 focus:border-[#0077c0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077c0]/20 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full rounded-full py-3.5 text-base font-bold text-white shadow-md transition-all hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto sm:px-10"
                      style={{ backgroundColor: '#f5633d', outlineColor: '#f5633d' }}
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Info cards — col-span-2 */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            {/* Opening hours */}
            <div className="rounded-2xl border border-[#d1dbe8] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: '#0077c0' }}
                  aria-hidden="true"
                >
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-bold" style={{ color: '#153fb0' }}>
                  Opening Hours
                </h3>
              </div>
              <dl className="space-y-2">
                {[
                  { day: 'Monday – Friday', hours: '8:00 am – 6:00 pm' },
                  { day: 'Saturday', hours: '9:00 am – 3:00 pm' },
                  { day: 'Sunday', hours: 'Closed' },
                ].map(({ day, hours }) => (
                  <div key={day} className="flex items-center justify-between">
                    <dt className="text-sm font-medium" style={{ color: '#33415c' }}>
                      {day}
                    </dt>
                    <dd
                      className="text-sm font-semibold"
                      style={{ color: hours === 'Closed' ? '#f5633d' : '#153fb0' }}
                    >
                      {hours}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Contact details */}
            <div className="rounded-2xl border border-[#d1dbe8] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: '#0077c0' }}
                  aria-hidden="true"
                >
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-bold" style={{ color: '#153fb0' }}>
                  Contact
                </h3>
              </div>
              <ul className="space-y-3" role="list">
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 flex-shrink-0" style={{ color: '#0077c0' }} aria-hidden="true" />
                  <div>
                    <a
                      href={PHONE_TEL}
                      className="block text-sm font-semibold transition-colors hover:underline"
                      style={{ color: '#153fb0' }}
                      aria-label={`Call us at ${PHONE_DISPLAY}`}
                    >
                      {PHONE_DISPLAY}
                    </a>
                    <a
                      href={PHONE_SMS}
                      className="text-xs transition-colors hover:underline"
                      style={{ color: '#00a2ee' }}
                      aria-label={`Text us at ${PHONE_DISPLAY}`}
                    >
                      Text us
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 flex-shrink-0" style={{ color: '#0077c0' }} aria-hidden="true" />
                  <a
                    href={`mailto:${EMAIL}`}
                    className="text-sm font-semibold transition-colors hover:underline"
                    style={{ color: '#153fb0' }}
                  >
                    {EMAIL}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <ExternalLink className="h-4 w-4 flex-shrink-0" style={{ color: '#0077c0' }} aria-hidden="true" />
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold transition-colors hover:underline"
                    style={{ color: '#153fb0' }}
                  >
                    Book Online via MoeGo
                  </a>
                </li>
              </ul>
            </div>

            {/* Service area note */}
            <div
              className="rounded-2xl p-5"
              style={{ backgroundColor: '#0077c0' }}
            >
              <p className="text-sm font-bold text-white">
                Service Area Business
              </p>
              <p className="mt-1 text-sm leading-relaxed text-white/80">
                We serve Austin and all of Travis County, TX. We come to your home — no storefront visit required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
