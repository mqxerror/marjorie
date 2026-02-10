'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/cn';

interface TimelineItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
  light?: boolean;
}

export function Timeline({ items, className, light = false }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Vertical line */}
      <div className={cn('absolute left-8 top-0 bottom-0 w-0.5', light ? 'bg-navy/15' : 'bg-white/20')}>
        <motion.div
          className="absolute top-0 left-0 w-full bg-gold"
          style={{ height: lineHeight }}
        />
      </div>

      {/* Timeline items */}
      <div className="space-y-12">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative pl-20"
          >
            {/* Step number */}
            <div className="absolute left-4 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-white font-bold text-sm">
              {index + 1}
            </div>

            {/* Content */}
            <div className={cn(
              'rounded-lg p-6',
              light
                ? 'bg-white border border-navy/12 shadow-md'
                : 'bg-white/[0.12] backdrop-blur-sm border border-white/20'
            )}>
              <h3 className={cn('text-xl font-semibold mb-2', light ? 'text-navy' : 'text-white')}>
                {item.title}
              </h3>
              <p className={light ? 'text-navy/70' : 'text-white/70'}>{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
