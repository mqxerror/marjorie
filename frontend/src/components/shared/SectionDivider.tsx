'use client';

import { cn } from '@/lib/cn';

type DividerVariant = 'fade' | 'dark-break' | 'light-break';

interface SectionDividerProps {
  variant?: DividerVariant;
  fromDark?: boolean;
  className?: string;
}

/** Smooth gradient transition between dark and light sections */
function GradientFade({ fromDark }: { fromDark?: boolean }) {
  const dark = '#002868';
  const light = '#F8F9FA';
  const [from, to] = fromDark ? [dark, light] : [light, dark];
  return (
    <div
      className="h-24 md:h-32"
      style={{
        background: `linear-gradient(to bottom, ${from} 0%, ${from} 5%, color-mix(in srgb, ${from} 60%, ${to}) 35%, color-mix(in srgb, ${from} 20%, ${to}) 65%, ${to} 95%, ${to} 100%)`,
      }}
    />
  );
}

/** Subtle break between two dark sections — thin line with star accents */
function DarkBreak() {
  return (
    <div className="bg-navy py-2">
      <div className="max-w-4xl mx-auto flex items-center gap-4 px-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <svg key={i} viewBox="0 0 24 24" className="w-3 h-3 text-gold/50 fill-current">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </div>
  );
}

/** Subtle break between two light sections — thin gradient line */
function LightBreak() {
  return (
    <div className="bg-light-gray py-1">
      <div className="max-w-4xl mx-auto px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-navy/10 to-transparent" />
      </div>
    </div>
  );
}

export function SectionDivider({
  variant = 'fade',
  fromDark = false,
  className,
}: SectionDividerProps) {
  return (
    <div className={cn('relative', className)} aria-hidden="true">
      {variant === 'fade' && <GradientFade fromDark={fromDark} />}
      {variant === 'dark-break' && <DarkBreak />}
      {variant === 'light-break' && <LightBreak />}
    </div>
  );
}
