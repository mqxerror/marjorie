'use client';

import Image from 'next/image';
import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { SECTION_IDS } from '@/lib/constants';

export function EventFacilitators() {
  return (
    <SectionWrapper id={SECTION_IDS.facilitators} trackView>
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
        Event Facilitators
      </h2>

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Marjorie Photo */}
          <div className="shrink-0">
            <div className="relative w-48 h-60 sm:w-56 sm:h-72 rounded-2xl overflow-hidden border-4 border-gold/30 shadow-xl">
              <Image
                src="/images/marjorie.jpeg"
                alt="Marjorie Quintos, Director of Immigration Services"
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 192px, 224px"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-dark-text mb-1">
              Marjorie Quintos
            </h3>
            <p className="text-gold font-medium mb-4">
              Director of Immigration Services — Mercan Group
            </p>
            <p className="text-dark-text/70 mb-6">
              This information session will be facilitated by Marjorie Quintos,
              together with the Mercan Immigration Team, bringing decades of
              experience in employment-based immigration and permanent residence pathways.
            </p>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <span className="text-dark-text/50 text-sm">Together with</span>
              <Image
                src="/images/mercan-logo.png"
                alt="Mercan Group of Companies"
                width={120}
                height={35}
                className="opacity-70"
              />
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
