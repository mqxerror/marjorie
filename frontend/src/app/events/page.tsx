import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SkipLink } from '@/components/shared/SkipLink';
import { EventsHero } from '@/components/events/EventsHero';
import { WhatThisSessionIsAbout } from '@/components/events/WhatThisSessionIsAbout';
import { WhoIsThisFor } from '@/components/events/WhoIsThisFor';
import { EventFacilitators } from '@/components/events/EventFacilitators';
import { EventSchedule } from '@/components/events/EventSchedule';
import { ScreeningForm } from '@/components/events/ScreeningForm';
import { EventDisclaimer } from '@/components/events/EventDisclaimer';


export const metadata: Metadata = {
  title: 'EB-3 Information Session | Apply to Attend | Marjorie Quintos',
  description:
    'Attend an informational session about the EB-3 immigrant visa category — a permanent residence pathway for Filipino caregivers. Learn about timelines, requirements, and the application process.',
  openGraph: {
    title: 'Planning your Family\'s American Dream?',
    description:
      'EB-3 Green Card Info Session for Filipino caregivers. A long-term path to the U.S.',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'EB-3 Information Session — Dubai',
    description:
      'Informational session about the EB-3 immigrant visa category for Filipino caregivers in the UAE.',
    startDate: '2026-02-21T15:00:00+04:00',
    endDate: '2026-02-22T21:00:00+04:00',
    eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: 'Dubai, UAE',
      address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Mercan Group of Companies',
      url: 'https://eb3caregivers.mercangroup.com',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'EB-3 Information Session — Abu Dhabi',
    description:
      'Informational session about the EB-3 immigrant visa category for Filipino caregivers in the UAE.',
    startDate: '2026-02-28T15:00:00+04:00',
    endDate: '2026-03-01T21:00:00+04:00',
    eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: 'Abu Dhabi, UAE',
      address: { '@type': 'PostalAddress', addressLocality: 'Abu Dhabi', addressCountry: 'AE' },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Mercan Group of Companies',
      url: 'https://eb3caregivers.mercangroup.com',
    },
  },
];

export default function EventsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SkipLink />
      <Navbar />
      <main id="main-content" className="min-h-screen">
        <EventsHero />
        <WhatThisSessionIsAbout />
        <WhoIsThisFor />
        <EventFacilitators />
        <EventSchedule />
        <ScreeningForm />
        <EventDisclaimer />
      </main>
      <Footer />
    </>
  );
}
