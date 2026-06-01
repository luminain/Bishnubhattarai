import { useEffect, useRef } from "react";

const CHIPS = [
  "SFO", "OAK", "SJC", "Downtown SF", "Palo Alto", "Napa Valley", "Sonoma",
  "Sausalito", "Berkeley", "Mountain View", "Half Moon Bay", "Carmel",
  "San Jose", "Oakland", "Marin",
];

export const ServiceAreaMarquee = () => {
  const trackRef = useRef(null);
  useEffect(() => {
    // Duplicate content for seamless loop is done via JSX below
  }, []);

  return (
    <section className="relative bg-[#07080A] border-y border-[#232A36] py-8 overflow-hidden marquee-wrap">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#07080A] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#07080A] to-transparent z-10 pointer-events-none" />
      <div className="flex w-max marquee-track" ref={trackRef}>
        {[...CHIPS, ...CHIPS].map((c, i) => (
          <div key={i} className="flex items-center gap-6 px-8">
            <span className="font-serif text-2xl text-[#E7EBF2]">{c}</span>
            <span className="h-1 w-1 rounded-full bg-[#B08D57]" />
          </div>
        ))}
      </div>
    </section>
  );
};
