import { Clock, Plane, ShieldCheck, EyeOff } from "lucide-react";

const ITEMS = [
  { icon: Clock, label: "On-time guarantee", desc: "Arrival window ± 5 min" },
  { icon: Plane, label: "Live flight tracking", desc: "60 min complimentary wait" },
  { icon: ShieldCheck, label: "TCP licensed & insured", desc: "CA PSC compliant" },
  { icon: EyeOff, label: "Absolute discretion", desc: "NDA available on request" },
];

export const TrustStrip = () => {
  return (
    <section className="relative bg-[#0B0D10] border-y border-[#232A36]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.label} className="flex items-start gap-4">
              <div className="h-11 w-11 shrink-0 rounded-full border border-[#3A465B] bg-[#0F1216] flex items-center justify-center">
                <Icon size={18} className="text-[#B08D57]" />
              </div>
              <div>
                <div className="font-serif text-lg text-[#E7EBF2]">{it.label}</div>
                <div className="text-[12px] text-[#9AA3B2]">{it.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
