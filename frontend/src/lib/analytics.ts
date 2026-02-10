import { GA_ID, FB_PIXEL_ID } from './constants';

// Types
interface CTAClickEvent {
  button_position: string;
  button_text: string;
  button_variant: string;
}

interface SectionViewEvent {
  section_id: string;
  scroll_depth: number;
}

// Check if we're in the browser
const isBrowser = typeof window !== 'undefined';

// GA4 Event Tracking
export function trackGA4Event(eventName: string, params: Record<string, unknown>) {
  if (!isBrowser || !GA_ID) return;

  // @ts-expect-error gtag is added by Google Analytics script
  if (typeof window.gtag === 'function') {
    // @ts-expect-error gtag is added by Google Analytics script
    window.gtag('event', eventName, params);
  }
}

// Facebook Pixel Event Tracking
export function trackFBEvent(eventName: string, params?: Record<string, unknown>) {
  if (!isBrowser || !FB_PIXEL_ID) return;

  // @ts-expect-error fbq is added by Facebook Pixel script
  if (typeof window.fbq === 'function') {
    // @ts-expect-error fbq is added by Facebook Pixel script
    window.fbq('track', eventName, params);
  }
}

// Track CTA Click
export function trackCTAClick(event: CTAClickEvent) {
  // GA4
  trackGA4Event('cta_click', {
    button_position: event.button_position,
    button_text: event.button_text,
    button_variant: event.button_variant,
  });

  // Facebook Pixel - Lead event
  trackFBEvent('Lead', {
    content_name: event.button_text,
    content_category: event.button_position,
  });
}

// Track Section View
export function trackSectionView(event: SectionViewEvent) {
  trackGA4Event('section_view', {
    section_id: event.section_id,
    scroll_depth: event.scroll_depth,
  });

  trackFBEvent('ViewContent', {
    content_name: event.section_id,
  });
}

// Allowed CTA domains for URL validation
const ALLOWED_CTA_DOMAINS = ['secure.officio.ca'];

// Sanitize UTM parameter value (alphanumeric, hyphens, underscores only)
function sanitizeUtmValue(value: string): string {
  return value.replace(/[^a-zA-Z0-9_\-. ]/g, '').slice(0, 200);
}

// Build CTA URL with UTM parameters preserved
export function buildCTAUrl(baseUrl: string): string {
  if (!isBrowser) return baseUrl;

  try {
    const ctaUrl = new URL(baseUrl);

    // Validate URL scheme and domain
    if (ctaUrl.protocol !== 'https:' || !ALLOWED_CTA_DOMAINS.includes(ctaUrl.hostname)) {
      return baseUrl;
    }

    const currentParams = new URLSearchParams(window.location.search);
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

    utmParams.forEach((param) => {
      const value = currentParams.get(param);
      if (value) {
        ctaUrl.searchParams.set(param, sanitizeUtmValue(value));
      }
    });

    return ctaUrl.toString();
  } catch {
    return baseUrl;
  }
}
