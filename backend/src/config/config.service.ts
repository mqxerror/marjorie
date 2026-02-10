import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SiteConfigService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.siteConfig.findMany();
  }

  async findByKey(key: string) {
    return this.prisma.siteConfig.findUnique({
      where: { key },
    });
  }

  async getValue<T = unknown>(key: string): Promise<T | null> {
    const config = await this.findByKey(key);
    return config ? (config.value as T) : null;
  }

  async upsert(key: string, value: Prisma.InputJsonValue) {
    return this.prisma.siteConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  async delete(key: string) {
    return this.prisma.siteConfig.delete({
      where: { key },
    });
  }

  async getPublicConfig() {
    // Return only public configuration values
    const publicKeys = ['spots_remaining', 'cta_url', 'analytics_enabled', 'maintenance_mode', 'tracking_scripts'];
    const configs = await this.prisma.siteConfig.findMany({
      where: { key: { in: publicKeys } },
    });

    return configs.reduce(
      (acc, config) => {
        acc[config.key] = config.value;
        return acc;
      },
      {} as Record<string, unknown>,
    );
  }
}
