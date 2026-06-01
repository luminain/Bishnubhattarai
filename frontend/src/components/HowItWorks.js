import { Search, CheckCircle2, Car } from "lucide-react";

const STEPS = [
  { icon: Search, title: "Request", desc: "Tell us your itinerary in under 90 seconds. Live quote, no obligation." },
  { icon: CheckCircle2, title: "Confirm", desc: "Bishnu personally reviews & confirms within minutes. You'll get a code & ETA." },
  { icon: Car, title: "Ride", desc: "Discreet curbside arrival. Cool water, calm cabin, your favourite playlist on request." },
];

export const HowItWorks = () => {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="lux-kicker">How it works</div>
          <h2 className="font-serif text-3xl sm:text-5xl mt-2 text-[#E7EBF2]">
            Three quiet steps. <span className="italic text-[#B08D57]">Zero friction.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[#3A465B] to-transparent" />
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="card-lux chrome-rule p-7 relative" data-testid={`how-step-${i}`}>
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-full border border-[#3A465B] bg-[#0B0D10] flex items-center justify-center">
                    <Icon size={20} className="text-[#B08D57]" />
                  </div>
                  <div className="font-mono text-xs tracking-[0.22em] text-[#9AA3B2]">0{i + 1}</div>
                </div>
                <h3 className="font-serif text-2xl mt-5 text-[#E7EBF2]">{s.title}</h3>
                <p className="mt-2 text-sm text-[#C9D0DB] leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
