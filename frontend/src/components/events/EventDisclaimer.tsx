'use client';

import { SECTION_IDS } from '@/lib/constants';

export function EventDisclaimer() {
  return (
    <section
      id={SECTION_IDS.eventDisclaimer}
      className="bg-light-gray py-8 px-4 md:px-8 lg:px-16"
    >
      <div className="max-w-7xl mx-auto">
        <p className="text-dark-text/50 text-xs text-center">
          <strong>Disclaimer:</strong> This session is informational only and does not
          constitute recruitment, hiring, or job placement. Attendance does not constitute
          an offer of employment.
        </p>
      </div>
    </section>
  );
}
