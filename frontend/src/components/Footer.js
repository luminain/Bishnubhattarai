import { Link } from "react-router-dom";
import { Phone, Mail, MessageSquare, MapPin } from "lucide-react";
import { Concierge } from "@/lib/api";

export const Footer = () => {
  return (
    <footer className="relative bg-[#07080A] border-t border-[#232A36] pt-16 pb-10 overflow-hidden">
      <div className="noise-overlay" />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md border border-[#3A465B] bg-[#0F1216] flex items-center justify-center">
              <span className="font-serif text-[#B08D57] text-lg">BB</span>
            </div>
            <div className="leading-tight">
              <div className="font-serif text-base text-[#E7EBF2]">Bishnu Bhattarai</div>
              <div className="text-[10px] tracking-[0.28em] uppercase text-[#9AA3B2]">Private Chauffeur</div>
            </div>
          </div>
          <p className="mt-5 text-sm text-[#C9D0DB] leading-relaxed max-w-sm">
            Discreet, punctual, impeccably maintained luxury car service across
            the San Francisco Bay Area. Cadillac Escalade & CT6 fleet.
          </p>
          <div className="mt-5 flex items-center gap-2 text-[#9AA3B2] text-sm">
            <MapPin size={14} className="text-[#B08D57]" />
            San Francisco Bay Area · Napa · Sonoma · Carmel
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="lux-kicker mb-4">Services</div>
          <ul className="space-y-2.5 text-sm text-[#C9D0DB]">
            <li><Link to="/services" className="hover:text-white">Airport Transfer</Link></li>
            <li><Link to="/services" className="hover:text-white">Winery Tours</Link></li>
            <li><Link to="/services" className="hover:text-white">Corporate</Link></li>
            <li><Link to="/services" className="hover:text-white">Hourly Charter</Link></li>
            <li><Link to="/services" className="hover:text-white">Events & Weddings</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <div className="lux-kicker mb-4">Airports</div>
          <ul className="space-y-2.5 text-sm text-[#C9D0DB]">
            <li>SFO — San Francisco</li>
            <li>OAK — Oakland</li>
            <li>SJC — San Jose</li>
            <li>STS — Sonoma County</li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <div className="lux-kicker mb-4">Concierge — 24/7</div>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={`tel:${Concierge.phoneRaw}`} className="flex items-center gap-3 text-[#E7EBF2] hover:text-[#B08D57]">
                <Phone size={15} className="text-[#B08D57]" /> {Concierge.phone}
              </a>
            </li>
            <li>
              <a href={`sms:${Concierge.phoneRaw}`} className="flex items-center gap-3 text-[#E7EBF2] hover:text-[#B08D57]">
                <MessageSquare size={15} className="text-[#B08D57]" /> Text concierge
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${Concierge.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[#E7EBF2] hover:text-[#B08D57]">
                <MessageSquare size={15} className="text-[#B08D57]" /> WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${Concierge.email}`} className="flex items-center gap-3 text-[#E7EBF2] hover:text-[#B08D57]">
                <Mail size={15} className="text-[#B08D57]" /> {Concierge.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 mt-12">
        <div className="lux-divider" />
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9AA3B2]">
          <div>© {new Date().getFullYear()} Bishnu Bhattarai. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-white">About</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
            <span>Licensed & insured TCP carrier</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
