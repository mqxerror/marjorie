'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { SECTION_IDS } from '@/lib/constants';

const keyPoints = [
  {
    title: 'What is EB-3?',
    description:
      'The EB-3 is a U.S. employment-based immigrant visa category. It allows you to obtain a Green Card through a job offer from a certified U.S. employer.',
  },
  {
    title: 'How It Works',
    description:
      'Your U.S. employer sponsors your visa application. Once approved, you and your immediate family receive permanent residency status.',
  },
  {
    title: 'Clear Legal Pathway',
    description:
      'Unlike temporary work visas, the EB-3 leads directly to a Green Card. This is a permanent solution, not a temporary fix.',
  },
  {
    title: 'Family Inclusion',
    description:
      'Your spouse and unmarried children under 21 can be included in your application and receive Green Cards alongside you.',
  },
];

export function AboutEB3() {
  return (
    <SectionWrapper id={SECTION_IDS.aboutEb3} trackView>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - US Flag Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/us-flag.png"
              alt="United States Flag - EB-3 Employment-Based Immigration"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-navy font-semibold text-lg">
              Employment-Based Immigration
            </p>
            <p className="text-navy/60 text-sm">
              Your pathway to the American Dream
            </p>
          </div>
        </motion.div>

        {/* Right Column - Content */}
        <div className="space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-navy"
          >
            About the EB-3 Program
          </motion.h2>

          {keyPoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border-l-4 border-warm-gold pl-4"
            >
              <h3 className="text-lg font-semibold text-navy mb-1">
                {point.title}
              </h3>
              <p className="text-navy/70">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
