'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { CTA_URL } from '@/lib/constants';
import { trackCTAClick, buildCTAUrl } from '@/lib/analytics';

type CTAVariant = 'primary' | 'secondary' | 'nav' | 'urgency' | 'final';

interface CTAButtonProps {
  text: string;
  variant?: CTAVariant;
  position: string;
  className?: string;
}

const variantStyles: Record<CTAVariant, string> = {
  primary:
    'px-8 py-4 text-lg font-semibold bg-gold text-white hover:brightness-110 hover:shadow-xl hover:shadow-gold/30 rounded-full shadow-lg shadow-gold/25',
  secondary:
    'px-6 py-3 text-base font-medium bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-white rounded-full',
  nav: 'px-4 py-2 text-sm font-medium bg-gold text-white hover:brightness-110 rounded-full',
  urgency:
    'px-8 py-4 text-lg font-bold bg-gold text-white hover:brightness-110 hover:shadow-2xl hover:shadow-gold/40 rounded-full shadow-xl shadow-gold/30 animate-pulse-glow hover:animate-none',
  final:
    'px-10 py-5 text-xl font-bold bg-gold text-white hover:brightness-110 hover:shadow-3xl rounded-full shadow-2xl shadow-gold/40',
};

export function CTAButton({
  text,
  variant = 'primary',
  position,
  className,
}: CTAButtonProps) {
  const handleClick = useCallback(() => {
    // Track the click
    trackCTAClick({
      button_position: position,
      button_text: text,
      button_variant: variant,
    });

    // Build URL with UTM params
    const url = buildCTAUrl(CTA_URL);

    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [position, text, variant]);

  return (
    <motion.button
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center transition-all duration-200',
        variantStyles[variant],
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {text}
    </motion.button>
  );
}
