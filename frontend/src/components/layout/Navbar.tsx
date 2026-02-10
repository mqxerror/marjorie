'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { CTAButton } from '@/components/shared/CTAButton';
import { SECTION_IDS } from '@/lib/constants';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const linkPrefix = pathname === '/' ? '' : '/';

  const navItems = [
    { name: 'Why Caregivers', link: `${linkPrefix}#${SECTION_IDS.whyCaregivers}` },
    { name: 'About EB-3', link: `${linkPrefix}#${SECTION_IDS.aboutEb3}` },
    { name: 'Process', link: `${linkPrefix}#${SECTION_IDS.process}` },
    { name: 'About Us', link: `${linkPrefix}#${SECTION_IDS.aboutUs}` },
    { name: 'FAQ', link: `${linkPrefix}#${SECTION_IDS.faq}` },
    { name: 'Events', link: '/events' },
  ];

  const ticking = useRef(false);
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        setScrollProgress(totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0);
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-navy/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2">
              <span className="text-xl md:text-2xl font-bold text-white">
                Marjorie Quintos, RCIC
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.link}
                  className={cn(
                    'text-white/80 hover:text-white transition-colors text-sm font-medium',
                    false
                  )}
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <CTAButton text="Apply Now" variant="nav" position="nav" />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 text-white"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        {scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
            <div
              className="h-full bg-gold transition-[width] duration-100"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        )}
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-navy/95 backdrop-blur-md"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-navy p-6 pt-20"
            >
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.link}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white text-lg font-medium py-3 border-b border-white/10"
                  >
                    {item.name}
                  </a>
                ))}
                <div className="pt-4">
                  <CTAButton
                    text="Apply Now"
                    variant="primary"
                    position="nav-mobile"
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
