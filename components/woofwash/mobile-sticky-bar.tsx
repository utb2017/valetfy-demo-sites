import { Phone, Calendar, MessageSquare } from 'lucide-react'

const BOOKING_URL = 'https://booking.moego.pet/ol/book?name=WoofWash'
const PHONE_TEL = 'tel:+15125228417'
const SMS_URL = 'sms:+15125228417'

export function MobileStickyBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/20 sm:hidden"
      style={{ backgroundColor: '#0077c0' }}
      role="navigation"
      aria-label="Quick actions"
    >
      <div className="flex items-stretch">
        <a
          href={PHONE_TEL}
          className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-white/90 transition-colors hover:bg-white/10 hover:text-white active:bg-white/20"
          aria-label="Call Woof Wash"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
          <span className="text-[10px] font-semibold uppercase tracking-wide">Call</span>
        </a>

        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-white transition-colors hover:brightness-110 active:brightness-90"
          style={{ backgroundColor: '#f5633d' }}
          aria-label="Book grooming appointment"
        >
          <Calendar className="h-5 w-5" aria-hidden="true" />
          <span className="text-[10px] font-bold uppercase tracking-wide">Book</span>
        </a>

        <a
          href={SMS_URL}
          className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-white/90 transition-colors hover:bg-white/10 hover:text-white active:bg-white/20"
          aria-label="Text Woof Wash"
        >
          <MessageSquare className="h-5 w-5" aria-hidden="true" />
          <span className="text-[10px] font-semibold uppercase tracking-wide">Text</span>
        </a>
      </div>

      {/* Safe area spacer for iOS */}
      <div className="h-safe-area-inset-bottom" aria-hidden="true" />
    </div>
  )
}
