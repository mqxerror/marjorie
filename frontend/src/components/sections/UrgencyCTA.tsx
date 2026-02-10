'use client';

import { motion } from 'framer-motion';
import { Target, Clock, Flame } from 'lucide-react';
import { CTAButton } from '@/components/shared/CTAButton';
import { SECTION_IDS } from '@/lib/constants';

function FloatingStar({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute text-white/20"
      style={{ left: x, top: y }}
      animate={{ y: [0, -15, 0], opacity: [0.15, 0.35, 0.15] }}
      transition={{ duration: 4, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    </motion.div>
  );
}

export function UrgencyCTA() {
  return (
    <section
      id={SECTION_IDS.urgency}
      className="relative py-20 bg-gradient-to-r from-navy via-navy/95 to-navy overflow-hidden"
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--flag-red)_0%,_transparent_50%)]" />
      </div>

      {/* Floating stars — hidden on mobile for performance */}
      <div className="hidden md:block">
        <FloatingStar delay={0} x="10%" y="20%" size={24} />
        <FloatingStar delay={0.5} x="85%" y="15%" size={18} />
        <FloatingStar delay={1} x="70%" y="70%" size={20} />
        <FloatingStar delay={1.5} x="15%" y="75%" size={16} />
        <FloatingStar delay={2} x="50%" y="10%" size={22} />
      </div>

      {/* Animated red stripes */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <motion.div
          className="absolute -left-full top-1/4 w-[200%] h-2 bg-gold"
          animate={{ x: ['0%', '50%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute -left-full top-3/4 w-[200%] h-1.5 bg-gold"
          animate={{ x: ['50%', '0%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            SPOTS ARE <span className="text-gold">FILLING FAST</span>
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Our EB-3 caregiver intake for Filipino applicants is now open.
            Limited availability — first-come, first-served.
          </p>
        </motion.div>

        {/* Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: Target, text: 'Low spots remaining — act now' },
            { icon: Clock, text: 'First-come, first-served availability' },
            { icon: Flame, text: 'Submit the 60-second eligibility form today' },
          ].map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="flex items-center gap-3 justify-start text-white/80"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, delay: index * 0.3, repeat: Infinity }}
              >
                <item.icon className="w-5 h-5 text-gold flex-shrink-0" />
              </motion.div>
              <span>{item.text}</span>
            </motion.div>
          ))}
        </div>

        <CTAButton
          text="Secure Your Spot Now"
          variant="urgency"
          position="urgency"
        />
      </div>
    </section>
  );
}
