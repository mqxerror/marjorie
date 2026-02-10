-- CreateTable
CREATE TABLE "SectionContent" (
    "id" TEXT NOT NULL,
    "sectionKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "body" TEXT,
    "items" JSONB,
    "ctaText" TEXT,
    "ctaUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SectionContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSession" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "dates" JSONB NOT NULL,
    "sessionTimes" JSONB NOT NULL,
    "facilitator" TEXT NOT NULL,
    "registrationUrl" TEXT NOT NULL,
    "disclaimer" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "metadata" JSONB,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventApplication" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "currentCity" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "uaeResident" BOOLEAN NOT NULL,
    "caregivingExperience" JSONB NOT NULL,
    "willingToWork" BOOLEAN NOT NULL,
    "willingToDrive" BOOLEAN NOT NULL,
    "acceptsTimeframe" BOOLEAN NOT NULL,
    "seeksPermanentRelocation" BOOLEAN NOT NULL,
    "understandsInfoOnly" BOOLEAN NOT NULL,
    "acceptsFinancialCosts" BOOLEAN NOT NULL,
    "attendanceMode" TEXT NOT NULL,
    "selectedSession" TEXT NOT NULL,
    "acknowledgedAccuracy" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL,
    "tags" JSONB NOT NULL,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,

    CONSTRAINT "EventApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SectionContent_sectionKey_key" ON "SectionContent"("sectionKey");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_eventType_idx" ON "AnalyticsEvent"("eventType");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_sessionId_idx" ON "AnalyticsEvent"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "SiteConfig_key_key" ON "SiteConfig"("key");

-- CreateIndex
CREATE UNIQUE INDEX "EventApplication_email_key" ON "EventApplication"("email");

-- CreateIndex
CREATE INDEX "EventApplication_status_idx" ON "EventApplication"("status");

-- CreateIndex
CREATE INDEX "EventApplication_createdAt_idx" ON "EventApplication"("createdAt");

-- CreateIndex
CREATE INDEX "EventApplication_email_idx" ON "EventApplication"("email");
