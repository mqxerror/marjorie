---
status: complete
workflowType: 'architecture'
projectName: Marjorie
author: wassim
date: 2026-02-04
inputDocuments:
  - architect.md
  - prd.md
companionDocument: prd.md
---

# Architecture Document
## EB-3 Caregivers Landing Page — Marjorie Quintos / Mercan Group

**BMAD Layer:** Architect
**Version:** 1.0
**Date:** February 4, 2026
**Project:** Rebuild of marjoriequintos.com/usa-eb3-caregivers/
**Companion Document:** PRD_EB3_Caregivers_Landing_Page.md (Business + Manager Layers)

---

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Frontend Architecture](#2-frontend-architecture)
3. [Backend Architecture](#3-backend-architecture)
4. [Database Schema](#4-database-schema)
5. [API Design](#5-api-design)
6. [SEO & Structured Data](#6-seo--structured-data)
7. [Analytics & Tracking](#7-analytics--tracking)
8. [Deployment Architecture](#8-deployment-architecture)
9. [Performance Architecture](#9-performance-architecture)
10. [Security Architecture](#10-security-architecture)
11. [Testing Strategy](#11-testing-strategy)
12. [Environment Configuration](#12-environment-configuration)
13. [Implementation Roadmap](#13-implementation-roadmap)

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Next.js Frontend                        │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │    │
│  │  │Aceternity │  │ Tailwind  │  │  Framer Motion   │  │    │
│  │  │   UI      │  │   CSS     │  │   Animations     │  │    │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │    │
│  └──────────────────────┬──────────────────────────────┘    │
│                         │ REST API                           │
│  ┌──────────────────────▼──────────────────────────────┐    │
│  │              NestJS Backend                           │    │
│  │  ┌──────────┐ ┌──────────┐ ┌────────┐ ┌──────────┐ │    │
│  │  │Analytics │ │ Content  │ │ Events │ │  Config  │ │    │
│  │  │ Module   │ │ Module   │ │ Module │ │  Module  │ │    │
│  │  └──────────┘ └──────────┘ └────────┘ └──────────┘ │    │
│  └──────────────────────┬──────────────────────────────┘    │
│                         │ Prisma ORM                         │
│  ┌──────────────────────▼──────────────────────────────┐    │
│  │              PostgreSQL 15+                           │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

External Services:
  → secure.officio.ca   (CTA redirect target)
  → Google Analytics 4   (Third-party analytics)
  → Facebook Pixel       (Retargeting & attribution)
```

### 1.2 Architecture Principles

| Principle | Implementation |
|-----------|---------------|
| **Separation of Concerns** | Frontend handles presentation/animation; backend handles data/analytics |
| **SSR-First** | Next.js App Router with server components for SEO crawlability |
| **External CTA Pattern** | No internal forms; all lead capture via external Officio webform |
| **Component-Driven Design** | Each page section wraps Aceternity UI primitives with consistent patterns |
| **Content Configurability** | Section content and event details served from database via API |
| **Performance Budget** | Lazy-loaded animations, mobile throttling, Lighthouse ≥90 |
| **Dual Analytics** | Third-party (GA4/FB Pixel) + first-party (NestJS module) for comprehensive tracking |

---

## 2. Frontend Architecture

### 2.1 Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js (App Router) | 14+ | React framework with SSR/SSG |
| React | 18+ | UI component library |
| TypeScript | 5+ | Type safety |
| Tailwind CSS | 3+ | Utility-first styling |
| Framer Motion | 11+ | Animation library (Aceternity dependency) |
| Aceternity UI | Latest | Premium UI components |
| Lucide React | Latest | Icon library |

### 2.2 Project Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (fonts, metadata, analytics scripts)
│   │   ├── page.tsx                  # Main landing page (composes all sections)
│   │   └── globals.css               # Global styles, Tailwind imports
│   │
│   ├── components/
│   │   ├── ui/                       # Aceternity UI components (installed via CLI)
│   │   │   ├── floating-navbar.tsx
│   │   │   ├── background-lines.tsx
│   │   │   ├── spotlight.tsx
│   │   │   ├── flip-words.tsx
│   │   │   ├── 3d-card.tsx
│   │   │   ├── focus-cards.tsx
│   │   │   ├── sticky-scroll-reveal.tsx
│   │   │   ├── timeline.tsx
│   │   │   ├── expandable-card.tsx
│   │   │   ├── card-stack.tsx
│   │   │   ├── tracing-beam.tsx
│   │   │   ├── moving-border.tsx
│   │   │   ├── hover-border-gradient.tsx
│   │   │   ├── background-beams.tsx
│   │   │   ├── aurora-background.tsx
│   │   │   ├── text-generate-effect.tsx
│   │   │   ├── colourful-text.tsx
│   │   │   └── sparkles.tsx
│   │   │
│   │   ├── sections/                 # Page section components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── WhyCaregivers.tsx
│   │   │   ├── AboutEB3.tsx
│   │   │   ├── EB3Highlights.tsx
│   │   │   ├── UrgencyCTA.tsx
│   │   │   ├── StepByStep.tsx
│   │   │   ├── InfoSessions.tsx
│   │   │   ├── AboutUs.tsx
│   │   │   ├── StatsCounter.tsx
│   │   │   ├── FAQSection.tsx
│   │   │   └── FinalCTA.tsx
│   │   │
│   │   ├── layout/                   # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   └── shared/                   # Reusable components
│   │       ├── CTAButton.tsx
│   │       ├── SectionWrapper.tsx
│   │       └── AnimatedCounter.tsx
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useScrollSection.ts
│   │   ├── useAnalytics.ts
│   │   └── useReducedMotion.ts
│   │
│   ├── lib/                          # Utility functions
│   │   ├── api.ts                    # API client for NestJS backend
│   │   ├── analytics.ts             # GA4 + FB Pixel helper functions
│   │   ├── constants.ts             # CTA URLs, section IDs, brand colors
│   │   └── cn.ts                     # Tailwind class merge utility
│   │
│   └── types/                        # TypeScript type definitions
│       ├── content.ts
│       ├── events.ts
│       └── analytics.ts
│
├── public/                           # Static assets
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
│
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 2.3 Component Architecture

#### CTAButton Component

The CTAButton is the most critical shared component. It encapsulates all external navigation logic, analytics tracking, and visual styling.

```typescript
// components/shared/CTAButton.tsx
interface CTAButtonProps {
  text: string;
  variant: 'primary' | 'secondary' | 'nav' | 'urgency' | 'final';
  position: string;        // For analytics: 'hero', 'nav', 'urgency', 'info-sessions', 'final'
  className?: string;
}

// Behavior:
// 1. On click, fire GA4 event: { event: 'cta_click', button_position, button_text, button_variant }
// 2. Fire Facebook Pixel Lead event
// 3. Append current page UTM params to external URL
// 4. Open external URL in new tab with rel="noopener noreferrer"
```

**UTM Preservation Logic:**
```typescript
function buildCTAUrl(baseUrl: string): string {
  const currentParams = new URLSearchParams(window.location.search);
  const ctaUrl = new URL(baseUrl);

  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
    const value = currentParams.get(param);
    if (value) ctaUrl.searchParams.set(param, value);
  });

  return ctaUrl.toString();
}
```

#### SectionWrapper Component

Wraps each page section with consistent structure, scroll tracking, and responsive padding.

```typescript
// components/shared/SectionWrapper.tsx
interface SectionWrapperProps {
  id: string;              // Section ID for navigation anchors
  children: React.ReactNode;
  className?: string;
  trackView?: boolean;     // Enable Intersection Observer for analytics
}

// Behavior:
// 1. Renders <section> with id attribute for anchor navigation
// 2. If trackView=true, observes element entry into viewport
// 3. Fires GA4 section_view event when >50% visible for >2 seconds
// 4. Applies consistent padding: py-16 md:py-24 px-4 md:px-8 lg:px-16
```

#### Section Component Pattern

Each section follows a consistent pattern wrapping Aceternity UI primitives:

```typescript
// Example: components/sections/HeroSection.tsx
import dynamic from 'next/dynamic';
import { SectionWrapper } from '../shared/SectionWrapper';
import { CTAButton } from '../shared/CTAButton';

// Lazy load heavy animation components
const Spotlight = dynamic(() => import('../ui/spotlight'), { ssr: false });
const FlipWords = dynamic(() => import('../ui/flip-words'), { ssr: false });
const BackgroundLines = dynamic(() => import('../ui/background-lines'), { ssr: false });

export function HeroSection() {
  const words = ["Your Path to the U.S.", "A Green Card for Your Family", "No IELTS Required"];

  return (
    <SectionWrapper id="hero" trackView>
      <BackgroundLines>
        <Spotlight />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            <FlipWords words={words} />
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            Achieve your American Dream through the EB-3 Green Card Program.
          </p>
          <CTAButton text="Start Your Application Today" variant="primary" position="hero" />
        </div>
      </BackgroundLines>
    </SectionWrapper>
  );
}
```

### 2.4 Page Composition

```typescript
// app/page.tsx
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { WhyCaregivers } from '@/components/sections/WhyCaregivers';
import { AboutEB3 } from '@/components/sections/AboutEB3';
import { EB3Highlights } from '@/components/sections/EB3Highlights';
import { UrgencyCTA } from '@/components/sections/UrgencyCTA';
import { StepByStep } from '@/components/sections/StepByStep';
import { InfoSessions } from '@/components/sections/InfoSessions';
import { AboutUs } from '@/components/sections/AboutUs';
import { StatsCounter } from '@/components/sections/StatsCounter';
import { FAQSection } from '@/components/sections/FAQSection';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { Footer } from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <WhyCaregivers />
      <AboutEB3 />
      <EB3Highlights />
      <UrgencyCTA />
      <StepByStep />
      <InfoSessions />
      <AboutUs />
      <StatsCounter />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
```

### 2.5 Aceternity UI Integration Strategy

**Installation:**
```bash
npx aceternity-ui@latest init
npx aceternity-ui@latest add [component-name]
```

**Customization for Brand Palette:**
All components customized to use brand colors: Navy (#1A3A5C), Gold (#C9A961), White (#FFFFFF).

**Mobile Adaptation:**
- 3D Card Effects: Fall back to simple hover shadow on touch devices
- Background animations: Reduced particle count on mobile (< 768px)
- Parallax effects: Disabled on mobile for performance

**Lazy Loading Strategy:**
Heavy animation components are dynamically imported with `ssr: false` to prevent server-side rendering of client-only animations:

```typescript
const BackgroundBeams = dynamic(() => import('../ui/background-beams'), { ssr: false });
const AuroraBackground = dynamic(() => import('../ui/aurora-background'), { ssr: false });
const Sparkles = dynamic(() => import('../ui/sparkles'), { ssr: false });
```

**Reduced Motion Support:**
```typescript
// hooks/useReducedMotion.ts
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}
```

When `reducedMotion` is true, all Aceternity animations are disabled or replaced with simple CSS transitions.

---

## 3. Backend Architecture

### 3.1 Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| NestJS | 10+ | Backend framework |
| Prisma | 5+ | ORM and database toolkit |
| PostgreSQL | 15+ | Relational database |
| class-validator | Latest | DTO validation |
| @nestjs/swagger | Latest | API documentation |
| @nestjs/throttler | Latest | Rate limiting |
| helmet | Latest | Security headers |

### 3.2 Project Structure

```
backend/
├── src/
│   ├── main.ts                       # Bootstrap application + Swagger setup
│   ├── app.module.ts                 # Root module
│   │
│   ├── analytics/                    # Analytics Module
│   │   ├── analytics.module.ts
│   │   ├── analytics.controller.ts
│   │   ├── analytics.service.ts
│   │   └── dto/
│   │       └── track-event.dto.ts
│   │
│   ├── content/                      # Content Module
│   │   ├── content.module.ts
│   │   ├── content.controller.ts
│   │   └── content.service.ts
│   │
│   ├── events/                       # Events Module
│   │   ├── events.module.ts
│   │   ├── events.controller.ts
│   │   └── events.service.ts
│   │
│   ├── config/                       # Config Module
│   │   ├── config.module.ts
│   │   ├── config.controller.ts
│   │   └── config.service.ts
│   │
│   ├── health/                       # Health Check
│   │   └── health.controller.ts
│   │
│   └── prisma/                       # Prisma Service
│       ├── prisma.module.ts
│       └── prisma.service.ts
│
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── seed.ts                       # Initial data seeding
│   └── migrations/                   # Migration files
│
├── Dockerfile
├── tsconfig.json
└── package.json
```

### 3.3 Module Design

#### Analytics Module
Receives frontend events and stores them for internal reporting. Supplements GA4/FB Pixel with first-party data that isn't subject to ad blockers.

```typescript
// POST /api/analytics/event
// Body: { eventType: string, label: string, metadata: object, sessionId: string }
// Rate limited: 10 requests/minute/IP
```

#### Content Module
Serves page content from the database, enabling content updates without redeployment.

```typescript
// GET /api/content/sections        → All active page sections
// GET /api/content/sections/:key   → Single section by key (e.g., "hero", "faq")
```

#### Events Module
Manages information session events (Dubai, Abu Dhabi) with dates, times, and registration status.

```typescript
// GET /api/events/sessions          → All active info sessions
```

#### Config Module
Site-wide configuration including CTA URLs, analytics IDs, feature flags, and branding.

```typescript
// GET /api/config/site              → Site configuration object
```

---

## 4. Database Schema

### 4.1 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model SectionContent {
  id          String   @id @default(cuid())
  sectionKey  String   @unique          // "hero", "why-caregivers", "faq", etc.
  title       String
  subtitle    String?
  body        String?                   // Rich text / markdown
  items       Json?                     // Array of structured items (cards, FAQ items, etc.)
  ctaText     String?
  ctaUrl      String?
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model EventSession {
  id              String   @id @default(cuid())
  city            String                // "Dubai", "Abu Dhabi"
  dates           Json                  // ["2026-02-21", "2026-02-22"]
  sessionTimes    Json                  // [{"label":"Session 1","time":"3:00 PM – 5:00 PM"}, ...]
  facilitator     String
  registrationUrl String
  disclaimer      String
  isActive        Boolean  @default(true)
  sortOrder       Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model AnalyticsEvent {
  id         String   @id @default(cuid())
  eventType  String                    // "cta_click", "section_view", "page_load", "faq_expand"
  label      String                    // "hero_cta", "urgency_cta", "faq_q1", etc.
  metadata   Json?                     // { buttonVariant, scrollDepth, utmSource, device, etc. }
  sessionId  String?                   // Anonymous session identifier
  createdAt  DateTime @default(now())

  @@index([eventType])
  @@index([createdAt])
  @@index([sessionId])
}

model SiteConfig {
  id        String   @id @default(cuid())
  key       String   @unique           // "cta_url", "ga_id", "fb_pixel_id", "feature_flags"
  value     Json                       // Flexible JSON value
  updatedAt DateTime @updatedAt
}
```

### 4.2 Seed Data

The seed file (`prisma/seed.ts`) populates initial content for all 12 page sections, the Dubai/Abu Dhabi event sessions, and site configuration values (CTA URL, analytics IDs).

---

## 5. API Design

### 5.1 Endpoint Summary

| Method | Endpoint | Auth | Rate Limit | Description |
|--------|----------|------|------------|-------------|
| `GET` | `/api/content/sections` | Public | — | All active page section content |
| `GET` | `/api/content/sections/:key` | Public | — | Single section by key |
| `GET` | `/api/events/sessions` | Public | — | Active information sessions |
| `GET` | `/api/config/site` | Public | — | Site configuration |
| `POST` | `/api/analytics/event` | Public | 10/min/IP | Track frontend event |
| `GET` | `/api/analytics/summary` | Admin | — | Analytics dashboard data |
| `GET` | `/api/health` | Public | — | Health check |

### 5.2 Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-02-04T12:00:00Z",
    "version": "1.0.0"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Section with key 'xyz' not found"
  },
  "meta": {
    "timestamp": "2026-02-04T12:00:00Z",
    "version": "1.0.0"
  }
}
```

### 5.3 Analytics Event DTO

```typescript
// dto/track-event.dto.ts
import { IsString, IsOptional, IsObject } from 'class-validator';

export class TrackEventDto {
  @IsString()
  eventType: string;      // "cta_click" | "section_view" | "page_load" | "faq_expand"

  @IsString()
  label: string;          // "hero_cta" | "section_hero" | "faq_q1"

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;  // { buttonVariant, scrollDepth, device, etc. }

  @IsOptional()
  @IsString()
  sessionId?: string;     // Anonymous session ID
}
```

### 5.4 Security

| Measure | Implementation |
|---------|---------------|
| **Rate Limiting** | `@nestjs/throttler` on analytics endpoint: 10 req/min/IP |
| **Admin Auth** | `X-API-Key` header validation for admin endpoints |
| **CORS** | Restricted to frontend domain only |
| **Security Headers** | Helmet middleware: CSP, HSTS, X-Frame-Options, X-Content-Type-Options |
| **Input Validation** | `class-validator` on all DTOs |
| **SQL Injection** | Prisma ORM with parameterized queries (no raw SQL) |

---

## 6. SEO & Structured Data

### 6.1 Next.js Metadata API

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'EB-3 Green Card for Filipino Caregivers | Marjorie Quintos & Mercan Group',
  description: 'Your path to the U.S. as a caregiver. EB-3 employer-sponsored Green Card program. No IELTS required. Bring your family. 35+ years experience. Apply today.',
  keywords: ['EB-3 visa', 'caregiver green card', 'Filipino caregiver USA', 'Mercan Group', 'Marjorie Quintos', 'no IELTS immigration'],
  openGraph: {
    title: 'EB-3 Green Card for Filipino Caregivers',
    description: 'Employer-sponsored pathway to U.S. permanent residency. No IELTS. Family included.',
    url: 'https://marjoriequintos.com/usa-eb3-caregivers/',
    siteName: 'Marjorie Quintos - EB-3 Caregivers',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EB-3 Green Card for Filipino Caregivers',
    description: 'Your path to the American Dream. No IELTS required.',
  },
};
```

### 6.2 JSON-LD Structured Data

**Organization Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Mercan Group of Companies",
  "url": "https://marjoriequintos.com",
  "logo": "https://marjoriequintos.com/images/mercan-logo.png",
  "foundingDate": "1989",
  "description": "Global immigration firm with 35+ years helping over 50,000 families immigrate.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "CA"
  },
  "sameAs": ["https://facebook.com/mercangroup"]
}
```

**Event Schema (per information session):**
```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "EB-3 Caregiver Information Session - Dubai",
  "description": "Educational session about EB-3 employment-based U.S. immigration for Filipino caregivers.",
  "startDate": "2026-02-21T15:00:00+04:00",
  "endDate": "2026-02-22T21:00:00+04:00",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "organizer": {
    "@type": "Organization",
    "name": "Mercan Group"
  },
  "performer": {
    "@type": "Person",
    "name": "Marjorie Quintos",
    "jobTitle": "Director of Immigration Services"
  },
  "location": {
    "@type": "Place",
    "name": "Dubai, UAE",
    "address": { "@type": "PostalAddress", "addressLocality": "Dubai", "addressCountry": "AE" }
  }
}
```

**FAQPage Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the EB-3 Visa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The EB-3 Visa is a U.S. employment-based immigrant program..."
      }
    }
    // ... 8 more questions
  ]
}
```

### 6.3 Performance & SEO Optimizations

| Optimization | Implementation | Impact |
|-------------|---------------|--------|
| SSR critical content | Next.js App Router server components for hero, nav, above-fold | LCP <2.5s, SEO crawlability |
| Dynamic imports | Below-fold Aceternity components with `ssr: false` | ~40% JS bundle reduction |
| Next.js Image | WebP format, responsive `sizes`, `priority` for hero | 60%+ image size reduction |
| Font optimization | `next/font` with subset loading | Zero layout shift (CLS) |
| ISR | Incremental Static Regeneration for content API | Near-instant loads |

---

## 7. Analytics & Tracking

### 7.1 Dual-Layer Analytics Architecture

```
┌─────────────────────────────────────┐
│           Frontend (Browser)         │
│                                      │
│  ┌─────────────┐  ┌──────────────┐  │
│  │   GA4 SDK    │  │  FB Pixel    │  │
│  │  (gtag.js)   │  │  (fbq)       │  │
│  └──────┬───────┘  └──────┬───────┘  │
│         │ Third-Party      │          │
│         ▼                  ▼          │
│    Google Analytics   Facebook Ads   │
│                                      │
│  ┌─────────────────────────────┐    │
│  │  First-Party Analytics       │    │
│  │  (fetch → NestJS API)        │    │
│  └──────────────┬──────────────┘    │
│                 │ POST /api/         │
│                 │ analytics/event    │
└─────────────────┼────────────────────┘
                  ▼
          ┌──────────────┐
          │   NestJS      │
          │   Analytics   │
          │   Module      │
          └──────┬───────┘
                 ▼
          ┌──────────────┐
          │  PostgreSQL   │
          │  analytics    │
          │  events       │
          └──────────────┘
```

**Why dual-layer?**
- Third-party (GA4/FB Pixel): Retargeting, audience insights, cross-platform attribution
- First-party (NestJS): Not blocked by ad blockers, full data ownership, custom dashboards

### 7.2 Event Taxonomy

| Event | Trigger | Data Captured |
|-------|---------|---------------|
| `page_load` | Page mount (useEffect) | UTM params, referrer, device type, viewport |
| `section_view` | Section enters viewport (Intersection Observer, >50% visible for >2s) | Section ID, scroll depth, time on page |
| `cta_click` | CTA button click | Button position, text, variant, UTM params |
| `faq_expand` | FAQ item expanded | Question index, question text |

### 7.3 UTM Parameter Preservation

```
Visitor arrives:
  marjoriequintos.com/usa-eb3-caregivers/?utm_source=facebook&utm_campaign=dubai_feb26

Page captures UTMs on load → stored in state

CTA click appends UTMs to external URL:
  secure.officio.ca/qnr?id=5537&hash=...&utm_source=facebook&utm_campaign=dubai_feb26
```

This enables end-to-end conversion attribution from ad click through to Officio webform submission.

### 7.4 Analytics Batching

To minimize network requests, frontend analytics events are batched:
- Events queued in memory
- Flushed to NestJS API every 5 seconds, or immediately on page unload via `navigator.sendBeacon()`
- GA4 and FB Pixel events fire immediately (not batched)

---

## 8. Deployment Architecture

### 8.1 Container Strategy

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:4000
      - NEXT_PUBLIC_GA_ID=${GA_ID}
      - NEXT_PUBLIC_FB_PIXEL_ID=${FB_PIXEL_ID}
      - NEXT_PUBLIC_CTA_URL=${CTA_URL}
    depends_on:
      - backend
    restart: on-failure:3
    deploy:
      resources:
        limits:
          memory: 512M

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/eb3landing
      - ADMIN_API_KEY=${ADMIN_API_KEY}
      - CORS_ORIGIN=https://marjoriequintos.com
      - NODE_ENV=production
    depends_on:
      db:
        condition: service_healthy
    restart: on-failure:3
    deploy:
      resources:
        limits:
          memory: 512M

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=eb3landing
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 1G

volumes:
  pgdata:
```

### 8.2 Dokploy Configuration

| Setting | Value |
|---------|-------|
| **Domain** | marjoriequintos.com |
| **SSL** | Let's Encrypt auto-renewal |
| **Reverse Proxy** | Traefik |
| **Routing** | `/api/*` → backend:4000, `/*` → frontend:3000 |
| **Health Check** | `GET /api/health` every 30s |
| **Auto-restart** | On failure, max 3 retries |
| **Resource Limits** | Frontend: 512MB, Backend: 512MB, PostgreSQL: 1GB |

### 8.3 CI/CD Pipeline

```
GitHub Push → Dokploy Webhook → Docker Build → Prisma Migrations → Health Check → Zero-Downtime Rolling Update
```

1. Developer pushes to `main` branch
2. Dokploy webhook triggers build
3. Docker images built for frontend and backend
4. Prisma migrations run automatically (`npx prisma migrate deploy`)
5. Health check validates `/api/health` endpoint
6. Rolling update replaces containers with zero downtime

---

## 9. Performance Architecture

### 9.1 Frontend Optimizations

| Optimization | Strategy | Expected Impact |
|-------------|----------|----------------|
| **SSR Critical Content** | Hero, navbar, and above-fold content rendered server-side | LCP <2.5s, SEO crawlability |
| **Dynamic Imports** | Aceternity components below fold loaded with `dynamic(() => ..., { ssr: false })` | ~40% JS bundle reduction |
| **Image Optimization** | Next.js `<Image>` with WebP, responsive `sizes`, `priority` for hero | 60%+ image size reduction |
| **Font Optimization** | `next/font` with Google Fonts subset loading | Zero layout shift |
| **Animation Throttling** | Reduced particle counts on mobile; `prefers-reduced-motion` support | Smooth 60fps on mobile |
| **ISR** | Content API data cached via Incremental Static Regeneration (revalidate: 300) | Near-instant loads for repeat visits |
| **SWR** | Client-side data fetching with stale-while-revalidate for events/config | Instant UI with background refresh |

### 9.2 Backend Optimizations

| Optimization | Strategy | Expected Impact |
|-------------|----------|----------------|
| **Response Caching** | `Cache-Control: public, max-age=300` on content/events/config endpoints | Reduced server load |
| **Analytics Batching** | Frontend batches events every 5s; `sendBeacon` on unload | Fewer API calls |
| **Connection Pooling** | Prisma connection pool: limit 10, timeout 10s | Stable DB performance |
| **Compression** | Gzip/Brotli at Traefik reverse proxy level | 70%+ transfer size reduction |

### 9.3 Performance Budget

| Resource | Budget |
|----------|--------|
| Total JavaScript (gzipped) | <150KB |
| Total CSS (gzipped) | <30KB |
| Hero image | <100KB (WebP, responsive) |
| First Contentful Paint | <1.5s |
| Largest Contentful Paint | <2.5s |
| Time to Interactive | <3.5s |
| Cumulative Layout Shift | <0.1 |

---

## 10. Security Architecture

### 10.1 Security Measures

| Threat | Mitigation |
|--------|-----------|
| **XSS (Cross-Site Scripting)** | React's built-in escaping + Content Security Policy via Helmet |
| **CSRF** | Not applicable — no forms or state-changing operations from frontend |
| **Rate Limiting** | `@nestjs/throttler` on analytics endpoint (10 req/min/IP) |
| **SQL Injection** | Prisma ORM with parameterized queries; no raw SQL anywhere |
| **HTTPS** | TLS termination at Traefik with Let's Encrypt auto-renewal |
| **Admin Access** | API key authentication via `X-API-Key` header |
| **External Links** | All CTAs use `rel="noopener noreferrer" target="_blank"` |
| **Environment Secrets** | All secrets in `.env` files; never committed to git |
| **Security Headers** | Helmet middleware: CSP, HSTS, X-Frame-Options, X-Content-Type-Options |

### 10.2 Data Privacy

- **Minimal data collection** — No PII stored in the application
- Analytics use anonymous session IDs (UUID generated client-side)
- No cookies set by the application itself (GA4/FB Pixel manage their own)
- External Officio webform handles all PII under its own privacy policies
- PostgreSQL analytics data contains only event types, labels, and anonymous metadata
- GDPR/privacy considerations: Cookie consent banner for GA4/FB Pixel (recommended)

---

## 11. Testing Strategy

### 11.1 Testing Levels

| Level | Tools | Scope | Target |
|-------|-------|-------|--------|
| **Unit Tests** | Jest, React Testing Library | Components, services, utilities | 80%+ coverage for services |
| **Integration Tests** | Supertest, Prisma test utils | API endpoints, database operations | All endpoints tested |
| **E2E Tests** | Playwright | Full user flows, CTA clicks, scroll behavior | Critical paths |
| **Visual Tests** | Playwright screenshots | Component rendering, responsive breakpoints | All sections at all breakpoints |
| **Performance** | Lighthouse CI | Core Web Vitals, page load | Score ≥90 |
| **Accessibility** | axe-core, Lighthouse | WCAG 2.1 AA compliance | Zero violations |

### 11.2 Critical Test Scenarios

| # | Scenario | Type | Priority |
|---|----------|------|----------|
| 1 | All CTAs open correct external URL in new tab | E2E | Critical |
| 2 | UTM parameters preserved through CTA redirect | E2E | Critical |
| 3 | SSR renders correctly (no hydration mismatches) | Integration | Critical |
| 4 | Animations disabled when `prefers-reduced-motion` is set | E2E | High |
| 5 | Mobile responsive at 320px / 375px / 768px / 1024px / 1440px | Visual | High |
| 6 | FAQ accordion opens/closes correctly (one item at a time) | E2E | High |
| 7 | Analytics events fire for all CTA clicks and section views | E2E | High |
| 8 | Page load time <2.5s LCP on simulated 4G | Performance | High |
| 9 | Content API returns valid data; frontend renders correctly | Integration | High |
| 10 | Info session events display correct dates and times | Integration | Medium |

---

## 12. Environment Configuration

### 12.1 Frontend Environment Variables

```env
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000      # NestJS backend URL
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX                 # Google Analytics 4 Measurement ID
NEXT_PUBLIC_FB_PIXEL_ID=1540153117181945       # Facebook Pixel ID
NEXT_PUBLIC_CTA_URL=https://secure.officio.ca/qnr?id=5537&hash=55ff3db3104048310e876b347ec3a741
```

### 12.2 Backend Environment Variables

```env
# backend/.env
DATABASE_URL=postgresql://user:password@localhost:5432/eb3landing
ADMIN_API_KEY=your-secure-admin-api-key-here
CORS_ORIGIN=https://marjoriequintos.com
PORT=4000
NODE_ENV=production
```

### 12.3 Development Setup

**Frontend:**
```bash
cd frontend
npm install
npx aceternity-ui@latest init
npx aceternity-ui@latest add floating-navbar spotlight flip-words background-lines 3d-card focus-cards sticky-scroll-reveal timeline expandable-card card-stack tracing-beam moving-border hover-border-gradient background-beams aurora-background text-generate-effect sparkles
npm run dev
```

**Backend:**
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

**Full Stack (Docker):**
```bash
docker-compose up --build
```

---

## 13. Implementation Roadmap

### Phase Overview

| Phase | Duration | Focus | Key Deliverables |
|-------|----------|-------|-----------------|
| **Phase 1** | 3–4 days | Foundation | Next.js + NestJS scaffold, Prisma schema, Docker setup, Aceternity UI init |
| **Phase 2** | 4–5 days | Core Sections | Hero, Why Caregivers, EB-3 Highlights, About EB-3 with Aceternity components |
| **Phase 3** | 3–4 days | Conversion Sections | Urgency CTA, Step-by-Step Timeline, Info Sessions, Final CTA |
| **Phase 4** | 2–3 days | Trust & Support | About Us, Stats Counter, FAQ Section, Footer |
| **Phase 5** | 3–4 days | Backend & Integration | API endpoints, database seeding, analytics tracking, CTA integration |
| **Phase 6** | 3–4 days | Polish & Deploy | Responsive testing, Lighthouse optimization, SEO meta, Dokploy deployment |

**Total Estimated Duration: 18–24 development days**

### Phase Details

#### Phase 1: Foundation (Days 1–4)
- Initialize Next.js 14 project with App Router and TypeScript
- Initialize NestJS project with module structure
- Set up Prisma schema and PostgreSQL database
- Configure Docker Compose for all three services
- Install and configure Aceternity UI with brand palette
- Set up Tailwind CSS with custom theme (navy, gold, white)
- Create shared components: CTAButton, SectionWrapper
- Implement Navbar with Floating Navbar component

#### Phase 2: Core Sections (Days 5–9)
- Build HeroSection with Spotlight, FlipWords, BackgroundLines
- Build WhyCaregivers with 3D Card Effect (4 cards)
- Build AboutEB3 with Sticky Scroll Reveal
- Build EB3Highlights with Focus Cards (4 highlights)
- Implement dynamic imports for heavy animation components
- Mobile responsiveness for all Phase 2 sections

#### Phase 3: Conversion Sections (Days 10–13)
- Build UrgencyCTA with Background Beams and Moving Border button
- Build StepByStep with Timeline component (5 steps)
- Build InfoSessions with Card Stack / Expandable Cards
- Build FinalCTA with Aurora Background and Hover Border Gradient
- Wire all CTAs to external webform with UTM preservation
- Mobile responsiveness for all Phase 3 sections

#### Phase 4: Trust & Support (Days 14–16)
- Build AboutUs with Tracing Beam (Marjorie bio + Mercan info)
- Build StatsCounter with animated number counters
- Build FAQSection with Expandable Cards (9 items, accordion behavior)
- Build Footer with copyright, social links, disclaimers
- Implement smooth scroll navigation from Navbar

#### Phase 5: Backend & Integration (Days 17–20)
- Implement all NestJS API endpoints (content, events, config, analytics)
- Create Prisma seed data for all 12 sections and event sessions
- Integrate frontend with backend API (SWR/ISR for content fetching)
- Implement GA4 SDK integration with custom events
- Implement Facebook Pixel integration with Lead events
- Implement first-party analytics batching and sendBeacon
- Add Helmet security headers and CORS configuration
- Add rate limiting on analytics endpoint

#### Phase 6: Polish & Deploy (Days 21–24)
- Cross-device responsive testing at all 5 breakpoints
- Lighthouse performance optimization (target ≥90)
- Implement `prefers-reduced-motion` support across all sections
- Add JSON-LD structured data (Organization, Event, FAQPage)
- Configure Open Graph and Twitter Card meta tags
- Set up Docker Compose for production
- Deploy to Dokploy with Traefik routing
- Configure Let's Encrypt SSL
- Verify GA4 and FB Pixel event tracking in production
- Final QA: all CTAs, all sections, all breakpoints

---

*End of Architecture Document — EB-3 Caregivers Landing Page*
*Companion: PRD_EB3_Caregivers_Landing_Page.md (Business + Manager Layers)*
