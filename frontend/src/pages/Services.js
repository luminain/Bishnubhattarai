import { LuxNavbar } from "@/components/LuxNavbar";
import { Footer } from "@/components/Footer";
import { ConciergeBar } from "@/components/ConciergeBar";
import { Plane, Wine, Briefcase, Clock, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const SERVICES = [
  {
    key: "airport",
    icon: Plane,
    title: "Airport Transfer",
    tagline: "SFO, OAK, SJC — flight-tracked, curbside or door-side.",
    details: [
      "Live flight tracking; we adjust to delays",
      "60 min complimentary wait time on arrivals",
      "Meet & greet at baggage claim (luxury package)",
      "Door-to-door door-side service",
    ],
    from: "from $110",
  },
  {
    key: "winery",
    icon: Wine,
    title: "Napa & Sonoma Tours",
    tagline: "All-day chauffeured wine country at your pace.",
    details: [
      "6-hour minimum, full-day available",
      "Custom itinerary across Napa, Sonoma, Carneros",
      "Reservation help at top-tier wineries",
      "Coolers, water, and ice on board",
    ],
    from: "from $1,020 / day",
  },
  {
    key: "corporate",
    icon: Briefcase,
    title: "Corporate & Executive",
    tagline: "Roadshows, board meetings, investor days — on-brief.",
    details: [
      "NDA on request",
      "Multi-day, multi-stop scheduling",
      "Quiet cabin, Wi-Fi, charging",
      "Invoice billing for verified businesses",
    ],
    from: "from $140",
  },
  {
    key: "hourly",
    icon: Clock,
    title: "Hourly Charter",
    tagline: "On-demand multi-stop service, evenings out.",
    details: [
      "$145/hour, 3-hour minimum",
      "Open itinerary, change as you go",
      "Perfect for dinners, theatre, restaurant hops",
      "Wait time included",
    ],
    from: "$145 / hour",
  },
  {
    key: "event",
    icon: Sparkles,
    title: "Events & Weddings",
    tagline: "White-glove arrivals for the most important days.",
    details: [
      "Galas, premieres, weddings, anniversaries",
      "Coordinated multi-car timing",
      "Champagne service available",
      "Photography-friendly pickup choreography",
    ],
    from: "from $250",
  },
];

export default function Services() {
  return (
    <main className="min-h-screen">
      <LuxNavbar />
      <section className="pt-[120px] pb-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <div className="lux-kicker">Services</div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mt-3 text-[#E7EBF2]">
              Built for the <span className="italic text-[#B08D57]">moments that matter</span>.
            </h1>
            <p className="mt-3 text-[#C9D0DB]">
              Every itinerary is treated as bespoke. From last-minute SFO pickups to multi-day winery tours.
            </p>
          </div>

          <div className="mt-12 space-y-5">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <article key={s.key} className="card-lux chrome-rule p-7 lg:p-9 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-4 flex flex-col">
                    <div className="flex items-center gap-3">
                      <Icon size={26} className="text-[#B08D57]" />
                      <div className="font-mono text-xs text-[#9AA3B2] tracking-[0.22em]">0{i + 1}</div>
                    </div>
                    <h2 className="font-serif text-3xl text-[#E7EBF2] mt-4">{s.title}</h2>
                    <div className="text-sm text-[#9AA3B2] mt-2">{s.from}</div>
                  </div>
                  <div className="lg:col-span-8">
                    <p className="text-[#C9D0DB] text-base">{s.tagline}</p>
                    <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
                      {s.details.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-[#C9D0DB]">
                          <span className="mt-1.5 h-1 w-1 rounded-full bg-[#B08D57] shrink-0" /> {d}
                        </li>
                      ))}
                    </ul>
                    <Link to={`/book?service=${s.key}`} className="mt-6 inline-flex items-center gap-2 text-[#B08D57] hover:text-[#C19A60] text-sm">
                      Reserve {s.title} <ArrowRight size={15} />
                    </Link>
                  </div>
                </article>
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
