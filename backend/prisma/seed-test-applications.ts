/**
 * Seed script: creates test EventApplication records covering every status.
 *
 * Usage:  npx ts-node prisma/seed-test-applications.ts
 *   or:   npm run seed:test
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ── Qualification logic (mirrors ApplicationsService.create) ──────────
function computeTagsAndStatus(app: {
  nationality: string;
  uaeResident: boolean;
  willingToWork: boolean;
  willingToDrive: boolean;
  acceptsTimeframe: boolean;
  acceptsFinancialCosts: boolean;
  attendanceMode: string;
}) {
  const tags: string[] = [];

  if (app.nationality.toLowerCase() !== 'filipino') tags.push('Not Suitable – Criteria');
  if (!app.uaeResident) tags.push('Not Suitable – Criteria');
  if (!app.willingToWork) tags.push('Not Suitable – Criteria');
  if (!app.willingToDrive) tags.push('Not Suitable – Driving Requirement');
  if (!app.acceptsTimeframe) tags.push('Not Suitable – Expectations');
  if (!app.acceptsFinancialCosts) tags.push('Not Suitable – Financial Expectations');

  tags.push(app.attendanceMode === 'IN_PERSON' ? 'Attendance – In Person' : 'Attendance – Online');

  const qualificationTags = Array.from(new Set(tags.filter((t) => t.startsWith('Not Suitable'))));
  const allTags = Array.from(new Set(tags));
  const status = qualificationTags.length === 0 ? 'Qualified – Invite' : qualificationTags[0];

  return { status, tags: allTags };
}

// ── Test profiles ─────────────────────────────────────────────────────

const sessions = {
  dubaiInPerson: 'Saturday, February 21, 2026 | 3:00 PM – 5:00 PM | Dubai (In-Person)',
  dubaiInPerson2: 'Sunday, February 22, 2026 | 7:00 PM – 9:00 PM | Dubai (In-Person)',
  abuDhabiInPerson: 'Saturday, February 28, 2026 | 3:00 PM – 5:00 PM | Abu Dhabi (In-Person)',
  online: 'Saturday, February 21, 2026 | 3:00 PM – 5:00 PM | Online',
  online2: 'Sunday, March 1, 2026 | 7:00 PM – 9:00 PM | Online',
};

interface TestProfile {
  fullName: string;
  mobileNumber: string;
  email: string;
  currentCity: string;
  nationality: string;
  uaeResident: boolean;
  caregivingExperience: string[];
  willingToWork: boolean;
  willingToDrive: boolean;
  acceptsTimeframe: boolean;
  seeksPermanentRelocation: boolean;
  understandsInfoOnly: boolean;
  acceptsFinancialCosts: boolean;
  attendanceMode: string;
  selectedSession: string;
  acknowledgedAccuracy: boolean;
  // Optional overrides (for manual statuses like Waitlist)
  statusOverride?: string;
  reviewNotes?: string;
  reviewed?: boolean;
}

const profiles: TestProfile[] = [
  // ── 1. Qualified – Invite (all pass, in-person Dubai) ──
  {
    fullName: 'Maria Santos',
    mobileNumber: '+971501234001',
    email: 'maria.santos.test@example.com',
    currentCity: 'Dubai',
    nationality: 'Filipino',
    uaeResident: true,
    caregivingExperience: ['Home health care', 'Caregiving / elderly care'],
    willingToWork: true,
    willingToDrive: true,
    acceptsTimeframe: true,
    seeksPermanentRelocation: true,
    understandsInfoOnly: true,
    acceptsFinancialCosts: true,
    attendanceMode: 'IN_PERSON',
    selectedSession: sessions.dubaiInPerson,
    acknowledgedAccuracy: true,
  },
  // ── 2. Qualified – Invite (all pass, online) ──
  {
    fullName: 'Ana Reyes',
    mobileNumber: '+971501234002',
    email: 'ana.reyes.test@example.com',
    currentCity: 'Sharjah',
    nationality: 'Filipino',
    uaeResident: true,
    caregivingExperience: ['Domestic support with caregiving duties'],
    willingToWork: true,
    willingToDrive: true,
    acceptsTimeframe: true,
    seeksPermanentRelocation: true,
    understandsInfoOnly: true,
    acceptsFinancialCosts: true,
    attendanceMode: 'ONLINE',
    selectedSession: sessions.online,
    acknowledgedAccuracy: true,
  },
  // ── 3. Qualified – Invite (all pass, Abu Dhabi in-person) ──
  {
    fullName: 'Rosa Dela Cruz',
    mobileNumber: '+971501234003',
    email: 'rosa.delacruz.test@example.com',
    currentCity: 'Abu Dhabi',
    nationality: 'Filipino',
    uaeResident: true,
    caregivingExperience: ['Caregiving / elderly care'],
    willingToWork: true,
    willingToDrive: true,
    acceptsTimeframe: true,
    seeksPermanentRelocation: false,
    understandsInfoOnly: true,
    acceptsFinancialCosts: true,
    attendanceMode: 'IN_PERSON',
    selectedSession: sessions.abuDhabiInPerson,
    acknowledgedAccuracy: true,
  },
  // ── 4. Not Suitable – Criteria (nationality = Other) ──
  {
    fullName: 'Priya Sharma',
    mobileNumber: '+971501234004',
    email: 'priya.sharma.test@example.com',
    currentCity: 'Dubai',
    nationality: 'Indian',
    uaeResident: true,
    caregivingExperience: ['Home health care'],
    willingToWork: true,
    willingToDrive: true,
    acceptsTimeframe: true,
    seeksPermanentRelocation: true,
    understandsInfoOnly: true,
    acceptsFinancialCosts: true,
    attendanceMode: 'ONLINE',
    selectedSession: sessions.online,
    acknowledgedAccuracy: true,
  },
  // ── 5. Not Suitable – Criteria (not UAE resident) ──
  {
    fullName: 'Grace Manalo',
    mobileNumber: '+971501234005',
    email: 'grace.manalo.test@example.com',
    currentCity: 'Dubai',
    nationality: 'Filipino',
    uaeResident: false,
    caregivingExperience: ['Caregiving / elderly care'],
    willingToWork: true,
    willingToDrive: true,
    acceptsTimeframe: true,
    seeksPermanentRelocation: true,
    understandsInfoOnly: true,
    acceptsFinancialCosts: true,
    attendanceMode: 'ONLINE',
    selectedSession: sessions.online2,
    acknowledgedAccuracy: true,
  },
  // ── 6. Not Suitable – Criteria (not willing to work) ──
  {
    fullName: 'Joy Bautista',
    mobileNumber: '+971501234006',
    email: 'joy.bautista.test@example.com',
    currentCity: 'Sharjah',
    nationality: 'Filipino',
    uaeResident: true,
    caregivingExperience: ['No prior caregiving experience, but willing and able to perform caregiving or support roles'],
    willingToWork: false,
    willingToDrive: true,
    acceptsTimeframe: true,
    seeksPermanentRelocation: true,
    understandsInfoOnly: true,
    acceptsFinancialCosts: true,
    attendanceMode: 'IN_PERSON',
    selectedSession: sessions.dubaiInPerson2,
    acknowledgedAccuracy: true,
  },
  // ── 7. Not Suitable – Driving Requirement ──
  {
    fullName: 'Cherry Villanueva',
    mobileNumber: '+971501234007',
    email: 'cherry.villanueva.test@example.com',
    currentCity: 'Dubai',
    nationality: 'Filipino',
    uaeResident: true,
    caregivingExperience: ['Home health care', 'Caregiving / elderly care'],
    willingToWork: true,
    willingToDrive: false,
    acceptsTimeframe: true,
    seeksPermanentRelocation: true,
    understandsInfoOnly: true,
    acceptsFinancialCosts: true,
    attendanceMode: 'IN_PERSON',
    selectedSession: sessions.dubaiInPerson,
    acknowledgedAccuracy: true,
  },
  // ── 8. Not Suitable – Expectations (timeline not accepted) ──
  {
    fullName: 'Liza Fernandez',
    mobileNumber: '+971501234008',
    email: 'liza.fernandez.test@example.com',
    currentCity: 'Abu Dhabi',
    nationality: 'Filipino',
    uaeResident: true,
    caregivingExperience: ['Domestic support with caregiving duties'],
    willingToWork: true,
    willingToDrive: true,
    acceptsTimeframe: false,
    seeksPermanentRelocation: true,
    understandsInfoOnly: true,
    acceptsFinancialCosts: true,
    attendanceMode: 'ONLINE',
    selectedSession: sessions.online,
    acknowledgedAccuracy: true,
  },
  // ── 9. Not Suitable – Financial Expectations ──
  {
    fullName: 'Jasmine Aquino',
    mobileNumber: '+971501234009',
    email: 'jasmine.aquino.test@example.com',
    currentCity: 'Dubai',
    nationality: 'Filipino',
    uaeResident: true,
    caregivingExperience: ['Caregiving / elderly care'],
    willingToWork: true,
    willingToDrive: true,
    acceptsTimeframe: true,
    seeksPermanentRelocation: true,
    understandsInfoOnly: true,
    acceptsFinancialCosts: false,
    attendanceMode: 'IN_PERSON',
    selectedSession: sessions.abuDhabiInPerson,
    acknowledgedAccuracy: true,
  },
  // ── 10. Multiple failures (nationality + driving + financial) ──
  {
    fullName: 'Fatima Hassan',
    mobileNumber: '+971501234010',
    email: 'fatima.hassan.test@example.com',
    currentCity: 'Sharjah',
    nationality: 'Egyptian',
    uaeResident: true,
    caregivingExperience: ['No prior caregiving experience, but willing and able to perform caregiving or support roles'],
    willingToWork: true,
    willingToDrive: false,
    acceptsTimeframe: true,
    seeksPermanentRelocation: false,
    understandsInfoOnly: true,
    acceptsFinancialCosts: false,
    attendanceMode: 'ONLINE',
    selectedSession: sessions.online2,
    acknowledgedAccuracy: true,
  },
  // ── 11. Qualified – Waitlist (manual override) ──
  {
    fullName: 'Lorna Ocampo',
    mobileNumber: '+971501234011',
    email: 'lorna.ocampo.test@example.com',
    currentCity: 'Dubai',
    nationality: 'Filipino',
    uaeResident: true,
    caregivingExperience: ['Home health care'],
    willingToWork: true,
    willingToDrive: true,
    acceptsTimeframe: true,
    seeksPermanentRelocation: true,
    understandsInfoOnly: true,
    acceptsFinancialCosts: true,
    attendanceMode: 'IN_PERSON',
    selectedSession: sessions.dubaiInPerson2,
    acknowledgedAccuracy: true,
    statusOverride: 'Qualified – Waitlist',
    reviewNotes: 'Session full — moved to waitlist.',
    reviewed: true,
  },
  // ── 12. Qualified – Invite, reviewed with notes ──
  {
    fullName: 'Elena Garcia',
    mobileNumber: '+971501234012',
    email: 'elena.garcia.test@example.com',
    currentCity: 'Abu Dhabi',
    nationality: 'Filipino',
    uaeResident: true,
    caregivingExperience: ['Home health care', 'Caregiving / elderly care', 'Domestic support with caregiving duties'],
    willingToWork: true,
    willingToDrive: true,
    acceptsTimeframe: true,
    seeksPermanentRelocation: true,
    understandsInfoOnly: true,
    acceptsFinancialCosts: true,
    attendanceMode: 'IN_PERSON',
    selectedSession: sessions.abuDhabiInPerson,
    acknowledgedAccuracy: true,
    reviewNotes: 'Strong candidate — extensive experience. Priority invite.',
    reviewed: true,
  },
];

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  console.log(`Seeding ${profiles.length} test applications...\n`);

  for (const p of profiles) {
    const { status: computedStatus, tags } = computeTagsAndStatus(p);
    const finalStatus = p.statusOverride ?? computedStatus;

    // Skip if email already exists
    const existing = await prisma.eventApplication.findUnique({
      where: { email: p.email },
      select: { id: true },
    });
    if (existing) {
      console.log(`  SKIP  ${p.fullName} (${p.email}) — already exists`);
      continue;
    }

    await prisma.eventApplication.create({
      data: {
        fullName: p.fullName,
        mobileNumber: p.mobileNumber,
        email: p.email,
        currentCity: p.currentCity,
        nationality: p.nationality,
        uaeResident: p.uaeResident,
        caregivingExperience: p.caregivingExperience,
        willingToWork: p.willingToWork,
        willingToDrive: p.willingToDrive,
        acceptsTimeframe: p.acceptsTimeframe,
        seeksPermanentRelocation: p.seeksPermanentRelocation,
        understandsInfoOnly: p.understandsInfoOnly,
        acceptsFinancialCosts: p.acceptsFinancialCosts,
        attendanceMode: p.attendanceMode,
        selectedSession: p.selectedSession,
        acknowledgedAccuracy: p.acknowledgedAccuracy,
        status: finalStatus,
        tags,
        ...(p.reviewed && { reviewedAt: new Date() }),
        ...(p.reviewNotes && { reviewNotes: p.reviewNotes }),
      },
    });

    const tagSummary = tags.filter((t) => t.startsWith('Not Suitable')).join(', ') || '(none)';
    console.log(`  OK    ${p.fullName.padEnd(22)} → ${finalStatus}`);
    console.log(`        Tags: ${tagSummary}`);
  }

  console.log('\nDone!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
