import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DynamicScripts } from "@/components/shared/DynamicScripts";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// FB Pixel noscript fallback still uses env var
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "";
const SAFE_FB_PIXEL_ID = /^[0-9]+$/.test(FB_PIXEL_ID) ? FB_PIXEL_ID : "";

export const metadata: Metadata = {
  title: "Planning your Family's American Dream? | Marjorie Quintos",
  description:
    "EB-3 Green Card Information Session for Filipino caregivers in UAE. A long-term path to the U.S. through employer-sponsored permanent residency. No IELTS required.",
  keywords: [
    "EB-3 visa",
    "green card",
    "Filipino caregivers",
    "US immigration",
    "Mercan Group",
    "UAE caregivers",
    "employment-based immigration",
    "Marjorie Quintos",
  ],
  authors: [{ name: "Mercan Group" }],
  creator: "Mercan Group",
  publisher: "Mercan Group",
  metadataBase: new URL("https://marjoriequintos.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://marjoriequintos.com",
    siteName: "Marjorie Quintos - EB-3 Green Card Info Session",
    title: "Planning your Family's American Dream?",
    description:
      "EB-3 Green Card Information Session for Filipino caregivers. A long-term path to the U.S. No IELTS required.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Planning your Family's American Dream? - EB-3 Green Card Info Session",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Planning your Family's American Dream?",
    description:
      "EB-3 Green Card Info Session for Filipino caregivers. A long-term path to the U.S.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mercan Group",
  url: "https://marjoriequintos.com",
  logo: "https://marjoriequintos.com/images/mercan-logo.png",
  description:
    "Global immigration leaders since 1989. Helping Filipino caregivers achieve their American Dream through the EB-3 Green Card program.",
  foundingDate: "1989",
  address: {
    "@type": "PostalAddress",
    addressCountry: "CA",
  },
  sameAs: [
    "https://facebook.com/mercangroup",
    "https://youtube.com/@mercangroup",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English", "Tagalog"],
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "EB-3 Green Card Immigration Services",
  provider: {
    "@type": "Organization",
    name: "Mercan Group",
  },
  description:
    "Employment-based immigration services for Filipino caregivers seeking U.S. Green Cards through the EB-3 visa program.",
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  audience: {
    "@type": "Audience",
    audienceType: "Filipino Caregivers",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <DynamicScripts />
        {/* Facebook Pixel noscript fallback */}
        {SAFE_FB_PIXEL_ID && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${SAFE_FB_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}
      </body>
    </html>
  );
}
