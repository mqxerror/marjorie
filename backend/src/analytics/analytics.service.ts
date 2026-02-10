import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

interface AnalyticsEventData {
  eventType: string;
  label: string;
  metadata?: Record<string, unknown>;
  sessionId?: string;
}

@Injectable()
export class AnalyticsService implements OnModuleDestroy {
  private readonly logger = new Logger(AnalyticsService.name);
  private eventBuffer: AnalyticsEventData[] = [];
  private readonly BATCH_SIZE = 50;
  private readonly MAX_BUFFER_SIZE = 10000;
  private readonly FLUSH_INTERVAL = 5000;
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(private prisma: PrismaService) {
    this.startFlushTimer();
  }

  private startFlushTimer() {
    this.flushTimer = setInterval(() => {
      this.flush().catch((err) => {
        this.logger.error('Flush timer error', err);
      });
    }, this.FLUSH_INTERVAL);
  }

  async trackEvent(data: AnalyticsEventData) {
    if (this.eventBuffer.length >= this.MAX_BUFFER_SIZE) {
      this.logger.warn('Event buffer full, dropping event');
      return { success: false, reason: 'buffer_full' };
    }

    this.eventBuffer.push(data);

    if (this.eventBuffer.length >= this.BATCH_SIZE) {
      await this.flush();
    }

    return { success: true };
  }

  async trackBatch(events: AnalyticsEventData[]) {
    const available = this.MAX_BUFFER_SIZE - this.eventBuffer.length;
    const toAdd = events.slice(0, available);
    this.eventBuffer.push(...toAdd);

    if (this.eventBuffer.length >= this.BATCH_SIZE) {
      await this.flush();
    }

    return { success: true, count: toAdd.length, dropped: events.length - toAdd.length };
  }

  private async flush() {
    if (this.eventBuffer.length === 0) return;

    const eventsToFlush = [...this.eventBuffer];
    this.eventBuffer = [];

    try {
      await this.prisma.analyticsEvent.createMany({
        data: eventsToFlush.map((event) => ({
          eventType: event.eventType,
          label: event.label,
          metadata: event.metadata as Prisma.InputJsonValue,
          sessionId: event.sessionId,
        })),
      });
    } catch (error) {
      // Re-add events but cap at max buffer size
      const reAdd = eventsToFlush.slice(0, this.MAX_BUFFER_SIZE - this.eventBuffer.length);
      this.eventBuffer.unshift(...reAdd);
      this.logger.error(`Flush failed, ${reAdd.length} events re-buffered`, error);
    }
  }

  async getEvents(options?: {
    eventType?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }) {
    const where: Prisma.AnalyticsEventWhereInput = {};

    if (options?.eventType) {
      where.eventType = options.eventType;
    }

    if (options?.startDate || options?.endDate) {
      where.createdAt = {};
      if (options.startDate && !isNaN(options.startDate.getTime())) {
        where.createdAt.gte = options.startDate;
      }
      if (options.endDate && !isNaN(options.endDate.getTime())) {
        where.createdAt.lte = options.endDate;
      }
    }

    const limit = Math.min(Math.max(options?.limit || 100, 1), 1000);

    return this.prisma.analyticsEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getEventCounts(eventType?: string) {
    const where = eventType ? { eventType } : {};

    const counts = await this.prisma.analyticsEvent.groupBy({
      by: ['eventType'],
      where,
      _count: { id: true },
    });

    return counts.map((item) => ({
      eventType: item.eventType,
      count: item._count.id,
    }));
  }

  async getCTAMetrics(startDate?: Date, endDate?: Date) {
    const where: Prisma.AnalyticsEventWhereInput = {
      eventType: 'cta_click',
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate && !isNaN(startDate.getTime())) where.createdAt.gte = startDate;
      if (endDate && !isNaN(endDate.getTime())) where.createdAt.lte = endDate;
    }

    const clicks = await this.prisma.analyticsEvent.groupBy({
      by: ['label'],
      where,
      _count: { id: true },
    });

    return clicks.map((item) => ({
      position: item.label,
      clicks: item._count.id,
    }));
  }

  async onModuleDestroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    // Attempt final flush on shutdown
    try {
      await this.flush();
    } catch (error) {
      this.logger.error('Final flush on shutdown failed', error);
    }
  }
}
