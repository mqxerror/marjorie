'use client';

import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { Timeline } from '@/components/ui/timeline';
import { SECTION_IDS } from '@/lib/constants';

const processSteps = [
  {
    title: 'Free Eligibility Review',
    description:
      'Fill out our short eligibility form (takes about 2 minutes). Our team evaluates your profile at no cost.',
  },
  {
    title: 'Employer Matching',
    description:
      'We match you with a certified U.S. employer in the caregiving or healthcare sector who is looking for dedicated workers like you.',
  },
  {
    title: 'Labor Certification (PERM)',
    description:
      'Your U.S. employer files a PERM labor certification with the Department of Labor. This proves no qualified U.S. workers are available for the position.',
  },
  {
    title: 'Immigrant Petition & Visa Processing',
    description:
      'Once PERM is approved, your employer files Form I-140. After approval, you complete visa processing at a U.S. Embassy.',
  },
  {
    title: 'Green Card & Relocation',
    description:
      'You and your family receive immigrant visas. We provide relocation guidance to help you settle into your new life in America.',
  },
];

export function StepByStep() {
  return (
    <SectionWrapper id={SECTION_IDS.process} trackView>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
          The EB-3 Process: Step by Step
        </h2>
        <p className="text-lg text-navy/70 max-w-2xl mx-auto">
          From your first inquiry to your Green Card, we guide you through every stage.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Timeline items={processSteps} light />
      </div>
    </SectionWrapper>
  );
}
