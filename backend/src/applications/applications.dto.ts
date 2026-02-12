import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsBoolean,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsIn,
  ArrayMinSize,
  ArrayMaxSize,
  MaxLength,
  Matches,
  Equals,
  IsOptional,
} from 'class-validator';

export enum AttendanceMode {
  IN_PERSON = 'IN_PERSON',
  ONLINE = 'ONLINE',
}

export class CreateApplicationDto {
  @ApiProperty({ description: 'Full name as written on passport' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fullName: string;

  @ApiProperty({ description: 'Mobile number (WhatsApp preferred)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^\+[0-9\s\-().]{7,20}$/, { message: 'Please include a country code (e.g. +971XXXXXXXXX)' })
  mobileNumber: string;

  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(320)
  email: string;

  @ApiProperty({ description: 'Current city in the UAE' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  currentCity: string;

  @ApiProperty({ description: 'Nationality', example: 'filipino' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nationality: string;

  @ApiProperty({ description: 'Currently residing in the UAE' })
  @IsBoolean()
  uaeResident: boolean;

  @ApiProperty({
    description: 'Caregiving experience areas',
    example: ['Home health care', 'Caregiving / elderly care'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @MaxLength(255, { each: true })
  caregivingExperience: string[];

  @ApiProperty({ description: 'Willing to work in caregiving roles' })
  @IsBoolean()
  willingToWork: boolean;

  @ApiProperty({ description: 'Willing to drive as part of caregiving work' })
  @IsBoolean()
  willingToDrive: boolean;

  @ApiProperty({ description: 'Accepts 2-3 year timeframe' })
  @IsBoolean()
  acceptsTimeframe: boolean;

  @ApiProperty({ description: 'Seeks permanent relocation to the US' })
  @IsBoolean()
  seeksPermanentRelocation: boolean;

  @ApiProperty({ description: 'Understands session is informational only' })
  @IsBoolean()
  understandsInfoOnly: boolean;

  @ApiProperty({ description: 'Accepts financial costs involved' })
  @IsBoolean()
  acceptsFinancialCosts: boolean;

  @ApiProperty({ description: 'Attendance mode', enum: AttendanceMode })
  @IsEnum(AttendanceMode)
  attendanceMode: AttendanceMode;

  @ApiProperty({ description: 'Selected session date/time' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  selectedSession: string;

  @ApiProperty({ description: 'Confirmed information accuracy — must be true' })
  @IsBoolean()
  @Equals(true, { message: 'You must acknowledge the accuracy of your information' })
  acknowledgedAccuracy: boolean;
}

export class ReviewApplicationDto {
  @ApiPropertyOptional({ description: 'Review notes' })
  @IsOptional()
  @IsString()
  reviewNotes?: string;
}

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Page number (1-based)', example: 1 })
  @IsOptional()
  page?: string;

  @ApiPropertyOptional({ description: 'Items per page (max 100)', example: 20 })
  @IsOptional()
  limit?: string;
}

export const APPLICATION_STATUSES = [
  'Qualified – Invite',
  'Contacted',
  'Confirmed',
  'Attended',
  'No Show',
  'Rejected',
  'Declined',
  'No Response',
  'Cancelled',
  'Waitlisted',
  'Not Suitable – Criteria',
  'Not Suitable – Expectations',
  'Not Suitable – Driving Requirement',
  'Not Suitable – Financial Expectations',
] as const;

export class UpdateStatusDto {
  @ApiProperty({ description: 'New status', enum: APPLICATION_STATUSES })
  @IsString()
  @IsIn(APPLICATION_STATUSES as unknown as string[])
  status: string;

  @ApiPropertyOptional({ description: 'Optional note about the status change' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}

export class BulkUpdateStatusDto {
  @ApiProperty({ description: 'Application IDs to update (max 100)' })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  ids: string[];

  @ApiProperty({ description: 'New status', enum: APPLICATION_STATUSES })
  @IsString()
  @IsIn(APPLICATION_STATUSES as unknown as string[])
  status: string;
}

export class BulkDeleteDto {
  @ApiProperty({ description: 'Application IDs to delete (max 100)' })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  ids: string[];
}
