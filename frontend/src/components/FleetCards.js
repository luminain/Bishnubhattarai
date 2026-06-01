import { Link } from "react-router-dom";
import { Users, Briefcase, Wifi, Shield } from "lucide-react";

const FLEET = [
  {
    key: "xt6",
    name: "Cadillac XT6",
    tag: "Flagship 3-Row Crossover",
    seats: "6 passengers · 6 bags",
    desc: "Blacked-out 2024 XT6 Premium Luxury. Three-row crossover with Super Cruise, AKG Studio 14-speaker audio, and panoramic moonroof.",
    img: "https://images.unsplash.com/photo-1632239524459-5c3137fcdae9?auto=format&fit=crop&w=1400&q=85",
    perks: ["Wi-Fi hotspot", "Privacy glass", "Heated & ventilated seats", "Quad-zone climate"],
  },
  {
    key: "xt6-platinum",
    name: "Cadillac XT6 Platinum",
    tag: "Executive Edition",
    seats: "6 passengers · 6 bags",
    desc: "Top-trim XT6 Platinum with semi-aniline leather captain's chairs, massage seats, Super Cruise hands-free driving, and night-vision package.",
    img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=85",
    perks: ["Wi-Fi hotspot", "Massage seats", "Super Cruise", "Night-vision package"],
  },
];

export const FleetCards = () => {
  return (
    <section id="fleet" className="relative py-20 lg:py-28 bg-[#0B0D10]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="lux-kicker">The Fleet</div>
          <h2 className="font-serif text-3xl sm:text-5xl mt-2 text-[#E7EBF2]">
            Two trims. <span className="italic text-[#B08D57]">One signature.</span>
          </h2>
          <p className="mt-4 text-[#C9D0DB]">
            Both Cadillac XT6 builds are detailed daily and maintained to factory spec.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {FLEET.map((v) => (
            <article key={v.key} className="card-lux chrome-rule overflow-hidden" data-testid={`fleet-card-${v.key}`}>
              <div className="relative h-72" style={{ backgroundImage: `url(${v.img})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1216] via-transparent to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0F1216]/80 border border-[#3A465B] text-[10px] tracking-[0.28em] uppercase text-[#B08D57]">
                  {v.tag}
                </div>
              </div>
              <div className="p-7">
                <h3 className="font-serif text-3xl text-[#E7EBF2]">{v.name}</h3>
                <div className="mt-2 flex items-center gap-4 text-sm text-[#9AA3B2]">
                  <span className="flex items-center gap-1.5"><Users size={14} /> {v.seats}</span>
                </div>
                <p className="mt-4 text-[#C9D0DB] leading-relaxed">{v.desc}</p>
                <ul className="mt-5 grid grid-cols-2 gap-3">
                  {v.perks.map((p, i) => {
                    const Icon = [Wifi, Shield, Briefcase, Users][i % 4];
                    return (
                      <li key={p} className="flex items-center gap-2 text-sm text-[#C9D0DB]">
                        <Icon size={14} className="text-[#B08D57]" /> {p}
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-7 flex items-center gap-3">
                  <Link to={`/book?vehicle=${v.name}`} className="btn-lux-primary inline-flex items-center justify-center h-11 px-5 rounded-md text-sm">
                    Reserve this vehicle
                  </Link>
                  <Link to="/fleet" className="btn-lux-secondary inline-flex items-center justify-center h-11 px-5 rounded-md text-sm">
                    Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
