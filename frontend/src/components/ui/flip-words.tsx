'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface FlipWordsProps {
  words: string[];
  duration?: number;
  className?: string;
}

export function FlipWords({
  words,
  duration = 3000,
  className,
}: FlipWordsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextWord = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % words.length);
  }, [words.length]);

  useEffect(() => {
    const interval = setInterval(nextWord, duration);
    return () => clearInterval(interval);
  }, [nextWord, duration]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={words[currentIndex]}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={cn('inline-block', className)}
      >
        {words[currentIndex]}
      </motion.span>
    </AnimatePresence>
  );
}
