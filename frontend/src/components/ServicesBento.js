import { Plane, Wine, Briefcase, Clock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const SERVICES = [
  {
    key: "airport",
    title: "Airport Transfer",
    desc: "SFO, OAK, SJC. Live flight tracking. Curbside or door-side. 60 min complimentary wait.",
    icon: Plane,
    accent: "from $110",
    img: "https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?auto=format&fit=crop&w=1200&q=80",
    span: "lg:col-span-7",
  },
  {
    key: "winery",
    title: "Napa & Sonoma",
    desc: "Full-day chauffeured winery tours. Custom itineraries through Napa, Sonoma, Carneros.",
    icon: Wine,
    accent: "from $1,020/day",
    img: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80",
    span: "lg:col-span-5",
  },
  {
    key: "corporate",
    title: "Corporate Executive",
    desc: "Roadshows, board meetings, investor days. NDA on request. Discreet, on-brief.",
    icon: Briefcase,
    accent: "from $140",
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80",
    span: "lg:col-span-4",
  },
  {
    key: "hourly",
    title: "Hourly Charter",
    desc: "On-demand multi-stop service. $145/hr, 3-hour minimum. Perfect for evenings out.",
    icon: Clock,
    accent: "$145/hr",
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    span: "lg:col-span-4",
  },
  {
    key: "event",
    title: "Events & Weddings",
    desc: "Galas, premieres, weddings, anniversaries. White-glove arrival every time.",
    icon: Sparkles,
    accent: "from $250",
    img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    span: "lg:col-span-4",
  },
];

export const ServicesBento = () => {
  return (
    <section id="services" className="relative py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div>
            <div className="lux-kicker">Services</div>
            <h2 className="font-serif text-3xl sm:text-5xl mt-2 text-[#E7EBF2] max-w-2xl">
              Tailored mobility for the <span className="italic text-[#B08D57]">most demanding</span> calendars.
            </h2>
          </div>
          <Link to="/services" className="btn-lux-secondary inline-flex items-center justify-center h-11 px-5 rounded-md text-sm">
            View all services
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.key}
                to="/services"
                className={`card-lux chrome-rule relative overflow-hidden group ${s.span} min-h-[260px]`}
                data-testid={`service-card-${s.key}`}
              >
                <div
                  className="absolute inset-0 opacity-25 group-hover:opacity-40 transition-opacity"
                  style={{
                    backgroundImage: `url(${s.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "grayscale(60%) brightness(0.7)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1216] via-[#0F1216]/85 to-transparent" />
                <div className="relative p-6 lg:p-7 h-full flex flex-col">
                  <div className="flex items-start justify-between">
                    <Icon size={26} className="text-[#B08D57]" />
                    <div className="font-mono text-[11px] text-[#9AA3B2] tracking-widest">{s.accent}</div>
                  </div>
                  <div className="mt-auto">
                    <h3 className="font-serif text-2xl text-[#E7EBF2]">{s.title}</h3>
                    <p className="mt-2 text-sm text-[#C9D0DB] max-w-md">{s.desc}</p>
                    <div className="mt-4 text-[12px] tracking-[0.22em] uppercase text-[#B08D57] group-hover:translate-x-1 transition-transform">
                      Explore →
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
