'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { SECTION_IDS } from '@/lib/constants';
import { cn } from '@/lib/cn';

const faqs = [
  {
    question: 'What is the EB-3 Visa?',
    answer:
      'The EB-3 Visa is a U.S. employment-based immigrant program that provides a direct route to a Green Card through a job offer from a certified U.S. employer.',
  },
  {
    question: 'Who can apply for EB-3?',
    answer:
      'There are three categories: Skilled Workers, Professionals, and Other Workers. Caregivers typically fall under the "Other Workers" category, which requires less than 2 years of training or experience.',
  },
  {
    question: 'Do I need to take the IELTS or any English test?',
    answer:
      'No. Unlike many Canadian immigration programs, the EB-3 does not require any standardized English language test like IELTS.',
  },
  {
    question: 'Can my spouse and children come with me?',
    answer:
      'Yes! Your spouse and unmarried children under 21 years old can be included in your application and will receive Green Cards alongside you.',
  },
  {
    question: 'Do I need a U.S. employer before applying?',
    answer:
      'No. Mercan Group matches you with pre-vetted U.S. employers who are looking for caregivers. We handle the employer matching process.',
  },
  {
    question: 'How long does the EB-3 process take?',
    answer:
      'The typical timeline is approximately 2-3 years from start to finish. This includes employer matching, PERM filing, I-140 petition, and visa processing.',
  },
  {
    question: 'What kind of U.S. jobs are available?',
    answer:
      'Jobs include caregivers, nursing aides, personal care assistants, hotel staff, food service workers, and other essential support roles.',
  },
  {
    question: 'Is there an age limit for EB-3?',
    answer:
      'No, there is no upper age limit for the EB-3 program. Applicants of all ages are welcome.',
  },
  {
    question: 'Why should I trust Mercan Group and Marjorie Quintos?',
    answer:
      'Mercan Group has been in business for 35+ years and has helped over 50,000 families immigrate. Marjorie Quintos is a licensed RCIC with 20 years of experience.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <SectionWrapper id={SECTION_IDS.faq} trackView>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-navy/70">
          Get answers to common questions about the EB-3 program.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.question}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="bg-white shadow-sm border border-navy/8 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-navy font-medium pr-4">{faq.question}</span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-gold flex-shrink-0 transition-transform',
                  openIndex === index && 'rotate-180'
                )}
              />
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-6 pb-4 text-navy/70">{faq.answer}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
