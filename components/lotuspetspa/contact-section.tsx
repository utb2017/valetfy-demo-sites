"use client";

import { useState } from "react";
import {
  CalendarCheck,
  CheckCircle,
  Clock,
  Facebook,
  MessageSquare,
  Phone,
} from "lucide-react";

import { hours } from "@/lib/lotuspetspa/guide-data";
import { LOTUS_SITE } from "@/lib/lotuspetspa/site";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section
      id="contact"
      aria-label="Contact Lotus Pet Spa"
      className="scroll-mt-header bg-[#FBFAFD] py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#2E2344] sm:text-4xl md:text-5xl">
              Book the mobile spa
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#35405A] sm:text-lg">
              Use MoeGo for appointments, call or text April at the guide phone
              number, or send a quick question below.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <a
                href={LOTUS_SITE.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-3xl bg-[#4A3B6B] p-5 text-[#FFFFFF] shadow-sm transition hover:bg-[#302348]"
                style={{ color: "#FFFFFF" }}
              >
                <CalendarCheck className="h-6 w-6 shrink-0" aria-hidden="true" />
                <span className="text-sm font-black">Book Online</span>
              </a>
              <a
                href={LOTUS_SITE.phoneTel}
                className="flex items-center gap-3 rounded-3xl border border-[#E7E0F1] bg-white p-5 text-[#2E2344] shadow-sm transition hover:border-[#C9A66B]"
                style={{ color: "#2E2344" }}
              >
                <Phone className="h-6 w-6 shrink-0 text-[#4A3B6B]" aria-hidden="true" />
                <span className="text-sm font-black">{LOTUS_SITE.phoneDisplay}</span>
              </a>
              <a
                href={LOTUS_SITE.smsUrl}
                className="flex items-center gap-3 rounded-3xl border border-[#E7E0F1] bg-white p-5 text-[#2E2344] shadow-sm transition hover:border-[#C9A66B]"
                style={{ color: "#2E2344" }}
              >
                <MessageSquare className="h-6 w-6 shrink-0 text-[#4A3B6B]" aria-hidden="true" />
                <span className="text-sm font-black">Text April</span>
              </a>
            </div>

            <div className="mt-8 rounded-3xl border border-[#E7E0F1] bg-[#FFFFFF] p-6 shadow-sm">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="mb-4 h-14 w-14 text-[#4A3B6B]" aria-hidden="true" />
                  <h3 className="text-xl font-black text-[#2E2344]">
                    Message ready to send
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#35405A]">
                    Thanks for reaching out. MoeGo is still the fastest way to
                    book an appointment.
                  </p>
                </div>
              ) : (
                <form
                  action="https://formsubmit.co/bear@valetfy.com"
                  method="POST"
                  onSubmit={() => setSubmitted(true)}
                  aria-label="Contact form"
                >
                  <input type="hidden" name="_subject" value="New Lotus Pet Spa Mobile lead" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_template" value="table" />
                  <input type="text" name="_honey" className="hidden" tabIndex={-1} aria-hidden="true" />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-bold text-[#2E2344]">Name</span>
                      <input
                        name="name"
                        required
                        autoComplete="name"
                        className="mt-2 w-full rounded-2xl border border-[#DED6EB] bg-[#FBFAFD] px-4 py-3 text-sm text-[#35405A] outline-none transition focus:border-[#4A3B6B] focus:bg-white focus:ring-2 focus:ring-[#4A3B6B]/15"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-bold text-[#2E2344]">Phone</span>
                      <input
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        className="mt-2 w-full rounded-2xl border border-[#DED6EB] bg-[#FBFAFD] px-4 py-3 text-sm text-[#35405A] outline-none transition focus:border-[#4A3B6B] focus:bg-white focus:ring-2 focus:ring-[#4A3B6B]/15"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="text-sm font-bold text-[#2E2344]">Message</span>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        className="mt-2 w-full resize-none rounded-2xl border border-[#DED6EB] bg-[#FBFAFD] px-4 py-3 text-sm text-[#35405A] outline-none transition focus:border-[#4A3B6B] focus:bg-white focus:ring-2 focus:ring-[#4A3B6B]/15"
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="mt-5 rounded-full bg-[#C9A66B] px-7 py-3 text-sm font-black text-[#241A36] shadow-sm transition hover:bg-[#D9B875]"
                  >
                    Send Question
                  </button>
                </form>
              )}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-3xl bg-[#2E2344] p-6 text-[#FFFFFF] shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFFFFF]/10">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-black">Hours</h3>
              </div>
              <dl className="mt-5 space-y-3">
                {hours.map(({ day, hours: openHours }) => (
                  <div key={day} className="flex justify-between gap-4 text-sm">
                    <dt className="text-[#DCD5EA]">{day}</dt>
                    <dd className="font-black text-[#FFFFFF]">{openHours}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-3xl border border-[#E7E0F1] bg-[#FFFFFF] p-6 shadow-sm">
              <h3 className="text-lg font-black text-[#2E2344]">
                Links from the guide
              </h3>
              <div className="mt-4 grid gap-3">
                <a
                  href={LOTUS_SITE.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-2xl bg-[#F3EFF8] px-4 py-3 text-sm font-black text-[#4A3B6B]"
                  style={{ color: "#4A3B6B" }}
                >
                  <Facebook className="h-5 w-5" aria-hidden="true" />
                  Facebook
                </a>
                <a
                  href={LOTUS_SITE.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-2xl bg-[#F3EFF8] px-4 py-3 text-sm font-black text-[#4A3B6B]"
                  style={{ color: "#4A3B6B" }}
                >
                  lotuspetspamobile.com
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
