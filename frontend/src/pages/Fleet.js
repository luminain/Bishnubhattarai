import { LuxNavbar } from "@/components/LuxNavbar";
import { Footer } from "@/components/Footer";
import { FleetCards } from "@/components/FleetCards";
import { ConciergeBar } from "@/components/ConciergeBar";
import { Wifi, Shield, Sparkles, Snowflake, Music4, BatteryCharging } from "lucide-react";

const INTERIOR = [
  { icon: Sparkles, label: "Semi-aniline leather", desc: "Hand-stitched Sedona leather captain's chairs." },
  { icon: Wifi, label: "In-car Wi-Fi", desc: "5G hotspot with multiple-device support." },
  { icon: BatteryCharging, label: "Fast charging", desc: "Wireless + USB-C at every seat." },
  { icon: Snowflake, label: "Climate zones", desc: "Per-row temperature control." },
  { icon: Music4, label: "AKG Studio audio", desc: "14-speaker AKG Studio reference sound with active noise cancellation." },
  { icon: Shield, label: "Privacy glass", desc: "Limo-grade tint and optional partition." },
];

export default function Fleet() {
  return (
    <main className="min-h-screen">
      <LuxNavbar />
      <section className="pt-[120px] pb-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <div className="lux-kicker">The Fleet</div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mt-3 text-[#E7EBF2]">
              One Cadillac XT6. <span className="italic text-[#B08D57]">Two trims.</span>
            </h1>
            <p className="mt-3 text-[#C9D0DB]">
              The 2024 Cadillac XT6 in stealth Stellar Black — three rows, Super Cruise hands-free,
              AKG Studio reference audio. Detailed daily. Maintained to factory spec.
            </p>
          </div>
        </div>
      </section>
      <FleetCards />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-2xl mb-10">
            <div className="lux-kicker">Inside every cabin</div>
            <h2 className="font-serif text-3xl sm:text-4xl mt-2 text-[#E7EBF2]">Standard on both vehicles.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INTERIOR.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="card-lux chrome-rule p-6">
                  <Icon size={22} className="text-[#B08D57]" />
                  <div className="font-serif text-xl text-[#E7EBF2] mt-4">{f.label}</div>
                  <div className="text-sm text-[#C9D0DB] mt-1">{f.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <ConciergeBar />
      <Footer />
    </main>
  );
}
