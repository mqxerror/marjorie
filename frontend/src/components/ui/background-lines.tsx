'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface BackgroundLinesProps {
  children?: React.ReactNode;
  className?: string;
  svgOptions?: {
    duration?: number;
  };
}

export function BackgroundLines({
  children,
  className,
  svgOptions,
}: BackgroundLinesProps) {
  const duration = svgOptions?.duration ?? 10;

  return (
    <div className={cn('relative w-full overflow-hidden', className)}>
      {/* Animated lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#BF0A30" stopOpacity="0" />
            <stop offset="50%" stopColor="#BF0A30" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#BF0A30" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[...Array(5)].map((_, i) => (
          <motion.line
            key={i}
            x1="0%"
            y1={`${20 + i * 15}%`}
            x2="100%"
            y2={`${20 + i * 15}%`}
            stroke="url(#line-gradient)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
