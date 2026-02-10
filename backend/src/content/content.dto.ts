import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateContentDto {
  @ApiProperty({ description: 'Unique section key' })
  @IsString()
  sectionKey: string;

  @ApiProperty({ description: 'Section title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Section subtitle' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({ description: 'Section body content' })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional({ description: 'Additional items as JSON' })
  @IsOptional()
  items?: Prisma.InputJsonValue;

  @ApiPropertyOptional({ description: 'CTA button text' })
  @IsOptional()
  @IsString()
  ctaText?: string;

  @ApiPropertyOptional({ description: 'CTA button URL' })
  @IsOptional()
  @IsString()
  ctaUrl?: string;

  @ApiPropertyOptional({ description: 'Is content active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Sort order', default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class UpdateContentDto {
  @ApiPropertyOptional({ description: 'Section title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Section subtitle' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({ description: 'Section body content' })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional({ description: 'Additional items as JSON' })
  @IsOptional()
  items?: Prisma.InputJsonValue;

  @ApiPropertyOptional({ description: 'CTA button text' })
  @IsOptional()
  @IsString()
  ctaText?: string;

  @ApiPropertyOptional({ description: 'CTA button URL' })
  @IsOptional()
  @IsString()
  ctaUrl?: string;

  @ApiPropertyOptional({ description: 'Is content active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Sort order' })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
