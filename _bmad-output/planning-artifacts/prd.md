---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
inputDocuments:
  - prd.md
  - PRD_EB3_Caregivers_Landing_Page.docx
workflowType: 'prd'
lastStep: 11
status: complete
projectName: Marjorie
author: wassim
date: 2026-02-04
---

# Product Requirements Document (PRD)
## EB-3 Caregivers Landing Page — Marjorie Quintos / Mercan Group

**BMAD Layers:** Business + Manager
**Version:** 1.0
**Date:** February 4, 2026
**Project:** Rebuild of marjoriequintos.com/usa-eb3-caregivers/
**Methodology:** BMAD (Business → Manager → Architect → Developer)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Objectives](#2-business-objectives)
3. [Target Audience](#3-target-audience)
4. [Page Content Structure](#4-page-content-structure)
5. [CTA Strategy](#5-cta-strategy)
6. [Aceternity UI Component Specifications](#6-aceternity-ui-component-specifications)
7. [User Flows](#7-user-flows)
8. [Content Requirements](#8-content-requirements)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Technology Stack Summary](#10-technology-stack-summary)
11. [Constraints & Assumptions](#11-constraints--assumptions)
12. [Project Deliverables](#12-project-deliverables)

---

## 1. Executive Summary

This document defines the product requirements for rebuilding the existing EB-3 Caregivers landing page (marjoriequintos.com/usa-eb3-caregivers/) as a modern, high-performance single-page application. The rebuild leverages React/Next.js for the frontend with Aceternity UI components for premium visual effects, and NestJS for a lightweight backend API.

**Key Design Decision:** All call-to-action (CTA) buttons redirect to an external webform at `https://secure.officio.ca/qnr?id=5537&hash=55ff3db3104048310e876b347ec3a741`. There are no internal forms, newsletter signups, or data collection within the application itself. CTA buttons open in a new tab with UTM parameter preservation for conversion tracking.

The project follows the BMAD methodology:
- **Business Layer** — Goals, KPIs, target audience, and success metrics
- **Manager Layer** — Content structure, user flows, component specifications, and requirements
- **Architect Layer** — System design, API contracts, database schema (separate Architecture document)
- **Developer Layer** — Implementation (future phase)

---

## 2. Business Objectives

### 2.1 Primary Goals

| Goal | Description |
|------|-------------|
| **Lead Generation** | Drive qualified Filipino caregivers in the UAE to the external Officio webform to begin the EB-3 eligibility process |
| **Brand Authority** | Establish Marjorie Quintos and Mercan Group as the trusted, authoritative resource for EB-3 caregiver immigration |
| **Education & Trust** | Educate visitors about the EB-3 program, dispel myths, and build confidence in the process and service provider |
| **Conversion Optimization** | Maximize CTA click-through rate through strategic placement, urgency messaging, and premium UI design |

### 2.2 Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| CTA Click-Through Rate | ≥15% of visitors | GA4 custom event tracking |
| Bounce Rate | <40% | GA4 engagement metrics |
| Average Time on Page | >3 minutes | GA4 session duration |
| Page Load Time (LCP) | <2.5 seconds | Lighthouse / Core Web Vitals |
| Mobile Conversion Rate | Within 80% of desktop | GA4 device segmentation |
| SEO Ranking | Page 1 for target keywords | Google Search Console |
| Facebook Pixel Events | Track all CTA clicks | Facebook Events Manager |

### 2.3 Target Keywords

- EB-3 visa caregiver
- EB-3 green card Filipino
- USA caregiver immigration
- EB-3 program no IELTS
- Filipino caregiver USA visa
- Mercan Group EB-3
- Marjorie Quintos immigration

---

## 3. Target Audience

### 3.1 Primary Persona: Filipino Caregiver in UAE

| Attribute | Detail |
|-----------|--------|
| **Nationality** | Filipino national |
| **Current Location** | Dubai or Abu Dhabi, UAE |
| **Age Range** | 25–50 years |
| **Experience** | Caregiving, home health care, or related support roles — OR willingness to work in caregiving |
| **Migration Goal** | Long-term U.S. permanent residency, not temporary work |
| **Family Situation** | Often has spouse and children; family reunification is a key motivator |
| **Education** | Varies; formal degree not required for EB-3 "Other Workers" category |
| **Language** | English-speaking (no IELTS required — this is a major selling point) |
| **Tech Profile** | Mobile-first; primary platforms are WhatsApp and Facebook |
| **Financial Readiness** | Willing to invest in a multi-year immigration process |

### 3.2 Pain Points & Motivations

**Pain Points:**
- Frustrated by Canada's increasingly selective points-based system and IELTS requirements
- Concerned about scams and illegitimate immigration services
- Overwhelmed by complex immigration processes and unclear timelines
- Worried about being separated from family during migration
- Uncertain about financial commitments and hidden costs

**Motivations:**
- Desire for long-term stability and a permanent home in the U.S.
- Family reunification — bringing spouse and children together
- Career opportunity in a high-demand field (U.S. caregiving shortage)
- Path to U.S. citizenship after obtaining Green Card
- Working with a trusted, established immigration firm (35+ years)

### 3.3 Exclusions (Not Target Audience)

- Individuals seeking immediate overseas employment
- Those expecting guaranteed immigration outcomes
- People seeking short-term or temporary U.S. visas
- Licensed nurses seeking professional licensure pathways

---

## 4. Page Content Structure

The landing page consists of 12 sections, each mapped to specific Aceternity UI components and serving a defined role in the conversion journey.

### Section Map

| # | Section | Aceternity UI Components | Journey Stage | Purpose |
|---|---------|--------------------------|---------------|---------|
| 1 | **Sticky Navigation** | Floating Navbar / Resizable Navbar | All stages | Persistent CTA access, section navigation |
| 2 | **Hero Section** | Spotlight + Flip Words + Background Lines | Awareness | Value proposition, emotional hook, primary CTA |
| 3 | **Why Filipino Caregivers** | 3D Card Effect / Card Hover Effect | Interest | 4 benefit cards demonstrating fit |
| 4 | **About EB-3 Program** | Sticky Scroll Reveal / Bento Grid | Education | Educational overview of the visa category |
| 5 | **EB-3 Highlights** | Focus Cards / Feature Sections | Consideration | 4 key differentiators (No IELTS, Real Job, etc.) |
| 6 | **Urgency CTA Banner** | Background Beams + Moving Border Button | Decision | Scarcity messaging ("250 spots left"), conversion push |
| 7 | **Step-by-Step Process** | Timeline | Consideration | 5-step process visualization |
| 8 | **Information Sessions** | Card Stack / Expandable Cards | Action | UAE event details (Dubai & Abu Dhabi) |
| 9 | **About Us** | Tracing Beam + content blocks | Trust | Marjorie Quintos bio, Mercan Group credentials |
| 10 | **Stats Counter** | Animated Stats Sections | Trust | 35+ years, 50K+ cases, 10+ offices |
| 11 | **FAQ Accordion** | Expandable Cards | Objection handling | 9 questions covering eligibility, process, trust |
| 12 | **Final CTA & Footer** | Aurora Background + Hover Border Gradient | Conversion | Last conversion opportunity, footer links |

### Section Details

#### Section 1: Sticky Navigation
- Persistent top bar with logo, section links, and CTA button
- CTA button always visible in nav bar (Moving Border style)
- Smooth scroll to sections on click
- Transparent background that becomes solid on scroll
- Mobile: Hamburger menu with full-screen overlay

#### Section 2: Hero Section
- Large headline with animated Flip Words rotating through key value props: "Your Path to the U.S.", "A Green Card for Your Family", "No IELTS Required"
- Subtitle: "Achieve your American Dream through the EB-3 Green Card Program. A legal, employer-sponsored pathway for Filipino caregivers."
- Background: Spotlight effect with subtle Background Lines
- Primary CTA button: "Start Your Application Today" → external webform
- Hero image: Marjorie Quintos professional photo (client-provided)
- Mercan Group logo placement

#### Section 3: Why Filipino Caregivers
Four 3D hover-effect cards:
1. **High Demand for Caregivers** — U.S. healthcare industry needs, states like Virginia/Maryland/D.C.
2. **No Language Exam Needed** — No IELTS, experience speaks louder than test scores
3. **Stable Future & Citizenship** — Permanent residency pathway, citizenship eligibility
4. **Bring Your Family Along** — Spouse and children under 21 included

Contextual paragraph comparing Canada's increasingly difficult points system with EB-3's simpler approach.

#### Section 4: About EB-3 Program
- Sticky scroll reveal showing EB-3 visa definition and how it works
- Key message: "Employment-based U.S. immigration program that allows you to obtain a Green Card through a job offer from a certified U.S. employer"
- Visual: U.S. flag imagery or related graphics
- Educational, trust-building tone

#### Section 5: EB-3 Highlights
Four Focus Cards:
1. **No IELTS or Point System** — Your success isn't scored by age or language
2. **Real Job & Green Card** — Legitimate U.S. job before you move
3. **All Skill Levels Welcome** — "Other Workers" category for caregivers
4. **Permanent Residency for the Family** — Spouse and kids included

Summary statement: "A direct, family-friendly route to living in the United States, backed by a stable job opportunity."

#### Section 6: Urgency CTA Banner
- Background Beams with collision animation
- Bold headline: "ONLY 250 SPOTS LEFT — ACT FAST"
- Subtext: "Our EB-3 caregiver intake for Filipino applicants is now open. First-come, first-served."
- Three supporting points with icons:
  - Reserve one of the remaining spots
  - First-come, first-served availability
  - Submit the 60-second eligibility form today
- CTA button with Moving Border effect: "Secure Your Spot Now" → external webform

#### Section 7: Step-by-Step Process
Timeline component with 5 steps:
1. **Free Eligibility Review** — Fill out short form (2 minutes), team evaluates profile at no cost
2. **Employer Matching** — Matched with certified U.S. employer in caregiving/healthcare
3. **Labor Certification (PERM)** — Employer files PERM with Department of Labor
4. **Immigrant Petition & Visa Processing** — I-140 filing, U.S. Embassy interview preparation
5. **Green Card & Relocation** — Immigrant visas for family, relocation guidance, new life begins

#### Section 8: Information Sessions
Card Stack or Expandable Cards showing:

**Dubai Sessions:**
- Saturday, February 21, 2026
- Sunday, February 22, 2026

**Abu Dhabi Sessions:**
- Saturday, February 28, 2026
- Sunday, March 1, 2026

**Daily Session Times:**
- Session 1: 3:00 PM – 5:00 PM
- Session 2: 7:00 PM – 9:00 PM

**Details:**
- Facilitator: Marjorie Quintos, Director of Immigration Services — Mercan Group
- Venue: Shared with confirmed attendees only
- Registration: By application only, manual confirmation
- CTA: "Apply to Attend" → external webform

**Disclaimer:** "This session is informational only and does not constitute recruitment, hiring, or job placement. Attendance does not constitute an offer of employment."

#### Section 9: About Us
Tracing Beam layout with two content blocks:

**Marjorie Quintos, RCIC:**
- Licensed Canadian Immigration Consultant
- 20 years of experience
- Filipina immigrant professional who understands the community's hopes
- Personally assists through every EB-3 stage

**Mercan Group of Companies:**
- Global immigration leaders since 1989
- 35+ year track record
- Over 50,000 families helped worldwide
- Offices in Canada, Philippines, UAE, Vietnam, China, and more
- Registered firm in multiple countries

#### Section 10: Stats Counter
Three animated counters:
- **35+** Years in Business
- **50K+** Immigration Cases
- **10+** Offices and Representatives Worldwide

Counters animate on scroll into viewport using number increment animation.

#### Section 11: FAQ Accordion
Expandable Cards with 9 questions:

1. **What is the EB-3 Visa?** — Employment-based immigrant program, direct route to Green Card via job offer
2. **Who can apply for EB-3?** — Three categories: Skilled Workers, Professionals, Other Workers (caregivers)
3. **Do I need to take the IELTS or any English test?** — No language exam required
4. **Can my spouse and children come with me?** — Yes, spouse and children under 21 included
5. **Do I need a U.S. employer before applying?** — No, Mercan matches you with pre-vetted employer
6. **How long does the EB-3 process take?** — Approximately 2–3 years start to finish
7. **What kind of U.S. jobs are available?** — Caregivers, nursing aides, hotel staff, food service, etc.
8. **Is there an age limit?** — No upper age limit
9. **Why should I trust Mercan Group and Marjorie Quintos?** — 35+ years, 50K+ families, RCIC-licensed

Only one FAQ item open at a time (accordion behavior).

#### Section 12: Final CTA & Footer
- Aurora Background effect creating an immersive closing section
- Headline: "EB-3 U.S. Green Card — 250 SPOTS LEFT"
- Subtext: "Secure a legitimate, employer-sponsored caregiver role and move with your spouse and children."
- Final CTA button with Hover Border Gradient: "Start Your Application" → external webform
- Footer: Copyright, social links, regulatory disclaimers

---

## 5. CTA Strategy

### 5.1 Core Principle

All CTAs serve a single purpose: direct the visitor to the external Officio webform. There are no internal forms, email capture, newsletter signups, or any other data collection within the application.

**External Webform URL:**
```
https://secure.officio.ca/qnr?id=5537&hash=55ff3db3104048310e876b347ec3a741
```

### 5.2 CTA Placement

| Location | CTA Text | Style | Trigger |
|----------|----------|-------|---------|
| **Navigation Bar** | "Apply Now" | Moving Border button, compact | Always visible (sticky) |
| **Hero Section** | "Start Your Application Today" | Large primary button with glow effect | Immediate on page load |
| **Urgency Banner** | "Secure Your Spot Now" | Moving Border button, high-contrast | After education sections |
| **Information Sessions** | "Apply to Attend" | Card-integrated button | Event-triggered interest |
| **Final CTA** | "Start Your Application" | Hover Border Gradient, full-width | End-of-page conversion |

### 5.3 CTA Behavior

- All CTA buttons open the external webform in a **new tab** (`target="_blank"`)
- All links include `rel="noopener noreferrer"` for security
- Analytics events (GA4 + Facebook Pixel) fire **before** the redirect
- UTM parameters from the current page URL are **appended** to the external webform URL
- CTA buttons have hover animations and visual feedback for interactivity

### 5.4 UTM Parameter Handling

```
User arrives at: marjoriequintos.com/usa-eb3-caregivers/?utm_source=facebook&utm_campaign=dubai_feb
↓
CTA click redirects to: secure.officio.ca/qnr?id=5537&hash=...&utm_source=facebook&utm_campaign=dubai_feb
```

This enables conversion attribution across the external webform.

---

## 6. Aceternity UI Component Specifications

### 6.1 Background & Effects

| Component | Section(s) | Purpose |
|-----------|------------|---------|
| **Background Lines** | Hero | Subtle animated lines behind hero content |
| **Spotlight** | Hero | Dramatic light effect highlighting the value proposition |
| **Background Beams with Collision** | Urgency CTA | Energetic beam animations creating urgency |
| **Aurora Background** | Final CTA | Immersive gradient effect for closing conversion section |
| **Sparkles** | Stats Counter | Subtle particle effects enhancing animated numbers |

### 6.2 Content & Cards

| Component | Section(s) | Purpose |
|-----------|------------|---------|
| **3D Card Effect** | Why Caregivers | Four benefit cards with depth on hover |
| **Focus Cards** | EB-3 Highlights | Four feature highlight cards with spotlight focus |
| **Expandable Cards** | FAQ | Accordion-style cards for 9 FAQ items |
| **Card Stack** | Info Sessions | Stacked event cards for Dubai/Abu Dhabi sessions |

### 6.3 Navigation

| Component | Section(s) | Purpose |
|-----------|------------|---------|
| **Floating Navbar** | Header | Persistent navigation with transparency/solid transition |
| **Moving Border** | Nav CTA, Urgency CTA | Animated border effect on CTA buttons |
| **Hover Border Gradient** | Final CTA | Gradient border animation on hover for closing CTA |

### 6.4 Text & Animation

| Component | Section(s) | Purpose |
|-----------|------------|---------|
| **Flip Words** | Hero | Rotating headline words for dynamic value proposition |
| **Text Generate Effect** | Section headings | Text appearing word-by-word on scroll |
| **Colourful Text** | Emphasis text | Gradient-colored emphasis on key phrases |

### 6.5 Scroll & Layout

| Component | Section(s) | Purpose |
|-----------|------------|---------|
| **Timeline** | Step-by-Step Process | 5-step vertical timeline with scroll animation |
| **Sticky Scroll Reveal** | About EB-3 | Content progressively revealed as user scrolls |
| **Tracing Beam** | About Us | Vertical beam connecting Marjorie bio to Mercan info |

### 6.6 Brand Palette for Component Customization

| Color | Hex | Usage |
|-------|-----|-------|
| Navy Blue | `#1A3A5C` | Primary backgrounds, headings, navbar |
| Gold | `#C9A961` | CTA buttons, accents, highlights, borders |
| White | `#FFFFFF` | Body text on dark backgrounds, card backgrounds |
| Light Gray | `#F5F5F5` | Alternate section backgrounds |
| Dark Text | `#1A1A1A` | Body text on light backgrounds |

---

## 7. User Flows

### 7.1 Primary Flow (Scroll-to-Convert)

```
Landing → Hero (value prop) → Scroll through benefits → Education sections → CTA click → External webform (new tab)
```

Expected path for 60%+ of converting visitors. User scrolls naturally through the narrative and clicks CTA at urgency banner or final section.

### 7.2 Secondary Flow (Research-then-Convert)

```
Landing → Jump to FAQ → Read program details → About Us (trust) → Scroll to final CTA → External webform (new tab)
```

For skeptical or detail-oriented visitors who want to understand the program and verify credentials before committing.

### 7.3 Event Flow (Information Session)

```
Landing → Info Sessions section → Review dates/times → "Apply to Attend" CTA → External webform (new tab)
```

For visitors specifically interested in attending the UAE information sessions.

### 7.4 Quick-Convert Flow

```
Landing → Hero CTA or Nav CTA → External webform (new tab)
```

For returning visitors or those arriving with high intent from targeted ads.

---

## 8. Content Requirements

### 8.1 Content Sources

| Source | Content | Status |
|--------|---------|--------|
| **Existing Website** | EB-3 program details, FAQ answers, About Us, process steps, highlights | Available (marjoriequintos.com/usa-eb3-caregivers/) |
| **Landing_Page_Content.docx** | Information session details, event schedule, registration info, disclaimer | Uploaded |
| **Client Assets (needed)** | Marjorie Quintos professional photo, Mercan Group logo (high-res), U.S. flag imagery | Pending from client |

### 8.2 Information Session Content (from uploaded document)

**Introduction:**
For many overseas Filipino workers, the American Dream represents long-term stability, opportunity, and a future for their families. This information session is designed for individuals who want to understand how employment-based U.S. immigration works and whether it may be a suitable option as part of their long-term plans.

**Session Focus:**
The session focuses on the EB-3 immigrant visa category, a permanent residence pathway connected to employment needs in essential support and caregiving roles. The discussion is educational, realistic, and grounded in how the process works in practice.

**What Attendees Will Learn:**
- What the EB-3 immigrant visa is and who it is meant for
- How employment-based immigration leads to U.S. permanent residence
- The role of employers in the EB-3 process
- Typical timelines, stages, and commitments involved
- How families may be included in permanent residence applications
- Common myths, misinformation, and scams to avoid
- General financial responsibilities associated with employment-based immigration

**Event Facilitator:**
Marjorie Quintos, Director of Immigration Services — Mercan Group, together with the Mercan Immigration Team, bringing decades of experience in employment-based immigration and permanent residence pathways.

**Event Schedule:**

| City | Dates |
|------|-------|
| Dubai | Saturday, February 21, 2026 & Sunday, February 22, 2026 |
| Abu Dhabi | Saturday, February 28, 2026 & Sunday, March 1, 2026 |

| Session | Time |
|---------|------|
| Session 1 | 3:00 PM – 5:00 PM |
| Session 2 | 7:00 PM – 9:00 PM |

**Registration:**
- Attendance is by application only
- Submitting an application helps confirm whether this session is relevant to the applicant
- Does not guarantee attendance
- Selected applicants will receive manual confirmation
- Venue details shared with confirmed attendees only

**Required Disclaimer:**
"This session is informational only and does not constitute recruitment, hiring, or job placement. Attendance does not constitute an offer of employment."

### 8.3 Tone & Voice Guidelines

- **Professional but warm** — Authoritative immigration expertise with genuine care
- **Empathetic** — Understand the hopes, fears, and frustrations of OFWs
- **Clear and simple** — Avoid legal jargon; explain terms when necessary
- **Culturally resonant** — Speak to Filipino values (family, hard work, bayanihan)
- **Honest** — Realistic timelines (2–3 years), no guaranteed outcomes
- **Action-oriented** — Every section moves toward the CTA

---

## 9. Non-Functional Requirements

### 9.1 Performance

| Metric | Target | Standard |
|--------|--------|----------|
| Largest Contentful Paint (LCP) | <2.5 seconds | Core Web Vitals "Good" |
| First Input Delay (FID) | <100 milliseconds | Core Web Vitals "Good" |
| Cumulative Layout Shift (CLS) | <0.1 | Core Web Vitals "Good" |
| Lighthouse Performance Score | ≥90 | Google Lighthouse |
| Time to Interactive (TTI) | <3.5 seconds | Lighthouse metric |

### 9.2 Accessibility

- WCAG 2.1 Level AA compliance
- Semantic HTML throughout (header, nav, main, section, article, footer)
- Full keyboard navigation support
- Screen reader compatibility with ARIA labels
- `prefers-reduced-motion` media query support — all Aceternity animations disabled or simplified
- Sufficient color contrast ratios (minimum 4.5:1 for body text)
- Focus indicators on all interactive elements

### 9.3 Responsiveness

| Breakpoint | Target Device | Priority |
|------------|---------------|----------|
| 320px | Small mobile (iPhone SE) | High |
| 375px | Standard mobile (iPhone) | Critical |
| 768px | Tablet (iPad) | High |
| 1024px | Small desktop / landscape tablet | Medium |
| 1440px | Standard desktop | High |

Mobile-first design approach. Touch-optimized interactions. 3D card effects gracefully degrade on touch devices.

### 9.4 SEO

- Server-Side Rendering (SSR) via Next.js for all critical content
- Static Site Generation (SSG) where applicable for instant loads
- Structured data (JSON-LD) for Organization, Event, and FAQPage schemas
- Open Graph and Twitter Card meta tags for social sharing
- Semantic heading hierarchy (single H1, logical H2/H3 structure)
- Image alt text for all visual elements
- Canonical URL configuration
- XML sitemap generation

### 9.5 Analytics

**Google Analytics 4 (GA4):**
- Page load tracking with UTM parameter capture
- Custom event tracking for CTA clicks (button location, text, variant)
- Section view tracking via Intersection Observer
- FAQ interaction tracking (which questions are expanded)
- Scroll depth tracking

**Facebook Pixel (ID: 1540153117181945):**
- PageView on load
- Lead event on CTA click
- ViewContent for section views
- Custom events matching GA4 taxonomy

---

## 10. Technology Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend Framework** | Next.js (App Router) | 14+ |
| **UI Library** | React | 18+ |
| **UI Components** | Aceternity UI | Latest |
| **Styling** | Tailwind CSS | 3+ |
| **Animations** | Framer Motion | 11+ |
| **Language** | TypeScript | 5+ |
| **Backend Framework** | NestJS | 10+ |
| **ORM** | Prisma | 5+ |
| **Database** | PostgreSQL | 15+ |
| **Containerization** | Docker + Docker Compose | Latest |
| **Deployment** | Dokploy (self-hosted) | Latest |
| **Analytics** | GA4 + Facebook Pixel | — |

---

## 11. Constraints & Assumptions

### 11.1 Constraints

- **No internal forms or data collection** — All lead capture occurs via the external Officio webform
- **All CTAs open external webform in new tab** — No in-page modals, popups, or inline forms
- **Regulatory disclaimers required** — Information session disclaimer must be prominently displayed
- **Event details must be easily updatable** — Dates, times, and venues change per intake cycle
- **Facebook Pixel ID is fixed** — 1540153117181945
- **External webform URL is fixed** — Cannot be modified by this project

### 11.2 Assumptions

- Client will provide high-resolution imagery (Marjorie photo, Mercan logo, U.S. flag assets)
- The external Officio webform at secure.officio.ca remains accessible and functional
- GA4 and Facebook Pixel accounts are already configured and accessible
- Dokploy infrastructure on the Mercan server is available for deployment
- Domain DNS (marjoriequintos.com) can be pointed to the new deployment
- Content from the existing website is approved for reuse in the redesign

---

## 12. Project Deliverables

| # | Deliverable | BMAD Layer | Description |
|---|-------------|-----------|-------------|
| 1 | **PRD Document** | Business + Manager | This document — goals, audience, content structure, requirements |
| 2 | **Architecture Document** | Architect | System design, API contracts, database schema, deployment config |
| 3 | **Frontend Application** | Developer | React/Next.js + Aceternity UI implementation |
| 4 | **Backend API** | Developer | NestJS REST API with Prisma/PostgreSQL |
| 5 | **Deployment Configuration** | Developer | Docker Compose + Dokploy configuration |
| 6 | **QA & Testing** | Developer | Cross-device testing, Lighthouse audit, analytics verification |

---

*End of PRD — EB-3 Caregivers Landing Page*
*Next: Architecture Document (Architect Layer)*
