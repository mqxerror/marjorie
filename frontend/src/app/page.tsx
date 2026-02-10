import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SkipLink } from '@/components/shared/SkipLink';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { HeroSection } from '@/components/sections/HeroSection';
import { WhyCaregivers } from '@/components/sections/WhyCaregivers';
import { AboutEB3 } from '@/components/sections/AboutEB3';
import { EB3Highlights } from '@/components/sections/EB3Highlights';
import { UrgencyCTA } from '@/components/sections/UrgencyCTA';
import { StepByStep } from '@/components/sections/StepByStep';
import { AboutUs } from '@/components/sections/AboutUs';
import { StatsCounter } from '@/components/sections/StatsCounter';
import { FAQSection } from '@/components/sections/FAQSection';
import { FinalCTA } from '@/components/sections/FinalCTA';

export default function LandingPage() {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main-content" className="min-h-screen">
        <HeroSection />
        <SectionDivider variant="fade" fromDark />
        {/* Hero (dark) → WhyCaregivers (light) */}
        <WhyCaregivers />
        <SectionDivider variant="light-break" />
        {/* WhyCaregivers (light) → AboutEB3 (light) */}
        <AboutEB3 />
        <SectionDivider variant="fade" />
        {/* AboutEB3 (light) → EB3Highlights (dark) */}
        <EB3Highlights />
        <SectionDivider variant="dark-break" />
        {/* EB3Highlights (dark) → UrgencyCTA (dark) */}
        <UrgencyCTA />
        <SectionDivider variant="fade" fromDark />
        {/* UrgencyCTA (dark) → StepByStep (light) */}
        <StepByStep />
        <SectionDivider variant="fade" />
        {/* StepByStep (light) → AboutUs (dark) */}
        <AboutUs />
        <SectionDivider variant="fade" fromDark />
        {/* AboutUs (dark) → StatsCounter (light) */}
        <StatsCounter />
        <SectionDivider variant="light-break" />
        {/* StatsCounter (light) → FAQSection (light) */}
        <FAQSection />
        <SectionDivider variant="fade" />
        {/* FAQSection (light) → FinalCTA (dark) */}
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
