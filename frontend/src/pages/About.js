import { LuxNavbar } from "@/components/LuxNavbar";
import { Footer } from "@/components/Footer";
import { ConciergeBar } from "@/components/ConciergeBar";
import { ShieldCheck, Award, Star, MapPin } from "lucide-react";

export default function About() {
  return (
    <main className="min-h-screen">
      <LuxNavbar />
      <section className="pt-[120px] pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1633130664306-2e6acb58d308?auto=format&fit=crop&w=1600&q=80)",
            backgroundSize: "cover", backgroundPosition: "center",
            filter: "grayscale(80%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07080A]/70 via-[#07080A]/85 to-[#07080A]" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <div className="lux-kicker">About</div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mt-3 text-[#E7EBF2]">
              I'm Bishnu. <br /> <span className="italic text-[#B08D57]">Your driver. Your steward.</span>
            </h1>
            <p className="mt-5 text-[#C9D0DB] leading-relaxed text-lg">
              For twelve years I've been driving discerning clients across the Bay — from
              early-flight executives to wedding parties in Carmel and winemakers in Napa. This
              isn't a fleet operation. It's me, my Cadillac, and the relationships I keep.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="card-lux chrome-rule p-8 lg:p-10">
            <h2 className="font-serif text-3xl text-[#E7EBF2]">My standard</h2>
            <ul className="mt-6 space-y-4 text-[#C9D0DB] text-sm">
              <li className="flex gap-3"><ShieldCheck size={18} className="text-[#B08D57] mt-0.5 shrink-0" /> TCP-licensed, fully insured, CPUC-compliant.</li>
              <li className="flex gap-3"><Award size={18} className="text-[#B08D57] mt-0.5 shrink-0" /> Defensive Driving certified; CPR & first-aid trained.</li>
              <li className="flex gap-3"><Star size={18} className="text-[#B08D57] mt-0.5 shrink-0" /> 5.0 average across hundreds of repeat clients.</li>
              <li className="flex gap-3"><MapPin size={18} className="text-[#B08D57] mt-0.5 shrink-0" /> Bay Area native knowledge — back roads, shortcuts, the right entrance.</li>
            </ul>
          </div>
          <div className="card-lux chrome-rule p-8 lg:p-10">
            <h2 className="font-serif text-3xl text-[#E7EBF2]">How I work</h2>
            <p className="mt-4 text-[#C9D0DB] leading-relaxed">
              I personally answer every reservation. If you're a returning client, I'll remember
              your seat temperature, your route preferences, even the music you like. If you're new,
              I'll learn quickly. I treat every ride like I'm chauffeuring family.
            </p>
            <p className="mt-4 text-[#C9D0DB] leading-relaxed">
              The cabin is your office, your green room, your sanctuary. I stay quiet unless you
              invite conversation. And I never miss a flight.
            </p>
          </div>
        </div>
      </section>

      <ConciergeBar />
      <Footer />
    </main>
  );
}
