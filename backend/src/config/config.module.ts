import { Module } from '@nestjs/common';
import { SiteConfigController } from './config.controller';
import { SiteConfigService } from './config.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SiteConfigController],
  providers: [SiteConfigService],
  exports: [SiteConfigService],
})
export class ConfigModule {}
