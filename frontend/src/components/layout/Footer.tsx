'use client';

import { Facebook, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-navy py-12 border-t border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Description */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Mercan Group</h3>
            <p className="text-white/70 text-sm">
              Global immigration leaders since 1989. Helping Filipino caregivers
              achieve their American Dream through the EB-3 Green Card program.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/#about-eb3" className="text-white/70 hover:text-gold transition-colors">
                  About EB-3
                </a>
              </li>
              <li>
                <a href="/#process" className="text-white/70 hover:text-gold transition-colors">
                  Process
                </a>
              </li>
              <li>
                <a href="/#about-us" className="text-white/70 hover:text-gold transition-colors">
                  About Mercan Group
                </a>
              </li>
              <li>
                <a href="/#about-us" className="text-white/70 hover:text-gold transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/#faq" className="text-white/70 hover:text-gold transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
            <div className="flex gap-4">
              <a
                href="https://facebook.com/mercangroup"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-gold hover:bg-white/20 transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@mercangroup"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-gold hover:bg-white/20 transition-all"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-white/50 text-xs text-center mb-4">
            This website is for informational purposes only and does not constitute
            legal advice, recruitment, hiring, or job placement. Individual results
            may vary. Immigration outcomes depend on various factors including
            government processing times and individual eligibility.
          </p>
          <p className="text-white/50 text-xs text-center">
            © {new Date().getFullYear()} Mercan Group of Companies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
