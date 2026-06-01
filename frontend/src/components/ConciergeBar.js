import { Phone, MessageSquare, Mail, Send } from "lucide-react";
import { Concierge } from "@/lib/api";

export const ConciergeBar = () => {
  return (
    <section id="concierge" className="relative py-20 lg:py-28 bg-[#0B0D10] border-y border-[#232A36] overflow-hidden">
      <div className="noise-overlay" />
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="lux-kicker">Direct line to Bishnu</div>
          <h2 className="font-serif text-3xl sm:text-5xl mt-3 text-[#E7EBF2]">
            One tap. <span className="text-[#B08D57] italic">Always answered.</span>
          </h2>
          <p className="mt-4 text-[#C9D0DB] leading-relaxed">
            VIP concierge available 24/7 for last-minute reservations, multi-stop
            itineraries, and discreet executive transport across the Bay.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href={`tel:${Concierge.phoneRaw}`} className="card-lux chrome-rule p-6 flex flex-col gap-3" data-testid="concierge-call">
            <Phone size={22} className="text-[#B08D57]" />
            <div className="font-serif text-xl text-[#E7EBF2]">Call</div>
            <div className="font-mono text-sm text-[#C9D0DB]">{Concierge.phone}</div>
            <div className="text-xs text-[#9AA3B2] mt-auto">Tap to dial →</div>
          </a>
          <a href={`sms:${Concierge.phoneRaw}`} className="card-lux chrome-rule p-6 flex flex-col gap-3" data-testid="concierge-sms">
            <Send size={22} className="text-[#B08D57]" />
            <div className="font-serif text-xl text-[#E7EBF2]">SMS</div>
            <div className="text-sm text-[#C9D0DB]">Quick text replies</div>
            <div className="text-xs text-[#9AA3B2] mt-auto">Text concierge →</div>
          </a>
          <a href={`https://wa.me/${Concierge.whatsapp}`} target="_blank" rel="noreferrer" className="card-lux chrome-rule p-6 flex flex-col gap-3" data-testid="concierge-whatsapp">
            <MessageSquare size={22} className="text-[#B08D57]" />
            <div className="font-serif text-xl text-[#E7EBF2]">WhatsApp</div>
            <div className="text-sm text-[#C9D0DB]">International friendly</div>
            <div className="text-xs text-[#9AA3B2] mt-auto">Open WhatsApp →</div>
          </a>
          <a href={`mailto:${Concierge.email}`} className="card-lux chrome-rule p-6 flex flex-col gap-3" data-testid="concierge-email">
            <Mail size={22} className="text-[#B08D57]" />
            <div className="font-serif text-xl text-[#E7EBF2]">Email</div>
            <div className="text-sm text-[#C9D0DB] break-all">{Concierge.email}</div>
            <div className="text-xs text-[#9AA3B2] mt-auto">Compose email →</div>
          </a>
        </div>
      </div>
    </section>
  );
};
