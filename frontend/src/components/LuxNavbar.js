import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HOME } from "@/constants/testIds";
import { Concierge } from "@/lib/api";

export const LuxNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [loc.pathname]);

  const links = [
    { to: "/services", label: "Services" },
    { to: "/fleet", label: "Fleet" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-[#07080A]/95 backdrop-blur-md border-b border-[#232A36]" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-md border border-[#3A465B] bg-[#0F1216] flex items-center justify-center">
            <span className="font-serif text-[#B08D57] text-lg leading-none">BB</span>
          </div>
          <div className="leading-tight">
            <div className="font-serif text-[15px] tracking-wide text-[#E7EBF2]">Bishnu Bhattarai</div>
            <div className="text-[10px] tracking-[0.28em] uppercase text-[#9AA3B2]">Private Chauffeur</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-[13px] tracking-wide uppercase transition-colors ${
                  isActive ? "text-[#B08D57]" : "text-[#C9D0DB] hover:text-white"
                }`
              }
              data-testid={`nav-link-${l.label.toLowerCase()}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href={`tel:${Concierge.phoneRaw}`}
            className="flex items-center gap-2 text-[13px] text-[#C9D0DB] hover:text-white"
            data-testid={HOME.navConcierge}
          >
            <Phone size={14} className="text-[#B08D57]" />
            {Concierge.phone}
          </a>
          <Link
            to="/book"
            className="btn-lux-primary inline-flex items-center justify-center h-10 px-5 rounded-md text-sm"
            data-testid={HOME.navBook}
          >
            Book a Ride
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-md border border-[#2A3342] bg-[#0F1216] text-[#E7EBF2]"
              data-testid={HOME.navMobileToggle}
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#0B0D10] border-l border-[#232A36] text-[#E7EBF2] w-[88%] sm:w-[420px]">
            <div className="mt-6 flex flex-col gap-6">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `font-serif text-2xl ${isActive ? "text-[#B08D57]" : "text-[#E7EBF2]"}`
                  }
                  data-testid={`nav-mobile-link-${l.label.toLowerCase()}`}
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="h-px bg-[#232A36] my-2" />
              <a href={`tel:${Concierge.phoneRaw}`} className="flex items-center gap-2 text-[#C9D0DB]">
                <Phone size={16} className="text-[#B08D57]" /> {Concierge.phone}
              </a>
              <Link to="/book" className="btn-lux-primary inline-flex items-center justify-center h-12 px-6 rounded-md text-sm">
                Book a Ride
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
