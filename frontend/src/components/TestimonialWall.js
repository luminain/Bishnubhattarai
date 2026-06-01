const TESTIMONIALS = [
  {
    quote: "Bishnu is the only chauffeur I'll use in the Bay. He knows the back roads to Napa better than my CFO knows our balance sheet.",
    name: "M. Hartwell",
    title: "Managing Partner, SF Family Office",
  },
  {
    quote: "Punctual to the second, immaculate cabin, and absolute discretion during a sensitive roadshow week.",
    name: "K. Patel",
    title: "VP Communications, Series-B SaaS",
  },
  {
    quote: "Our wedding party of 11 — four cars, three pickups, one timeline. Flawless.",
    name: "A. & D. Romero",
    title: "Wedding clients, Carmel-by-the-Sea",
  },
  {
    quote: "Late-night SFO arrival, lost luggage drama. Bishnu rebooked, waited, drove us home. Above & beyond.",
    name: "S. Lin",
    title: "Executive Producer, Bay Area",
  },
  {
    quote: "The Escalade interior was as good as the Lufthansa First lounge. High praise.",
    name: "R. Achebe",
    title: "Frequent flyer — SFO",
  },
  {
    quote: "Bishnu treats every ride like he's chauffeuring royalty. Because to him, you are.",
    name: "J. Whitfield",
    title: "Tech investor",
  },
];

export const TestimonialWall = () => {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="lux-kicker">In their own words</div>
          <h2 className="font-serif text-3xl sm:text-5xl mt-2 text-[#E7EBF2]">
            Trusted by the <span className="italic text-[#B08D57]">Bay's finest</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <figure key={i} className="card-lux chrome-rule p-7 flex flex-col" data-testid={`testimonial-${i}`}>
              <div className="font-serif text-3xl text-[#B08D57] leading-none">“</div>
              <blockquote className="mt-3 text-[#E7EBF2] leading-relaxed text-[15px]">{t.quote}</blockquote>
              <figcaption className="mt-6 pt-5 border-t border-[#232A36]">
                <div className="font-serif text-base text-[#E7EBF2]">{t.name}</div>
                <div className="text-xs text-[#9AA3B2]">{t.title}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
