import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.eventSession.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.eventSession.findUnique({
      where: { id },
    });
  }

  async findByCity(city: string) {
    return this.prisma.eventSession.findMany({
      where: {
        city: { contains: city, mode: 'insensitive' },
        isActive: true
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(data: Prisma.EventSessionCreateInput) {
    return this.prisma.eventSession.create({ data });
  }

  async update(id: string, data: Prisma.EventSessionUpdateInput) {
    return this.prisma.eventSession.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.eventSession.delete({
      where: { id },
    });
  }
}
