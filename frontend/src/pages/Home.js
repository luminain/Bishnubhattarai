import { LuxNavbar } from "@/components/LuxNavbar";
import { Footer } from "@/components/Footer";
import { HeroCadillac3D } from "@/components/HeroCadillac3D";
import { TrustStrip } from "@/components/TrustStrip";
import { ServicesBento } from "@/components/ServicesBento";
import { FleetCards } from "@/components/FleetCards";
import { HowItWorks } from "@/components/HowItWorks";
import { TestimonialWall } from "@/components/TestimonialWall";
import { ConciergeBar } from "@/components/ConciergeBar";
import { ServiceAreaMarquee } from "@/components/ServiceAreaMarquee";

export default function Home() {
  return (
    <main className="relative">
      <LuxNavbar />
      <HeroCadillac3D />
      <TrustStrip />
      <ServicesBento />
      <ServiceAreaMarquee />
      <FleetCards />
      <HowItWorks />
      <TestimonialWall />
      <ConciergeBar />
      <Footer />
    </main>
  );
}
