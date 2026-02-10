import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { WebhookService } from '../webhook/webhook.service';
import { CreateApplicationDto } from './applications.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private webhookService: WebhookService,
  ) {}

  async create(dto: CreateApplicationDto) {
    const tags: string[] = [];

    if (dto.nationality.toLowerCase() !== 'filipino') {
      tags.push('Not Suitable – Criteria');
    }
    if (!dto.uaeResident) {
      tags.push('Not Suitable – Criteria');
    }
    if (!dto.willingToWork) {
      tags.push('Not Suitable – Criteria');
    }
    if (!dto.willingToDrive) {
      tags.push('Not Suitable – Driving Requirement');
    }
    if (!dto.acceptsTimeframe) {
      tags.push('Not Suitable – Expectations');
    }
    if (!dto.acceptsFinancialCosts) {
      tags.push('Not Suitable – Financial Expectations');
    }

    // Attendance mode tag (informational, does not affect qualification)
    tags.push(dto.attendanceMode === 'IN_PERSON' ? 'Attendance – In Person' : 'Attendance – Online');

    // Deduplicate and separate qualification tags from informational tags
    const qualificationTags = [...new Set(tags.filter((t) => t.startsWith('Not Suitable')))];
    const allTags = [...new Set(tags)];
    const status = qualificationTags.length === 0 ? 'Qualified – Invite' : qualificationTags[0];

    try {
      const application = await this.prisma.eventApplication.create({
        data: {
          fullName: dto.fullName,
          mobileNumber: dto.mobileNumber,
          email: dto.email.toLowerCase(),
          currentCity: dto.currentCity,
          nationality: dto.nationality,
          uaeResident: dto.uaeResident,
          caregivingExperience: dto.caregivingExperience,
          willingToWork: dto.willingToWork,
          willingToDrive: dto.willingToDrive,
          acceptsTimeframe: dto.acceptsTimeframe,
          seeksPermanentRelocation: dto.seeksPermanentRelocation,
          understandsInfoOnly: dto.understandsInfoOnly,
          acceptsFinancialCosts: dto.acceptsFinancialCosts,
          attendanceMode: dto.attendanceMode,
          selectedSession: dto.selectedSession,
          acknowledgedAccuracy: dto.acknowledgedAccuracy,
          status,
          tags: allTags,
        },
      });

      // Fire-and-forget webhook
      this.webhookService.fireEvent('application.created', application);

      // Fire-and-forget admin notification — does not block the response
      this.emailService.sendAdminNotification({
        fullName: application.fullName,
        email: application.email,
        mobileNumber: application.mobileNumber,
        currentCity: application.currentCity,
        nationality: application.nationality,
        status: application.status,
        attendanceMode: application.attendanceMode,
        selectedSession: application.selectedSession,
        tags: application.tags as string[],
      });

      return application;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(
          'It looks like you have already applied with this email address. If you need to update your application or believe this is an error, please reach out to us on WhatsApp or email. We are happy to help.',
        );
      }
      throw error;
    }
  }

  async checkEmail(email: string): Promise<{ exists: boolean }> {
    const existing = await this.prisma.eventApplication.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    });
    return { exists: !!existing };
  }

  async getStats() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    const [total, todayCount, weekCount, byStatus, bySession] = await Promise.all([
      this.prisma.eventApplication.count(),
      this.prisma.eventApplication.count({ where: { createdAt: { gte: todayStart } } }),
      this.prisma.eventApplication.count({ where: { createdAt: { gte: weekStart } } }),
      this.prisma.eventApplication.groupBy({ by: ['status'], _count: { id: true } }),
      this.prisma.eventApplication.groupBy({ by: ['selectedSession'], _count: { id: true } }),
    ]);

    return {
      total,
      todayCount,
      weekCount,
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count.id })),
      bySession: bySession.map((s) => ({ session: s.selectedSession, count: s._count.id })),
    };
  }

  async updateStatus(id: string, status: string, note?: string) {
    try {
      const previous = await this.prisma.eventApplication.findUnique({
        where: { id },
        select: { status: true },
      });
      const result = await this.prisma.eventApplication.update({
        where: { id },
        data: {
          status,
          reviewedAt: new Date(),
          ...(note !== undefined && { reviewNotes: note }),
        },
      });

      // Fire-and-forget webhook
      this.webhookService.fireEvent('application.status_changed', {
        ...result,
        previousStatus: previous?.status,
      });

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Application not found');
      }
      throw error;
    }
  }

  async bulkUpdateStatus(ids: string[], status: string) {
    // Fetch previous statuses before update
    const previousRecords = await this.prisma.eventApplication.findMany({
      where: { id: { in: ids } },
      select: { id: true, status: true },
    });
    const previousStatusMap = new Map(previousRecords.map((r) => [r.id, r.status]));

    const result = await this.prisma.eventApplication.updateMany({
      where: { id: { in: ids } },
      data: { status, reviewedAt: new Date() },
    });

    // Fetch full updated records and fire webhooks
    const updatedRecords = await this.prisma.eventApplication.findMany({
      where: { id: { in: ids } },
    });
    for (const record of updatedRecords) {
      this.webhookService.fireEvent('application.status_changed', {
        ...record,
        previousStatus: previousStatusMap.get(record.id),
      });
    }

    return { updated: result.count };
  }

  private buildWhereClause(
    status?: string,
    search?: string,
    attendanceMode?: string,
    selectedSession?: string,
    dateFrom?: string,
    dateTo?: string,
    tag?: string,
  ): Prisma.EventApplicationWhereInput {
    const where: Prisma.EventApplicationWhereInput = {};
    if (status) {
      where.status = status;
    }
    if (attendanceMode) {
      where.attendanceMode = attendanceMode;
    }
    if (selectedSession) {
      where.selectedSession = selectedSession;
    }
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { mobileNumber: { contains: search } },
      ];
    }
    if (tag) {
      where.tags = { array_contains: [tag] };
    }
    return where;
  }

  async findAll(
    status?: string,
    page = 1,
    limit = 20,
    search?: string,
    sortBy: 'createdAt' | 'fullName' | 'status' = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    attendanceMode?: string,
    selectedSession?: string,
    dateFrom?: string,
    dateTo?: string,
    tag?: string,
  ) {
    const skip = (page - 1) * limit;
    const where = this.buildWhereClause(status, search, attendanceMode, selectedSession, dateFrom, dateTo, tag);
    const orderBy = { [sortBy]: sortOrder };

    const [data, total] = await Promise.all([
      this.prisma.eventApplication.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.eventApplication.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findAllForExport(
    status?: string,
    search?: string,
    sortBy: 'createdAt' | 'fullName' | 'status' = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    attendanceMode?: string,
    selectedSession?: string,
    dateFrom?: string,
    dateTo?: string,
    tag?: string,
  ) {
    const where = this.buildWhereClause(status, search, attendanceMode, selectedSession, dateFrom, dateTo, tag);
    return this.prisma.eventApplication.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });
  }

  toCsv(applications: any[]): string {
    const BOM = '\uFEFF';
    const headers = [
      'ID', 'Full Name', 'Email', 'Mobile Number', 'Current City',
      'Nationality', 'UAE Resident', 'Caregiving Experience',
      'Willing to Work', 'Willing to Drive',
      'Accepts Timeframe', 'Seeks Permanent Relocation',
      'Understands Info Only', 'Accepts Financial Costs',
      'Attendance Mode', 'Selected Session',
      'Status', 'Tags', 'Review Notes', 'Reviewed At', 'Created At',
    ];

    const escCsv = (val: any): string => {
      if (val == null) return '';
      const s = String(val);
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const rows = applications.map((a) =>
      [
        a.id,
        a.fullName,
        a.email,
        a.mobileNumber,
        a.currentCity,
        a.nationality,
        a.uaeResident ? 'Yes' : 'No',
        Array.isArray(a.caregivingExperience) ? (a.caregivingExperience as string[]).join('; ') : '',
        a.willingToWork ? 'Yes' : 'No',
        a.willingToDrive ? 'Yes' : 'No',
        a.acceptsTimeframe ? 'Yes' : 'No',
        a.seeksPermanentRelocation ? 'Yes' : 'No',
        a.understandsInfoOnly ? 'Yes' : 'No',
        a.acceptsFinancialCosts ? 'Yes' : 'No',
        a.attendanceMode === 'IN_PERSON' ? 'In Person' : 'Online',
        a.selectedSession,
        a.status,
        Array.isArray(a.tags) ? (a.tags as string[]).join('; ') : '',
        a.reviewNotes || '',
        a.reviewedAt ? new Date(a.reviewedAt).toISOString() : '',
        new Date(a.createdAt).toISOString(),
      ]
        .map(escCsv)
        .join(','),
    );

    return BOM + [headers.join(','), ...rows].join('\n');
  }

  async findById(id: string) {
    const application = await this.prisma.eventApplication.findUnique({
      where: { id },
    });
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    return application;
  }

  async deleteOne(id: string) {
    try {
      await this.prisma.eventApplication.delete({ where: { id } });
      return { deleted: 1 };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Application not found');
      }
      throw error;
    }
  }

  async bulkDelete(ids: string[]) {
    const result = await this.prisma.eventApplication.deleteMany({
      where: { id: { in: ids } },
    });
    return { deleted: result.count };
  }

  async review(id: string, reviewNotes?: string) {
    try {
      const result = await this.prisma.eventApplication.update({
        where: { id },
        data: {
          reviewedAt: new Date(),
          reviewNotes: reviewNotes || null,
        },
      });

      // Fire-and-forget webhook
      this.webhookService.fireEvent('application.reviewed', result);

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Application not found');
      }
      throw error;
    }
  }
}
