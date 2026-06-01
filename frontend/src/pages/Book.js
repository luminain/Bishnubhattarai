import { LuxNavbar } from "@/components/LuxNavbar";
import { Footer } from "@/components/Footer";
import BookingStepper from "@/components/BookingStepper";

export default function Book() {
  return (
    <main className="min-h-screen bg-[#07080A]">
      <LuxNavbar />
      <section className="pt-[120px] pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="mb-10 max-w-2xl">
            <div className="lux-kicker">Reserve your chauffeur</div>
            <h1 className="font-serif text-4xl sm:text-5xl mt-3 text-[#E7EBF2]">
              Book a ride in <span className="italic text-[#B08D57]">90 seconds</span>.
            </h1>
            <p className="mt-3 text-[#C9D0DB]">
              Live pricing. No hidden fees. Personally confirmed by Bishnu within minutes.
            </p>
          </div>
          <BookingStepper />
        </div>
      </section>
      <Footer />
    </main>
  );
}
