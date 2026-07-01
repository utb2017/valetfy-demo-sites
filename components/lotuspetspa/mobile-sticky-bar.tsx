import { Calendar, MessageSquare, Phone } from "lucide-react";

import { LOTUS_SITE } from "@/lib/lotuspetspa/site";

export function MobileStickyBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#FFFFFF]/15 bg-[#4A3B6B] sm:hidden"
      role="navigation"
      aria-label="Quick actions"
    >
      <div className="grid grid-cols-3">
        <a
          href={LOTUS_SITE.phoneTel}
          className="flex flex-col items-center justify-center gap-1 py-3 text-[#FFFFFF] transition hover:bg-[#FFFFFF]/10 hover:text-[#FFFFFF]"
          style={{ color: "#FFFFFF" }}
          aria-label="Call Lotus Pet Spa"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
          <span className="text-[10px] font-black uppercase tracking-wide">Call</span>
        </a>

        <a
          href={LOTUS_SITE.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 bg-[#C9A66B] py-3 text-[#241A36] transition hover:bg-[#D9B875]"
          style={{ color: "#241A36" }}
          aria-label="Book grooming appointment"
        >
          <Calendar className="h-5 w-5" aria-hidden="true" />
          <span className="text-[10px] font-black uppercase tracking-wide">Book</span>
        </a>

        <a
          href={LOTUS_SITE.smsUrl}
          className="flex flex-col items-center justify-center gap-1 py-3 text-[#FFFFFF] transition hover:bg-[#FFFFFF]/10 hover:text-[#FFFFFF]"
          style={{ color: "#FFFFFF" }}
          aria-label="Text Lotus Pet Spa"
        >
          <MessageSquare className="h-5 w-5" aria-hidden="true" />
          <span className="text-[10px] font-black uppercase tracking-wide">Text</span>
        </a>
      </div>
    </div>
  );
}
