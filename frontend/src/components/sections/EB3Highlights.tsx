'use client';

import { motion } from 'framer-motion';
import { Ban, Briefcase, Users2, Home } from 'lucide-react';
import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { SECTION_IDS } from '@/lib/constants';

const highlights = [
  {
    icon: Ban,
    title: 'No IELTS or Point System',
    description:
      'Your success isn\'t scored by age, education points, or language tests. Real experience matters more.',
  },
  {
    icon: Briefcase,
    title: 'Real Job & Green Card',
    description:
      'You\'ll have a legitimate U.S. job lined up before you even move. No uncertainty, no guessing.',
  },
  {
    icon: Users2,
    title: 'All Skill Levels Welcome',
    description:
      'The "Other Workers" category is designed for caregivers, nursing aides, and support roles.',
  },
  {
    icon: Home,
    title: 'Permanent Residency for Family',
    description:
      'Your spouse and children under 21 are included. Keep your family together.',
  },
];

export function EB3Highlights() {
  return (
    <SectionWrapper id={SECTION_IDS.highlights} trackView dark>
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          EB-3 Program Highlights
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {highlights.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white/[0.12] backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/[0.18] hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/5"
          >
            <div className="w-12 h-12 bg-warm-gold/25 rounded-lg flex items-center justify-center mb-4 group-hover:bg-warm-gold/35 transition-colors">
              <item.icon className="w-6 h-6 text-warm-gold" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {item.title}
            </h3>
            <p className="text-white/75 text-sm">{item.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="text-center text-gold mt-10 text-lg font-medium"
      >
        A direct, family-friendly route to living in the United States.
      </motion.p>
    </SectionWrapper>
  );
}
