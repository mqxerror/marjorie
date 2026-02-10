'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';

interface NavItem {
  name: string;
  link: string;
}

interface FloatingNavbarProps {
  navItems: NavItem[];
  className?: string;
  logo?: React.ReactNode;
  ctaButton?: React.ReactNode;
}

export function FloatingNavbar({
  navItems,
  className,
  logo,
  ctaButton,
}: FloatingNavbarProps) {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      // Background change after scrolling
      setScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence mode="wait">
      <motion.nav
        initial={{ opacity: 1, y: 0 }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-colors duration-200',
          scrolled ? 'bg-navy/95 backdrop-blur-sm shadow-lg' : 'bg-transparent',
          className
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">{logo}</div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.link}
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex items-center">{ctaButton}</div>
          </div>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
}
