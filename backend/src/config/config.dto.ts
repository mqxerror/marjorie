import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { Prisma } from '@prisma/client';

export class UpsertConfigDto {
  @ApiProperty({ description: 'Configuration value (JSON)', example: { enabled: true } })
  @IsDefined()
  value: Prisma.InputJsonValue;
}
