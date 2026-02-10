'use client';

import { motion } from 'framer-motion';
import { Heart, Globe, Users, Award } from 'lucide-react';
import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { Card3D, Card3DContainer } from '@/components/ui/3d-card';
import { SECTION_IDS } from '@/lib/constants';

const benefits = [
  {
    icon: Heart,
    title: 'High Demand for Caregivers',
    description:
      'The U.S. healthcare industry urgently needs dedicated caregivers. States like Virginia, Maryland, and D.C. have thousands of open positions.',
  },
  {
    icon: Globe,
    title: 'No Language Exam Needed',
    description:
      'Unlike Canada, the EB-3 program does not require IELTS or any English language test. Your experience speaks louder than test scores.',
  },
  {
    icon: Award,
    title: 'Stable Future & Citizenship',
    description:
      'The EB-3 visa leads to permanent residency (Green Card) and eventually U.S. citizenship. Build a lasting future for your family.',
  },
  {
    icon: Users,
    title: 'Bring Your Family Along',
    description:
      'Your spouse and children under 21 can join you on derivative visas. Keep your family together on this journey.',
  },
];

export function WhyCaregivers() {
  return (
    <SectionWrapper id={SECTION_IDS.whyCaregivers} trackView>
      {/* Section Header */}
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-navy mb-4"
        >
          Why Filipino Caregivers?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-navy/70 max-w-2xl mx-auto"
        >
          Filipino caregivers are world-renowned for their dedication, compassion,
          and strong family values. The EB-3 program is an ideal fit.
        </motion.p>
      </div>

      {/* Benefit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {benefits.map((benefit, index) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card3D containerClassName="h-full">
              <Card3DContainer className="h-full" light>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-warm-gold/15 rounded-lg flex items-center justify-center group-hover:bg-warm-gold/25 transition-colors">
                    <benefit.icon className="w-6 h-6 text-warm-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-navy mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-navy/70">{benefit.description}</p>
                  </div>
                </div>
              </Card3DContainer>
            </Card3D>
          </motion.div>
        ))}
      </div>

      {/* Comparison Note */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center"
      >
        <p className="text-navy/65 text-sm max-w-2xl mx-auto">
          While Canada&apos;s points-based system becomes increasingly competitive,
          the EB-3 program offers a simpler, more accessible pathway to permanent
          residency in the United States.
        </p>
      </motion.div>
    </SectionWrapper>
  );
}
