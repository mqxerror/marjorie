---
status: complete
workflowType: 'epics-and-stories'
projectName: Marjorie
author: wassim
date: 2026-02-04
inputDocuments:
  - prd.md
  - architecture.md
---

# Epics & Stories
## EB-3 Caregivers Landing Page — Marjorie Quintos / Mercan Group

**BMAD Layer:** Implementation Planning
**Version:** 1.0
**Date:** February 4, 2026
**Source Documents:** PRD + Architecture

---

## Epic Overview

| Epic | Name | Stories | Priority |
|------|------|---------|----------|
| E1 | Foundation & Infrastructure | 8 | P0 - Critical |
| E2 | Core Page Sections | 8 | P0 - Critical |
| E3 | Conversion Sections | 6 | P0 - Critical |
| E4 | Trust & Support Sections | 6 | P1 - High |
| E5 | Backend API & Integration | 8 | P0 - Critical |
| E6 | Polish, Testing & Deployment | 8 | P0 - Critical |

**Total Stories:** 44

---

## Epic 1: Foundation & Infrastructure

**Goal:** Establish project scaffolding, development environment, and shared components.

**Acceptance Criteria:**
- Next.js 14 project initialized with App Router and TypeScript
- NestJS project initialized with modular architecture
- PostgreSQL database running with Prisma schema applied
- Docker Compose configuration working for all services
- Aceternity UI installed with brand palette configured
- Shared components (CTAButton, SectionWrapper) implemented

---

### Story 1.1: Initialize Next.js Frontend Project

**As a** developer
**I want** a Next.js 14 project with App Router and TypeScript configured
**So that** I have a modern React foundation for the landing page

**Acceptance Criteria:**
- [ ] Next.js 14+ initialized with `create-next-app`
- [ ] App Router structure in `src/app/`
- [ ] TypeScript configured with strict mode
- [ ] ESLint and Prettier configured
- [ ] `src/components/`, `src/hooks/`, `src/lib/`, `src/types/` directories created
- [ ] Project runs with `npm run dev`

**Technical Notes:**
```bash
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir
```

---

### Story 1.2: Initialize NestJS Backend Project

**As a** developer
**I want** a NestJS project with modular architecture
**So that** I have a scalable backend for analytics and content APIs

**Acceptance Criteria:**
- [ ] NestJS 10+ initialized
- [ ] TypeScript configured
- [ ] Module structure created: `analytics/`, `content/`, `events/`, `config/`, `health/`, `prisma/`
- [ ] Swagger documentation configured
- [ ] Project runs with `npm run start:dev`

**Technical Notes:**
```bash
npx @nestjs/cli new backend
```

---

### Story 1.3: Configure PostgreSQL with Prisma

**As a** developer
**I want** Prisma ORM connected to PostgreSQL with the defined schema
**So that** I can persist content, events, analytics, and config data

**Acceptance Criteria:**
- [ ] Prisma installed in backend project
- [ ] `schema.prisma` contains all 4 models: `SectionContent`, `EventSession`, `AnalyticsEvent`, `SiteConfig`
- [ ] Indexes defined on `AnalyticsEvent` (eventType, createdAt, sessionId)
- [ ] Initial migration created and applied
- [ ] `PrismaService` created as NestJS provider
- [ ] Database connection works in development

**Technical Notes:**
- Use connection string: `postgresql://user:password@localhost:5432/eb3landing`

---

### Story 1.4: Create Docker Compose Configuration

**As a** developer
**I want** Docker Compose to orchestrate frontend, backend, and database
**So that** the full stack can run with a single command

**Acceptance Criteria:**
- [ ] `docker-compose.yml` created at project root
- [ ] Frontend service configured on port 3000
- [ ] Backend service configured on port 4000
- [ ] PostgreSQL service configured on port 5432 with health check
- [ ] Volume defined for PostgreSQL data persistence
- [ ] Environment variables externalized to `.env`
- [ ] `docker-compose up --build` starts all services

---

### Story 1.5: Install and Configure Aceternity UI

**As a** developer
**I want** Aceternity UI installed with all required components
**So that** I can use premium animated components throughout the landing page

**Acceptance Criteria:**
- [ ] Aceternity UI initialized with `npx aceternity-ui@latest init`
- [ ] All 17 required components installed (floating-navbar, spotlight, flip-words, background-lines, 3d-card, focus-cards, sticky-scroll-reveal, timeline, expandable-card, card-stack, tracing-beam, moving-border, hover-border-gradient, background-beams, aurora-background, text-generate-effect, sparkles)
- [ ] Components placed in `src/components/ui/`
- [ ] Framer Motion dependency installed

**Technical Notes:**
```bash
npx aceternity-ui@latest add floating-navbar spotlight flip-words background-lines 3d-card focus-cards sticky-scroll-reveal timeline expandable-card card-stack tracing-beam moving-border hover-border-gradient background-beams aurora-background text-generate-effect sparkles
```

---

### Story 1.6: Configure Tailwind with Brand Palette

**As a** developer
**I want** Tailwind CSS configured with the brand color palette
**So that** all components use consistent branding

**Acceptance Criteria:**
- [ ] `tailwind.config.ts` extended with brand colors:
  - Navy Blue: `#1A3A5C`
  - Gold: `#C9A961`
  - Light Gray: `#F5F5F5`
  - Dark Text: `#1A1A1A`
- [ ] Custom utility classes created for common patterns
- [ ] `globals.css` imports Tailwind base, components, utilities
- [ ] Dark theme configured as default for hero sections

---

### Story 1.7: Create CTAButton Shared Component

**As a** developer
**I want** a reusable CTAButton component that handles all CTA logic
**So that** all CTAs behave consistently across the page

**Acceptance Criteria:**
- [ ] `CTAButton.tsx` created in `src/components/shared/`
- [ ] Props: `text`, `variant` ('primary' | 'secondary' | 'nav' | 'urgency' | 'final'), `position` (for analytics)
- [ ] Opens external webform URL in new tab with `rel="noopener noreferrer"`
- [ ] Appends current page UTM params to external URL
- [ ] Fires GA4 `cta_click` event before redirect
- [ ] Fires Facebook Pixel `Lead` event before redirect
- [ ] Variant styles: primary (large gold), nav (compact), urgency (Moving Border), final (Hover Border Gradient)

**Technical Notes:**
- External URL: `https://secure.officio.ca/qnr?id=5537&hash=55ff3db3104048310e876b347ec3a741`

---

### Story 1.8: Create SectionWrapper Shared Component

**As a** developer
**I want** a reusable SectionWrapper component for consistent section structure
**So that** all sections have consistent padding, IDs, and analytics tracking

**Acceptance Criteria:**
- [ ] `SectionWrapper.tsx` created in `src/components/shared/`
- [ ] Props: `id` (string), `children`, `className`, `trackView` (boolean)
- [ ] Renders `<section>` with ID for anchor navigation
- [ ] Applies consistent padding: `py-16 md:py-24 px-4 md:px-8 lg:px-16`
- [ ] When `trackView=true`, uses Intersection Observer to track when section is >50% visible for >2s
- [ ] Fires GA4 `section_view` event when tracked

---

## Epic 2: Core Page Sections

**Goal:** Build the primary page sections that establish value proposition and educate visitors.

**Acceptance Criteria:**
- Navbar with sticky behavior and CTA
- Hero section with animated value proposition
- Why Caregivers section with 4 benefit cards
- About EB-3 section with educational content
- EB-3 Highlights section with 4 feature cards
- All sections responsive across 5 breakpoints

---

### Story 2.1: Build Navbar Component

**As a** visitor
**I want** a persistent navigation bar with section links and CTA
**So that** I can navigate the page and access the application form anytime

**Acceptance Criteria:**
- [ ] Uses Aceternity Floating Navbar component
- [ ] Logo (Mercan Group) on left
- [ ] Section anchor links in center: Why Caregivers, About EB-3, Process, Events, About Us, FAQ
- [ ] "Apply Now" CTA button on right using Moving Border style
- [ ] Transparent background over hero, solid navy on scroll
- [ ] Smooth scroll to sections on click
- [ ] Mobile: Hamburger menu with full-screen overlay
- [ ] CTA button always visible even in mobile menu

---

### Story 2.2: Build Hero Section

**As a** visitor
**I want** an impactful hero section that immediately communicates the value proposition
**So that** I understand what this page offers and feel compelled to learn more

**Acceptance Criteria:**
- [ ] Uses Spotlight + Background Lines components
- [ ] Large headline with FlipWords rotating: "Your Path to the U.S.", "A Green Card for Your Family", "No IELTS Required"
- [ ] Subtitle: "Achieve your American Dream through the EB-3 Green Card Program. A legal, employer-sponsored pathway for Filipino caregivers."
- [ ] Primary CTA button: "Start Your Application Today"
- [ ] Hero image placeholder (Marjorie Quintos photo - to be provided)
- [ ] Full viewport height on desktop
- [ ] Mobile: Stacked layout, reduced animation complexity
- [ ] `prefers-reduced-motion` disables animations

---

### Story 2.3: Build Why Filipino Caregivers Section

**As a** visitor
**I want** to understand why Filipino caregivers are ideal for the EB-3 program
**So that** I feel confident this opportunity is relevant to me

**Acceptance Criteria:**
- [ ] Uses 3D Card Effect component
- [ ] 4 cards in 2x2 grid (desktop), stacked on mobile:
  1. High Demand for Caregivers
  2. No Language Exam Needed
  3. Stable Future & Citizenship
  4. Bring Your Family Along
- [ ] Each card: Icon, title, 2-3 sentence description
- [ ] 3D tilt effect on hover (desktop only)
- [ ] Intro paragraph comparing Canada points system vs EB-3
- [ ] Section tracked for analytics

---

### Story 2.4: Build About EB-3 Program Section

**As a** visitor
**I want** to understand what the EB-3 visa program is
**So that** I can make an informed decision about applying

**Acceptance Criteria:**
- [ ] Uses Sticky Scroll Reveal component
- [ ] Sticky image/illustration on left (U.S. flag or related)
- [ ] Scrolling content blocks on right explaining:
  - What EB-3 is
  - How employer sponsorship works
  - Green Card pathway
  - Family inclusion
- [ ] Educational, trust-building tone
- [ ] Mobile: Standard stacked layout (no sticky behavior)

---

### Story 2.5: Build EB-3 Highlights Section

**As a** visitor
**I want** to see the key benefits of the EB-3 program at a glance
**So that** I can quickly understand why this is a good opportunity

**Acceptance Criteria:**
- [ ] Uses Focus Cards component
- [ ] 4 cards highlighting:
  1. No IELTS or Point System
  2. Real Job & Green Card
  3. All Skill Levels Welcome
  4. Permanent Residency for the Family
- [ ] Focus effect: hover on one card blurs others
- [ ] Each card: Icon, heading, description
- [ ] Summary statement below cards
- [ ] Mobile: Cards stack, focus effect disabled

---

### Story 2.6: Implement Dynamic Imports for Animation Components

**As a** developer
**I want** heavy animation components loaded dynamically
**So that** initial page load is fast and meets performance budgets

**Acceptance Criteria:**
- [ ] Spotlight, BackgroundLines, BackgroundBeams, AuroraBackground, Sparkles use `dynamic(() => ..., { ssr: false })`
- [ ] Loading states shown while components load
- [ ] No hydration mismatches
- [ ] Bundle size reduced by ~40% compared to static imports

---

### Story 2.7: Implement Reduced Motion Support

**As a** visitor with motion sensitivity
**I want** animations disabled when I have `prefers-reduced-motion` enabled
**So that** I can use the site comfortably

**Acceptance Criteria:**
- [ ] `useReducedMotion` hook created in `src/hooks/`
- [ ] Hook listens to `prefers-reduced-motion` media query
- [ ] All Aceternity animation components respect reduced motion preference
- [ ] Animations replaced with simple CSS transitions or disabled entirely
- [ ] No motion when `prefers-reduced-motion: reduce` is set

---

### Story 2.8: Mobile Responsiveness for Core Sections

**As a** mobile visitor
**I want** all core sections to display correctly on my device
**So that** I can browse the page comfortably on my phone

**Acceptance Criteria:**
- [ ] All sections tested at 320px, 375px, 768px, 1024px, 1440px
- [ ] Hero: Stacked layout on mobile, reduced animations
- [ ] Why Caregivers: Cards stack vertically, 3D effect disabled on touch
- [ ] About EB-3: Sticky behavior disabled on mobile
- [ ] EB-3 Highlights: Cards stack, focus effect disabled
- [ ] Touch targets minimum 44x44px
- [ ] No horizontal scroll at any breakpoint

---

## Epic 3: Conversion Sections

**Goal:** Build the high-conversion sections that drive visitors to take action.

**Acceptance Criteria:**
- Urgency CTA banner with scarcity messaging
- Step-by-step process timeline
- Information sessions section with event details
- Final CTA section with compelling close

---

### Story 3.1: Build Urgency CTA Banner Section

**As a** visitor
**I want** to feel urgency about applying
**So that** I'm motivated to take action now rather than later

**Acceptance Criteria:**
- [ ] Uses Background Beams with Collision component
- [ ] Bold headline: "ONLY 250 SPOTS LEFT — ACT FAST"
- [ ] Subtext about first-come-first-served availability
- [ ] 3 supporting points with icons
- [ ] CTA button with Moving Border effect: "Secure Your Spot Now"
- [ ] High contrast design (dark background, bright accents)
- [ ] Full-width section
- [ ] Mobile: Simplified beam animation for performance

---

### Story 3.2: Build Step-by-Step Process Section

**As a** visitor
**I want** to understand the EB-3 application process
**So that** I know what to expect if I apply

**Acceptance Criteria:**
- [ ] Uses Timeline component
- [ ] 5 steps displayed vertically:
  1. Free Eligibility Review
  2. Employer Matching
  3. Labor Certification (PERM)
  4. Immigrant Petition & Visa Processing
  5. Green Card & Relocation
- [ ] Each step: Number, title, description, icon
- [ ] Steps reveal on scroll with animation
- [ ] Connecting line between steps
- [ ] Mobile: Same layout, optimized spacing

---

### Story 3.3: Build Information Sessions Section

**As a** visitor
**I want** to see upcoming information session dates and details
**So that** I can attend a session to learn more in person

**Acceptance Criteria:**
- [ ] Uses Card Stack or Expandable Cards component
- [ ] Displays Dubai sessions (Feb 21-22, 2026) and Abu Dhabi sessions (Feb 28 - Mar 1, 2026)
- [ ] Session times: 3:00-5:00 PM and 7:00-9:00 PM
- [ ] Facilitator info: Marjorie Quintos, Director of Immigration Services
- [ ] "Apply to Attend" CTA button per event
- [ ] Disclaimer displayed: "This session is informational only..."
- [ ] Content loaded from backend API (future integration)

---

### Story 3.4: Build Final CTA Section

**As a** visitor
**I want** a compelling final call-to-action
**So that** I have one last clear opportunity to apply before leaving the page

**Acceptance Criteria:**
- [ ] Uses Aurora Background component
- [ ] Headline: "EB-3 U.S. Green Card — 250 SPOTS LEFT"
- [ ] Subtext emphasizing family inclusion and employer sponsorship
- [ ] Large CTA button with Hover Border Gradient: "Start Your Application"
- [ ] Immersive gradient background effect
- [ ] Section spans full width
- [ ] Mobile: Simplified aurora animation

---

### Story 3.5: Build Footer Component

**As a** visitor
**I want** to see copyright, social links, and legal information
**So that** I know the site is legitimate and can find more information

**Acceptance Criteria:**
- [ ] Mercan Group logo
- [ ] Social links: Facebook, YouTube, TikTok (icons)
- [ ] Copyright notice: © 2026 Mercan Group of Companies
- [ ] Regulatory disclaimer text
- [ ] Links open in new tab
- [ ] Consistent styling with rest of page
- [ ] Mobile: Stacked layout

---

### Story 3.6: Mobile Responsiveness for Conversion Sections

**As a** mobile visitor
**I want** conversion sections optimized for my device
**So that** I can easily take action on my phone

**Acceptance Criteria:**
- [ ] Urgency CTA: Simplified beams, full-width button
- [ ] Timeline: Vertical layout with adequate spacing
- [ ] Info Sessions: Cards stack vertically
- [ ] Final CTA: Aurora simplified, prominent button
- [ ] Footer: Stacked layout
- [ ] All CTAs easily tappable (44x44px minimum)

---

## Epic 4: Trust & Support Sections

**Goal:** Build sections that establish credibility and handle objections.

**Acceptance Criteria:**
- About Us section with Marjorie and Mercan bios
- Stats counter with animated numbers
- FAQ accordion with 9 questions
- All sections responsive

---

### Story 4.1: Build About Us Section

**As a** visitor
**I want** to learn about Marjorie Quintos and Mercan Group
**So that** I can trust that this is a legitimate, experienced service

**Acceptance Criteria:**
- [ ] Uses Tracing Beam component
- [ ] Two content blocks connected by tracing beam:
  1. Marjorie Quintos bio (RCIC, 20 years experience, Filipina immigrant)
  2. Mercan Group info (since 1989, 50K+ families, global offices)
- [ ] Photo placeholder for Marjorie (to be provided by client)
- [ ] Mercan Group logo
- [ ] Beam follows scroll through content
- [ ] Mobile: Standard layout without beam animation

---

### Story 4.2: Build Stats Counter Section

**As a** visitor
**I want** to see impressive statistics about Mercan Group
**So that** I'm reassured by their track record

**Acceptance Criteria:**
- [ ] Uses animated Stats Sections component
- [ ] 3 counters:
  - 35+ Years in Business
  - 50K+ Immigration Cases
  - 10+ Offices Worldwide
- [ ] Numbers count up from 0 when section enters viewport
- [ ] Animation triggers once (not on every scroll)
- [ ] Large typography with gold accent color
- [ ] Optional: Sparkles effect around numbers

---

### Story 4.3: Build FAQ Section

**As a** visitor
**I want** answers to common questions about the EB-3 program
**So that** my concerns are addressed before I apply

**Acceptance Criteria:**
- [ ] Uses Expandable Cards component
- [ ] 9 FAQ items (from PRD):
  1. What is the EB-3 Visa?
  2. Who can apply for EB-3?
  3. Do I need to take the IELTS?
  4. Can my spouse and children come with me?
  5. Do I need a U.S. employer before applying?
  6. How long does the EB-3 process take?
  7. What kind of U.S. jobs are available?
  8. Is there an age limit?
  9. Why should I trust Mercan Group?
- [ ] Accordion behavior: Only one item open at a time
- [ ] Smooth expand/collapse animation
- [ ] FAQ expansion tracked for analytics

---

### Story 4.4: Implement FAQ Analytics Tracking

**As a** product owner
**I want** to know which FAQ questions visitors expand
**So that** I can understand their concerns and improve content

**Acceptance Criteria:**
- [ ] `faq_expand` event fired when FAQ item is expanded
- [ ] Event data includes: question index, question text
- [ ] Events sent to both GA4 and first-party analytics
- [ ] No duplicate events for same question in same session

---

### Story 4.5: Implement Smooth Scroll Navigation

**As a** visitor
**I want** clicking nav links to smoothly scroll to sections
**So that** navigation feels polished and professional

**Acceptance Criteria:**
- [ ] Clicking nav link scrolls smoothly to corresponding section
- [ ] Scroll offset accounts for fixed navbar height
- [ ] URL hash updates on scroll (optional)
- [ ] Active section highlighted in navbar (optional)
- [ ] Works on both desktop and mobile

---

### Story 4.6: Mobile Responsiveness for Trust Sections

**As a** mobile visitor
**I want** trust sections optimized for my device
**So that** I can easily read credentials and FAQ on my phone

**Acceptance Criteria:**
- [ ] About Us: Tracing beam disabled, content stacks
- [ ] Stats: Counters stack vertically, smaller typography
- [ ] FAQ: Full-width cards, touch-friendly expand/collapse
- [ ] All text readable without zooming
- [ ] Adequate touch targets

---

## Epic 5: Backend API & Integration

**Goal:** Implement NestJS API endpoints and integrate with frontend.

**Acceptance Criteria:**
- All API endpoints implemented (content, events, config, analytics)
- Database seeded with initial content
- Frontend integrated with backend API
- GA4 and Facebook Pixel integration complete
- First-party analytics batching implemented

---

### Story 5.1: Implement Content API Module

**As a** frontend developer
**I want** API endpoints to fetch page section content
**So that** content can be updated without code deployment

**Acceptance Criteria:**
- [ ] `GET /api/content/sections` returns all active sections
- [ ] `GET /api/content/sections/:key` returns single section by key
- [ ] Response format follows standard success/error structure
- [ ] `Cache-Control: public, max-age=300` header on responses
- [ ] Returns 404 for unknown section keys

---

### Story 5.2: Implement Events API Module

**As a** frontend developer
**I want** an API endpoint to fetch information session data
**So that** event details can be updated without code deployment

**Acceptance Criteria:**
- [ ] `GET /api/events/sessions` returns all active sessions
- [ ] Response includes: city, dates, session times, facilitator, disclaimer
- [ ] Sessions ordered by sortOrder
- [ ] Inactive sessions filtered out
- [ ] `Cache-Control: public, max-age=300` header

---

### Story 5.3: Implement Config API Module

**As a** frontend developer
**I want** an API endpoint to fetch site configuration
**So that** CTA URLs and analytics IDs can be changed without deployment

**Acceptance Criteria:**
- [ ] `GET /api/config/site` returns site configuration object
- [ ] Config includes: CTA URL, GA ID, FB Pixel ID, feature flags
- [ ] Response cached with `Cache-Control`

---

### Story 5.4: Implement Analytics API Module

**As a** frontend developer
**I want** an API endpoint to track analytics events
**So that** I have first-party analytics data not blocked by ad blockers

**Acceptance Criteria:**
- [ ] `POST /api/analytics/event` accepts event data
- [ ] DTO validation with class-validator
- [ ] Rate limited: 10 requests/minute/IP
- [ ] Events stored in `AnalyticsEvent` table
- [ ] Returns 201 on success, 429 on rate limit

---

### Story 5.5: Create Database Seed Data

**As a** developer
**I want** initial seed data for all tables
**So that** the application has content on first run

**Acceptance Criteria:**
- [ ] `prisma/seed.ts` created
- [ ] Seeds 12 `SectionContent` records (one per section)
- [ ] Seeds 2 `EventSession` records (Dubai and Abu Dhabi)
- [ ] Seeds `SiteConfig` records (CTA URL, GA ID, FB Pixel ID)
- [ ] Seed script runs via `npx prisma db seed`
- [ ] Seed is idempotent (can run multiple times)

---

### Story 5.6: Implement GA4 Integration

**As a** product owner
**I want** Google Analytics 4 tracking implemented
**So that** I can analyze visitor behavior and conversions

**Acceptance Criteria:**
- [ ] GA4 script loaded in root layout
- [ ] `page_view` event on page load
- [ ] `cta_click` custom event on CTA clicks
- [ ] `section_view` custom event on section visibility
- [ ] UTM parameters captured and preserved
- [ ] Events include device type and viewport

---

### Story 5.7: Implement Facebook Pixel Integration

**As a** product owner
**I want** Facebook Pixel tracking implemented
**So that** I can retarget visitors and track conversions from ads

**Acceptance Criteria:**
- [ ] Facebook Pixel script loaded with ID `1540153117181945`
- [ ] `PageView` event on page load
- [ ] `Lead` event on CTA clicks
- [ ] `ViewContent` event on section views
- [ ] Events match GA4 taxonomy where applicable

---

### Story 5.8: Implement Analytics Batching

**As a** developer
**I want** first-party analytics events batched
**So that** we minimize API requests and handle page unload gracefully

**Acceptance Criteria:**
- [ ] Events queued in memory
- [ ] Queue flushed to API every 5 seconds
- [ ] Queue flushed immediately on page unload via `navigator.sendBeacon()`
- [ ] Failed sends retried once
- [ ] GA4 and FB Pixel events fire immediately (not batched)

---

## Epic 6: Polish, Testing & Deployment

**Goal:** Optimize performance, implement SEO, run tests, and deploy to production.

**Acceptance Criteria:**
- Lighthouse score ≥90
- All critical test scenarios passing
- SEO metadata and structured data implemented
- Production deployment on Dokploy
- SSL configured with Let's Encrypt

---

### Story 6.1: Implement SEO Metadata

**As a** search engine crawler
**I want** proper metadata on the page
**So that** the page ranks well for target keywords

**Acceptance Criteria:**
- [ ] `metadata` object in root layout with title, description, keywords
- [ ] Open Graph tags for Facebook/social sharing
- [ ] Twitter Card tags
- [ ] Canonical URL set
- [ ] Semantic heading hierarchy (single H1)
- [ ] All images have alt text

---

### Story 6.2: Implement JSON-LD Structured Data

**As a** search engine
**I want** structured data on the page
**So that** rich snippets appear in search results

**Acceptance Criteria:**
- [ ] Organization schema for Mercan Group
- [ ] Event schema for Dubai and Abu Dhabi sessions
- [ ] FAQPage schema for FAQ section
- [ ] JSON-LD script tags in page head
- [ ] Validates in Google Rich Results Test

---

### Story 6.3: Performance Optimization

**As a** visitor
**I want** the page to load quickly
**So that** I don't leave before seeing the content

**Acceptance Criteria:**
- [ ] Lighthouse Performance score ≥90
- [ ] LCP <2.5 seconds
- [ ] FID <100ms
- [ ] CLS <0.1
- [ ] Total JS bundle <150KB gzipped
- [ ] Hero image optimized <100KB WebP
- [ ] `next/font` used for fonts (zero CLS)
- [ ] `next/image` used for all images

---

### Story 6.4: Accessibility Audit

**As a** visitor with disabilities
**I want** the page to be accessible
**So that** I can use it with assistive technology

**Acceptance Criteria:**
- [ ] WCAG 2.1 Level AA compliance
- [ ] Zero axe-core violations
- [ ] Full keyboard navigation
- [ ] Screen reader tested (VoiceOver/NVDA)
- [ ] Color contrast ratio ≥4.5:1 for body text
- [ ] Focus indicators on all interactive elements
- [ ] Skip to main content link

---

### Story 6.5: E2E Testing with Playwright

**As a** developer
**I want** E2E tests for critical user flows
**So that** regressions are caught before deployment

**Acceptance Criteria:**
- [ ] Playwright configured
- [ ] Test: All 5 CTAs open correct external URL in new tab
- [ ] Test: UTM parameters preserved through CTA redirect
- [ ] Test: FAQ accordion opens/closes correctly
- [ ] Test: Mobile responsive at 375px and 768px
- [ ] Test: `prefers-reduced-motion` disables animations
- [ ] Tests run in CI pipeline

---

### Story 6.6: Visual Regression Testing

**As a** developer
**I want** visual regression tests at all breakpoints
**So that** UI changes are intentional

**Acceptance Criteria:**
- [ ] Playwright screenshot tests configured
- [ ] Screenshots captured at 320px, 375px, 768px, 1024px, 1440px
- [ ] All 12 sections captured
- [ ] Baseline images stored in repo
- [ ] Visual diff on PR

---

### Story 6.7: Production Deployment Configuration

**As a** developer
**I want** production deployment configured on Dokploy
**So that** the application is accessible on the internet

**Acceptance Criteria:**
- [ ] `docker-compose.prod.yml` created with production settings
- [ ] Environment variables configured for production
- [ ] Traefik routing: `/api/*` → backend, `/*` → frontend
- [ ] Health check endpoint `/api/health` configured
- [ ] Auto-restart on failure (max 3 retries)
- [ ] Resource limits set (frontend 512MB, backend 512MB, DB 1GB)

---

### Story 6.8: SSL and Domain Configuration

**As a** visitor
**I want** the site served over HTTPS
**So that** my connection is secure

**Acceptance Criteria:**
- [ ] Let's Encrypt SSL configured via Traefik
- [ ] Auto-renewal configured
- [ ] HTTP redirects to HTTPS
- [ ] Domain marjoriequintos.com pointed to Dokploy server
- [ ] SSL certificate valid and trusted
- [ ] HSTS header enabled

---

## Story Status Tracking

| Story | Status | Assignee | Notes |
|-------|--------|----------|-------|
| 1.1 | Pending | - | - |
| 1.2 | Pending | - | - |
| 1.3 | Pending | - | - |
| 1.4 | Pending | - | - |
| 1.5 | Pending | - | - |
| 1.6 | Pending | - | - |
| 1.7 | Pending | - | - |
| 1.8 | Pending | - | - |
| 2.1 | Pending | - | - |
| 2.2 | Pending | - | - |
| 2.3 | Pending | - | - |
| 2.4 | Pending | - | - |
| 2.5 | Pending | - | - |
| 2.6 | Pending | - | - |
| 2.7 | Pending | - | - |
| 2.8 | Pending | - | - |
| 3.1 | Pending | - | - |
| 3.2 | Pending | - | - |
| 3.3 | Pending | - | - |
| 3.4 | Pending | - | - |
| 3.5 | Pending | - | - |
| 3.6 | Pending | - | - |
| 4.1 | Pending | - | - |
| 4.2 | Pending | - | - |
| 4.3 | Pending | - | - |
| 4.4 | Pending | - | - |
| 4.5 | Pending | - | - |
| 4.6 | Pending | - | - |
| 5.1 | Pending | - | - |
| 5.2 | Pending | - | - |
| 5.3 | Pending | - | - |
| 5.4 | Pending | - | - |
| 5.5 | Pending | - | - |
| 5.6 | Pending | - | - |
| 5.7 | Pending | - | - |
| 5.8 | Pending | - | - |
| 6.1 | Pending | - | - |
| 6.2 | Pending | - | - |
| 6.3 | Pending | - | - |
| 6.4 | Pending | - | - |
| 6.5 | Pending | - | - |
| 6.6 | Pending | - | - |
| 6.7 | Pending | - | - |
| 6.8 | Pending | - | - |

---

*End of Epics & Stories — EB-3 Caregivers Landing Page*
*Ready for Developer Layer implementation*
