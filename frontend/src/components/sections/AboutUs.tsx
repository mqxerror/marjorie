'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { SECTION_IDS } from '@/lib/constants';

export function AboutUs() {
  return (
    <SectionWrapper id={SECTION_IDS.aboutUs} trackView dark>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          About Us
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Marjorie Quintos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/[0.12] backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:border-gold/30 transition-all duration-300"
        >
          <div className="flex items-center gap-5 mb-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gold/40 flex-shrink-0 shadow-lg shadow-gold/10">
              <Image
                src="/images/marjorie.jpeg"
                alt="Marjorie Quintos, RCIC"
                fill
                className="object-cover object-top"
                sizes="96px"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                Marjorie Quintos, RCIC
              </h3>
              <p className="text-gold text-sm">
                Director of Immigration Services
              </p>
            </div>
          </div>
          <ul className="space-y-2 text-white/75">
            <li>• Licensed Canadian Immigration Consultant</li>
            <li>• 20 years of experience in immigration services</li>
            <li>• Filipina immigrant professional who understands your journey</li>
            <li>• Personally assists clients through every EB-3 stage</li>
          </ul>
        </motion.div>

        {/* Mercan Group */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.12] backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:border-gold/30 transition-all duration-300"
        >
          <div className="flex items-center gap-5 mb-6">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-white/10 flex-shrink-0 p-2">
              <Image
                src="/images/mercan-logo.png"
                alt="Mercan Group of Companies"
                fill
                className="object-contain p-2"
                sizes="96px"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                Mercan Group of Companies
              </h3>
              <p className="text-gold text-sm">
                Global Immigration Leaders Since 1989
              </p>
            </div>
          </div>
          <ul className="space-y-2 text-white/75">
            <li>• 35+ year track record of success</li>
            <li>• Over 50,000 families helped worldwide</li>
            <li>• Offices in Canada, Philippines, UAE, Vietnam, China, and more</li>
            <li>• Registered firm in multiple countries</li>
          </ul>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
