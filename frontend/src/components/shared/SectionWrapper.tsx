'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { trackSectionView } from '@/lib/analytics';

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  trackView?: boolean;
  dark?: boolean;
}

export function SectionWrapper({
  id,
  children,
  className,
  trackView = false,
  dark = false,
}: SectionWrapperProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    if (!trackView || hasTracked) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            timer = setTimeout(() => {
              const scrollDepth = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
              );

              trackSectionView({
                section_id: id,
                scroll_depth: scrollDepth,
              });

              setHasTracked(true);
              observer.disconnect();
            }, 2000);
          } else if (timer) {
            clearTimeout(timer);
            timer = null;
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [id, trackView, hasTracked]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        'py-16 md:py-24 px-4 md:px-8 lg:px-16',
        dark ? 'bg-navy text-white' : 'bg-light-gray text-dark-text',
        className
      )}
    >
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}
