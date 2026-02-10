'use client';

import { motion } from 'framer-motion';
import { CTAButton } from '@/components/shared/CTAButton';
import { SECTION_IDS } from '@/lib/constants';

export function FinalCTA() {
  return (
    <section
      id={SECTION_IDS.finalCta}
      className="relative py-24 bg-gradient-to-br from-navy via-navy/95 to-navy overflow-hidden"
    >
      {/* Gradient overlay effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/20 rounded-full blur-3xl" />
      </div>

      {/* Animated flag stripes */}
      <div className="absolute inset-0 opacity-[0.03] overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-3 bg-gold"
            style={{ top: `${15 + i * 14}%` }}
            animate={{ x: [i % 2 === 0 ? '-5%' : '5%', i % 2 === 0 ? '5%' : '-5%'] }}
            transition={{ duration: 12 + i * 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Floating star accents — hidden on mobile for performance */}
      <div className="hidden md:block">
        {[
          { left: '5%', top: '20%', size: 16, delay: 0 },
          { left: '92%', top: '30%', size: 20, delay: 1 },
          { left: '88%', top: '70%', size: 14, delay: 2 },
          { left: '8%', top: '80%', size: 18, delay: 0.5 },
        ].map((star, i) => (
          <motion.svg
            key={i}
            viewBox="0 0 24 24"
            width={star.size}
            height={star.size}
            fill="currentColor"
            className="absolute text-white/20"
            style={{ left: star.left, top: star.top }}
            animate={{ y: [0, -10, 0], rotate: [0, 15, 0] }}
            transition={{ duration: 5, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </motion.svg>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-white mb-4"
        >
          EB-3 U.S. Green Card
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-2xl text-gold font-semibold mb-6"
        >
          LOW SPOTS LEFT — ACT NOW
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-white/80 mb-10 max-w-2xl mx-auto"
        >
          Secure a legitimate, employer-sponsored caregiver role and move to the
          United States with your spouse and children.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <CTAButton
            text="Start Your Application"
            variant="final"
            position="final"
          />
        </motion.div>
      </div>
    </section>
  );
}
