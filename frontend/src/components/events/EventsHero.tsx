'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { SECTION_IDS } from '@/lib/constants';

const BackgroundLines = dynamic(
  () => import('@/components/ui/background-lines').then((mod) => ({ default: mod.BackgroundLines })),
  { ssr: false }
);

export function EventsHero() {
  return (
    <section
      id={SECTION_IDS.eventsHero}
      className="relative min-h-screen flex items-center justify-center bg-navy overflow-hidden"
    >
      <BackgroundLines className="absolute inset-0">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                EB-3 <span className="text-gold">Information Session</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/80 max-w-xl mb-6">
                For many overseas Filipino workers, the American Dream represents long-term
                stability, opportunity, and a future for their families. This information
                session is designed for individuals who want to understand how employment-based
                U.S. immigration works and whether it may be a suitable option as part of their
                long-term plans.
              </p>

              <p className="text-base text-white/70 max-w-xl mb-8">
                The session focuses on the EB-3 immigrant visa category, a permanent residence
                pathway connected to employment needs in essential support and caregiving roles.
                The discussion is educational, realistic, and grounded in how the process works
                in practice.
              </p>

              <a
                href={`#${SECTION_IDS.screeningForm}`}
                className="inline-block px-8 py-4 bg-gold text-white font-bold rounded-lg hover:bg-gold/90 transition-colors text-lg"
              >
                Apply to Attend
              </a>
            </div>

            {/* Right Column - Marjorie Photo + Mercan Logo */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden border-4 border-gold/30 shadow-2xl shadow-gold/10">
                <Image
                  src="/images/marjorie.jpeg"
                  alt="Marjorie Quintos, RCIC - Director of Immigration Services"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 640px) 256px, 288px"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/50 text-sm">In partnership with</span>
                <Image
                  src="/images/mercan-logo.png"
                  alt="Mercan Group of Companies"
                  width={48}
                  height={48}
                />
              </div>
            </div>
          </div>
        </div>
      </BackgroundLines>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
