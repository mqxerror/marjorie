'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { SECTION_IDS } from '@/lib/constants';

const stats = [
  { value: 35, suffix: '+', label: 'Years in Business' },
  { value: 50, suffix: 'K+', label: 'Immigration Cases' },
  { value: 10, suffix: '+', label: 'Offices Worldwide' },
];

function AnimatedCounter({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function StatsCounter() {
  return (
    <SectionWrapper id={SECTION_IDS.stats} trackView>
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
          Our Track Record
        </h2>
        <p className="text-lg text-navy/70">
          Decades of proven immigration success
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="text-center group"
          >
            <div className="text-5xl md:text-6xl font-bold text-gold mb-2 group-hover:scale-110 transition-transform duration-300">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </div>
            <p className="text-navy text-lg">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
