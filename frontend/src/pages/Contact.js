import { LuxNavbar } from "@/components/LuxNavbar";
import { Footer } from "@/components/Footer";
import { ConciergeBar } from "@/components/ConciergeBar";
import { MapPin, Clock } from "lucide-react";

export default function Contact() {
  return (
    <main className="min-h-screen">
      <LuxNavbar />
      <section className="pt-[120px] pb-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <div className="lux-kicker">Contact</div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mt-3 text-[#E7EBF2]">
              Reach <span className="italic text-[#B08D57]">Bishnu</span> directly.
            </h1>
            <p className="mt-3 text-[#C9D0DB]">
              For reservations, multi-day quotes, NDAs, or special requests — use any channel below.
              Concierge is staffed 24/7.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="card-lux chrome-rule p-7 lg:col-span-2">
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-[#B08D57]" />
                <div className="font-serif text-2xl text-[#E7EBF2]">Service area</div>
              </div>
              <p className="mt-3 text-[#C9D0DB]">
                We serve the entire San Francisco Bay Area and beyond — SFO, OAK, SJC, STS airports;
                Napa & Sonoma wine country; Marin, Peninsula, South Bay, East Bay; and special runs to
                Carmel-by-the-Sea, Big Sur, Lake Tahoe.
              </p>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {["SFO", "OAK", "SJC", "SF", "Palo Alto", "San Jose", "Oakland", "Berkeley", "Marin", "Sausalito", "Napa", "Sonoma", "Half Moon Bay", "Carmel", "Tahoe", "Big Sur"].map((p) => (
                  <span key={p} className="px-3 py-1.5 rounded-full border border-[#2A3342] text-[#C9D0DB] text-center">{p}</span>
                ))}
              </div>
            </div>

            <div className="card-lux chrome-rule p-7">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-[#B08D57]" />
                <div className="font-serif text-2xl text-[#E7EBF2]">Hours</div>
              </div>
              <ul className="mt-4 text-sm text-[#C9D0DB] space-y-1.5">
                <li>Reservations: 24/7</li>
                <li>Last-minute: Best-effort within 90 min</li>
                <li>Late-night surcharge: 10pm – 6am</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <ConciergeBar />
      <Footer />
    </main>
  );
}
