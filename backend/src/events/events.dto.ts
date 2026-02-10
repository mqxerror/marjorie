import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, IsArray } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ description: 'City name' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Event dates', example: ['May 24', 'May 25'] })
  @IsArray()
  dates: string[];

  @ApiProperty({ description: 'Session times', example: ['10:00 AM', '2:00 PM', '5:00 PM'] })
  @IsArray()
  sessionTimes: string[];

  @ApiProperty({ description: 'Facilitator name' })
  @IsString()
  facilitator: string;

  @ApiProperty({ description: 'Registration URL' })
  @IsString()
  registrationUrl: string;

  @ApiProperty({ description: 'Disclaimer text' })
  @IsString()
  disclaimer: string;

  @ApiPropertyOptional({ description: 'Session capacity', example: 50 })
  @IsOptional()
  @IsNumber()
  capacity?: number;

  @ApiPropertyOptional({ description: 'Is event active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Sort order', default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class UpdateEventDto {
  @ApiPropertyOptional({ description: 'City name' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Event dates' })
  @IsOptional()
  @IsArray()
  dates?: string[];

  @ApiPropertyOptional({ description: 'Session times' })
  @IsOptional()
  @IsArray()
  sessionTimes?: string[];

  @ApiPropertyOptional({ description: 'Facilitator name' })
  @IsOptional()
  @IsString()
  facilitator?: string;

  @ApiPropertyOptional({ description: 'Registration URL' })
  @IsOptional()
  @IsString()
  registrationUrl?: string;

  @ApiPropertyOptional({ description: 'Disclaimer text' })
  @IsOptional()
  @IsString()
  disclaimer?: string;

  @ApiPropertyOptional({ description: 'Session capacity' })
  @IsOptional()
  @IsNumber()
  capacity?: number;

  @ApiPropertyOptional({ description: 'Is event active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Sort order' })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
