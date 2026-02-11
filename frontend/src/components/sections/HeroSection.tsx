'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { CTAButton } from '@/components/shared/CTAButton';
import { SECTION_IDS } from '@/lib/constants';

// Lazy load heavy animation components with SSR fallbacks
const FlipWords = dynamic(
  () => import('@/components/ui/flip-words').then((mod) => ({ default: mod.FlipWords })),
  {
    ssr: false,
    loading: () => (
      <span className="text-gold">Your Path to the U.S.</span>
    ),
  }
);

const BackgroundLines = dynamic(
  () => import('@/components/ui/background-lines').then((mod) => ({ default: mod.BackgroundLines })),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0" />,
  }
);

const heroWords = [
  'Your Path to the U.S.',
  'A Green Card for Your Family',
  'No IELTS Required',
];

export function HeroSection() {
  return (
    <section
      id={SECTION_IDS.hero}
      className="relative min-h-screen flex items-center justify-center bg-navy overflow-hidden"
    >
      <BackgroundLines className="absolute inset-0">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                <FlipWords words={heroWords} duration={3000} className="text-gold" />
              </h1>

              <p className="text-lg sm:text-xl text-white/80 max-w-xl mb-8">
                Achieve your American Dream through the EB-3 Green Card Program.
                A legal, employer-sponsored pathway for Filipino caregivers.
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
                <CTAButton
                  text="Start Your Application Today"
                  variant="primary"
                  position="hero"
                />
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-white/70 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>35+ Years Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>50,000+ Families Helped</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>No IELTS Required</span>
                </div>
              </div>
            </div>

            {/* Right Column - Marjorie Photo + Mercan Logo */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-64 h-64 sm:w-72 sm:h-96 rounded-2xl overflow-hidden border-4 border-white/40 shadow-2xl shadow-flag-red/20">
                <Image
                  src="/images/marjorie.jpeg"
                  alt="Marjorie Quintos, RCIC - Director of Immigration Services"
                  fill
                  className="object-cover object-[left_top]"
                  priority
                  sizes="(max-width: 640px) 256px, 288px"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/50 text-sm">In partnership with</span>
                <Image
                  src="/images/mercan-logo.png"
                  alt="Mercan Group of Companies"
                  width={56}
                  height={56}
                  className="rounded-full shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </BackgroundLines>

      {/* Patriotic ribbon at the very bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex h-px">
        <div className="flex-1 bg-gold" />
        <div className="flex-1 bg-white/50" />
        <div className="flex-1 bg-navy" />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1 h-3 bg-white/50 rounded-full"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
