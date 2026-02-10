'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { CTAButton } from '@/components/shared/CTAButton';
import { SECTION_IDS } from '@/lib/constants';

const events = [
  {
    city: 'Dubai',
    dates: ['Saturday, February 21, 2026', 'Sunday, February 22, 2026'],
    sessions: ['3:00 PM – 5:00 PM', '7:00 PM – 9:00 PM'],
  },
  {
    city: 'Abu Dhabi',
    dates: ['Saturday, February 28, 2026', 'Sunday, March 1, 2026'],
    sessions: ['3:00 PM – 5:00 PM', '7:00 PM – 9:00 PM'],
  },
];

export function InfoSessions() {
  return (
    <SectionWrapper id={SECTION_IDS.events} trackView>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
          Upcoming Information Sessions
        </h2>
        <p className="text-lg text-navy/70 max-w-2xl mx-auto">
          Join us in person to learn about the EB-3 program and ask questions directly
          to our immigration experts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {events.map((event, index) => (
          <motion.div
            key={event.city}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-navy/10 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-gold" />
              <h3 className="text-2xl font-bold text-navy">{event.city}</h3>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-navy/50 mt-1" />
                <div className="text-sm text-navy/70">
                  {event.dates.map((date) => (
                    <div key={date}>{date}</div>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-navy/50 mt-1" />
                <div className="text-sm text-navy/70">
                  {event.sessions.map((session) => (
                    <div key={session}>{session}</div>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-navy/50 mt-1" />
                <div className="text-sm text-navy/70">
                  Marjorie Quintos, Director of Immigration Services
                </div>
              </div>
            </div>

            <CTAButton
              text="Apply to Attend"
              variant="secondary"
              position={`info-sessions-${event.city.toLowerCase()}`}
              className="w-full"
            />
          </motion.div>
        ))}
      </div>

      <p className="text-center text-sm text-navy/50 italic">
        This session is informational only and does not constitute recruitment,
        hiring, or job placement. Attendance does not constitute an offer of
        employment.
      </p>
    </SectionWrapper>
  );
}
