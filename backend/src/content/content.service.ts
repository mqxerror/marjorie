import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.sectionContent.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findByKey(sectionKey: string) {
    return this.prisma.sectionContent.findUnique({
      where: { sectionKey },
    });
  }

  async create(data: Prisma.SectionContentCreateInput) {
    return this.prisma.sectionContent.create({ data });
  }

  async update(sectionKey: string, data: Prisma.SectionContentUpdateInput) {
    return this.prisma.sectionContent.update({
      where: { sectionKey },
      data,
    });
  }

  async delete(sectionKey: string) {
    return this.prisma.sectionContent.delete({
      where: { sectionKey },
    });
  }
}
