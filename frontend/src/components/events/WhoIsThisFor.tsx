'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { SECTION_IDS } from '@/lib/constants';

const suitableFor = [
  'Are Filipino nationals',
  'Are currently based in the UAE',
  'Have experience in home health care, caregiving, or related support roles',
  'Do not yet have formal caregiving experience but are willing, able, and suitable to work in caregiving or support-based roles',
  'Are exploring long-term migration options rather than short-term work',
  'Understand that employment-based immigration is a multi-year process (approximately 2\u20133 years)',
];

const notSuitableFor = [
  'Looking for immediate overseas employment',
  'Expecting guaranteed outcomes',
  'Seeking short-term or temporary U.S. visas',
  'A licensed nurse seeking professional licensure pathways',
];

export function WhoIsThisFor() {
  return (
    <SectionWrapper id={SECTION_IDS.whoIsFor} trackView dark>
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
        Is This Session Right for You?
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Suitable For */}
        <div className="bg-white/[0.12] border border-white/20 rounded-xl p-6 sm:p-8">
          <h3 className="text-xl font-bold text-green-400 mb-6">
            Who This Session Is Designed For
          </h3>
          <p className="text-white/70 text-sm mb-4">
            This information session is intended for individuals who:
          </p>
          <ul className="space-y-4">
            {suitableFor.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-white/60 text-sm italic border-t border-white/10 pt-4">
            Prior experience is helpful, but commitment, suitability, and realistic expectations
            matter just as much.
          </p>
        </div>

        {/* Not Suitable For */}
        <div className="bg-white/[0.12] border border-white/20 rounded-xl p-6 sm:p-8">
          <h3 className="text-xl font-bold text-red-400 mb-6">
            Who This Session May Not Be Suitable For
          </h3>
          <p className="text-white/70 text-sm mb-4">
            This session may not be appropriate if you are:
          </p>
          <ul className="space-y-4">
            {notSuitableFor.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionWrapper>
  );
}
