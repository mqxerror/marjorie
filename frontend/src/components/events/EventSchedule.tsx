'use client';

import { MapPin, Calendar, Clock } from 'lucide-react';
import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { SECTION_IDS } from '@/lib/constants';

const events = [
  {
    city: 'Dubai',
    dates: [
      'Saturday, February 21, 2026',
      'Sunday, February 22, 2026',
    ],
  },
  {
    city: 'Abu Dhabi',
    dates: [
      'Saturday, February 28, 2026',
      'Sunday, March 1, 2026',
    ],
  },
];

const sessionTimes = [
  'Session 1: 3:00 PM \u2013 5:00 PM',
  'Session 2: 7:00 PM \u2013 9:00 PM',
];

export function EventSchedule() {
  return (
    <SectionWrapper id={SECTION_IDS.eventSchedule} trackView dark>
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
        Event Details & Schedule
      </h2>
      <p className="text-center text-white/60 mb-12 max-w-2xl mx-auto">
        Attendance is by application only. Selected applicants will receive a manual confirmation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
        {events.map((event) => (
          <div
            key={event.city}
            className="bg-white/[0.12] border border-white/20 rounded-xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <MapPin className="w-6 h-6 text-gold" />
              <h3 className="text-2xl font-bold text-white">{event.city}</h3>
            </div>

            <div className="space-y-3 mb-6">
              {event.dates.map((date) => (
                <div key={date} className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-white/50" />
                  <span className="text-white/80 text-sm">{date}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2">
              {sessionTimes.map((time) => (
                <div key={time} className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gold/70" />
                  <span className="text-white/70 text-sm">{time}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-white/50 text-sm italic mb-10">
        Venue details will be shared with confirmed attendees only.
      </p>

      {/* Transition to form */}
      <div className="text-center">
        <p className="text-white/70 text-lg mb-4">
          Ready to attend? Complete the screening form below to apply.
        </p>
        <svg className="w-6 h-6 mx-auto text-gold animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </SectionWrapper>
  );
}
