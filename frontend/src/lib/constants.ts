// CTA Configuration
export const CTA_URL =
  process.env.NEXT_PUBLIC_CTA_URL ||
  'https://secure.officio.ca/qnr?id=5537&hash=55ff3db3104048310e876b347ec3a741';

// Analytics IDs
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '1540153117181945';

// Analytics Configuration
export const ANALYTICS = {
  GA4_ID: process.env.NEXT_PUBLIC_GA4_ID || GA_ID,
  FB_PIXEL_ID: FB_PIXEL_ID,
} as const;

// Section IDs for navigation
export const SECTION_IDS = {
  hero: 'hero',
  whyCaregivers: 'why-caregivers',
  aboutEb3: 'about-eb3',
  highlights: 'highlights',
  urgency: 'urgency',
  process: 'process',
  events: 'events',
  aboutUs: 'about-us',
  stats: 'stats',
  faq: 'faq',
  finalCta: 'final-cta',
  // Events page sections
  eventsHero: 'events-hero',
  whatIsAbout: 'what-is-about',
  whoIsFor: 'who-is-for',
  facilitators: 'facilitators',
  eventSchedule: 'event-schedule',
  screeningForm: 'screening-form',
  eventDisclaimer: 'event-disclaimer',
} as const;

// API URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Brand Colors
export const BRAND_COLORS = {
  navy: '#1A3A5C',
  gold: '#C9A961',
  lightGray: '#F5F5F5',
  darkText: '#1A1A1A',
  white: '#FFFFFF',
} as const;
