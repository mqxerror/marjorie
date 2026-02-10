import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TrackEventDto {
  @ApiProperty({ description: 'Type of event', example: 'cta_click' })
  @IsString()
  eventType: string;

  @ApiProperty({ description: 'Event label', example: 'hero' })
  @IsString()
  label: string;

  @ApiPropertyOptional({ description: 'Additional event metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Client session ID' })
  @IsOptional()
  @IsString()
  sessionId?: string;
}

export class TrackBatchDto {
  @ApiProperty({ type: [TrackEventDto], description: 'Array of events to track' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrackEventDto)
  events: TrackEventDto[];
}
