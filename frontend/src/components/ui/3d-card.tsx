'use client';

import { useState, useRef, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function Card3D({
  children,
  className,
  containerClassName,
}: Card3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    // Skip 3D effect on touch devices (no hover)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('perspective-1000', containerClassName)}
    >
      <motion.div
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'relative transform-gpu',
          className
        )}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function Card3DContainer({
  children,
  className,
  light,
}: {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <div
      className={cn(
        'backdrop-blur-sm rounded-xl p-6 transition-shadow duration-300',
        light
          ? 'bg-white shadow-md border border-navy/12 hover:shadow-lg hover:shadow-navy/10'
          : 'bg-white/[0.15] border border-white/25 hover:shadow-xl hover:shadow-gold/10',
        className
      )}
      style={{ transform: 'translateZ(50px)' }}
    >
      {children}
    </div>
  );
}
