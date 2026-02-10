import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed Site Configuration
  const configs = [
    { key: 'spots_remaining', value: 250 },
    { key: 'cta_url', value: 'https://secure.officio.ca/apply/mercan-eb3' },
    { key: 'analytics_enabled', value: true },
    { key: 'maintenance_mode', value: false },
  ];

  for (const config of configs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: { key: config.key, value: config.value },
    });
    console.log(`  Created config: ${config.key}`);
  }

  // Seed Event Sessions
  const events = [
    {
      city: 'Dubai',
      dates: ['May 24', 'May 25'],
      sessionTimes: ['10:00 AM', '2:00 PM', '5:00 PM'],
      facilitator: 'Marjorie Quintos, RCIC',
      registrationUrl: 'https://secure.officio.ca/apply/mercan-eb3?event=dubai',
      disclaimer: 'By signing up, you agree to receive communications about EB-3 opportunities.',
      isActive: true,
      sortOrder: 0,
    },
    {
      city: 'Abu Dhabi',
      dates: ['May 31', 'June 1'],
      sessionTimes: ['10:00 AM', '2:00 PM', '5:00 PM'],
      facilitator: 'Marjorie Quintos, RCIC',
      registrationUrl: 'https://secure.officio.ca/apply/mercan-eb3?event=abudhabi',
      disclaimer: 'By signing up, you agree to receive communications about EB-3 opportunities.',
      isActive: true,
      sortOrder: 1,
    },
  ];

  for (const event of events) {
    await prisma.eventSession.create({
      data: event,
    });
    console.log(`  Created event: ${event.city}`);
  }

  // Seed Section Content
  const sections = [
    {
      sectionKey: 'hero',
      title: 'Your American Dream Starts Here',
      subtitle: 'EB-3 Green Card Program for Filipino Caregivers',
      body: 'Join 50,000+ families who have achieved their immigration goals with Mercan Group.',
      ctaText: 'Start Your Application',
      ctaUrl: 'https://secure.officio.ca/apply/mercan-eb3',
      isActive: true,
      sortOrder: 0,
    },
    {
      sectionKey: 'why-caregivers',
      title: 'Why Caregivers Are in High Demand',
      subtitle: 'The U.S. healthcare system needs you',
      body: 'America faces a critical shortage of caregivers. Your skills are valued and needed.',
      items: [
        { title: 'Green Card for Your Family', description: 'Bring your spouse and children under 21' },
        { title: 'No IELTS Required', description: 'Unlike Canada, no English test needed' },
        { title: 'Clear Path to Citizenship', description: 'Green Card leads to U.S. citizenship' },
        { title: 'High Demand Profession', description: 'Healthcare workers are always needed' },
      ],
      isActive: true,
      sortOrder: 1,
    },
    {
      sectionKey: 'about-eb3',
      title: 'What is the EB-3 Visa?',
      subtitle: 'Employment-Based Third Preference',
      body: 'The EB-3 visa is a U.S. employment-based immigrant visa that provides a direct path to permanent residency through employer sponsorship.',
      isActive: true,
      sortOrder: 2,
    },
    {
      sectionKey: 'urgency-cta',
      title: 'Limited Spots Available',
      subtitle: '250 SPOTS LEFT',
      body: 'Our U.S. employer partners have limited positions available for 2025. Secure your spot before they fill up.',
      ctaText: 'Reserve Your Spot Now',
      isActive: true,
      sortOrder: 3,
    },
    {
      sectionKey: 'final-cta',
      title: 'EB-3 U.S. Green Card',
      subtitle: '250 SPOTS LEFT',
      body: 'Secure a legitimate, employer-sponsored caregiver role and move to the United States with your spouse and children.',
      ctaText: 'Start Your Application',
      isActive: true,
      sortOrder: 10,
    },
  ];

  for (const section of sections) {
    await prisma.sectionContent.upsert({
      where: { sectionKey: section.sectionKey },
      update: section,
      create: section,
    });
    console.log(`  Created section: ${section.sectionKey}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
