-- AlterTable
ALTER TABLE "EventApplication" ADD COLUMN     "eventSessionId" TEXT;

-- AlterTable
ALTER TABLE "EventSession" ADD COLUMN     "capacity" INTEGER;

-- CreateIndex
CREATE INDEX "EventApplication_eventSessionId_idx" ON "EventApplication"("eventSessionId");

-- AddForeignKey
ALTER TABLE "EventApplication" ADD CONSTRAINT "EventApplication_eventSessionId_fkey" FOREIGN KEY ("eventSessionId") REFERENCES "EventSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
