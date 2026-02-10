'use client';

import { CheckCircle } from 'lucide-react';
import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { SECTION_IDS } from '@/lib/constants';

const bulletPoints = [
  'What the EB-3 immigrant visa is and who it is meant for',
  'How employment-based immigration leads to U.S. permanent residence',
  'The role of employers in the EB-3 process',
  'Typical timelines, stages, and commitments involved',
  'How families may be included in permanent residence applications',
  'Common myths, misinformation, and scams to avoid',
  'General financial responsibilities associated with employment-based immigration, including professional, government, and personal relocation costs',
];

export function WhatThisSessionIsAbout() {
  return (
    <SectionWrapper id={SECTION_IDS.whatIsAbout} trackView>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          What This Session Is About
        </h2>
        <p className="text-center text-dark-text/70 mb-10 text-lg">
          This session is designed to help you understand:
        </p>

        <ul className="space-y-4 mb-10">
          {bulletPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
              <span className="text-dark-text/80 text-base">{point}</span>
            </li>
          ))}
        </ul>

        <div className="bg-navy/5 border border-navy/10 rounded-lg p-6 text-center">
          <p className="text-dark-text/80 font-medium text-lg italic">
            This is not a seminar about quick results. It is about building a future the right way.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
