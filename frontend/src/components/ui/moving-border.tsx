'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface MovingBorderProps {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderRadius?: string;
  as?: React.ElementType;
  borderClassName?: string;
  onClick?: () => void;
}

export function MovingBorder({
  children,
  duration = 2000,
  className,
  containerClassName,
  borderRadius = '1.75rem',
  as: Component = 'button',
  borderClassName,
  onClick,
}: MovingBorderProps) {
  return (
    <Component
      onClick={onClick}
      className={cn(
        'relative p-[1px] overflow-hidden',
        containerClassName
      )}
      style={{ borderRadius }}
    >
      <div
        className={cn(
          'absolute inset-0',
          borderClassName
        )}
        style={{ borderRadius }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gold via-white to-gold"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: duration / 1000,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            background: 'conic-gradient(from 0deg, #C9A961, #FFFFFF, #C9A961, #FFFFFF, #C9A961)',
          }}
        />
      </div>
      <div
        className={cn(
          'relative bg-navy px-6 py-3 text-white font-medium',
          className
        )}
        style={{ borderRadius: `calc(${borderRadius} - 1px)` }}
      >
        {children}
      </div>
    </Component>
  );
}
