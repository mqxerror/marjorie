'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

interface TrackingScript {
  id: string;
  name: string;
  enabled: boolean;
  type: 'gtag' | 'pixel' | 'gtm' | 'custom';
  trackingId: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const ENV_GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || '';
const ENV_FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '';

const SAFE_ID_RE = /^[A-Za-z0-9_-]+$/;

function isValidId(id: string) {
  return SAFE_ID_RE.test(id);
}

function renderScript(script: TrackingScript) {
  if (!script.enabled || !isValidId(script.trackingId)) return null;

  switch (script.type) {
    case 'gtag':
      return (
        <span key={script.id}>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${script.trackingId}`}
            strategy="afterInteractive"
          />
          <Script id={`gtag-${script.id}`} strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${script.trackingId}');`}
          </Script>
        </span>
      );

    case 'pixel':
      return (
        <Script key={script.id} id={`pixel-${script.id}`} strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${script.trackingId}');fbq('track','PageView');`}
        </Script>
      );

    case 'gtm':
      return (
        <Script key={script.id} id={`gtm-${script.id}`} strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${script.trackingId}');`}
        </Script>
      );

    case 'custom':
      return (
        <Script key={script.id} id={`custom-${script.id}`} strategy="afterInteractive">
          {`/* Custom tracking: ${script.name} — ID: ${script.trackingId} */`}
        </Script>
      );

    default:
      return null;
  }
}

function fallbackScripts() {
  const elements: React.ReactNode[] = [];

  const safeGA4 = /^[A-Za-z0-9-]+$/.test(ENV_GA4_ID) ? ENV_GA4_ID : '';
  const safeFB = /^[0-9]+$/.test(ENV_FB_PIXEL_ID) ? ENV_FB_PIXEL_ID : '';

  if (safeGA4) {
    elements.push(
      <span key="ga4-fallback">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${safeGA4}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${safeGA4}');`}
        </Script>
      </span>,
    );
  }

  if (safeFB) {
    elements.push(
      <Script key="fb-fallback" id="facebook-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${safeFB}');fbq('track','PageView');`}
      </Script>,
    );
  }

  return elements;
}

export function DynamicScripts() {
  const [scripts, setScripts] = useState<TrackingScript[] | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/config/public`)
      .then((r) => r.json())
      .then((data) => {
        const raw = data?.tracking_scripts;
        if (Array.isArray(raw) && raw.length > 0) {
          setScripts(raw as TrackingScript[]);
        } else {
          setScripts([]);
        }
      })
      .catch(() => {
        setScripts([]);
      });
  }, []);

  // Not loaded yet — render nothing (avoid double-loading)
  if (scripts === null) return null;

  // API returned scripts — use them
  if (scripts.length > 0) {
    return <>{scripts.filter((s) => s.enabled).map(renderScript)}</>;
  }

  // Empty from API or fetch failed — fall back to env vars
  return <>{fallbackScripts()}</>;
}
