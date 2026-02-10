import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiSecurity,
} from '@nestjs/swagger';
import * as ExcelJS from 'exceljs';
import { ApplicationsService } from './applications.service';
import {
  CreateApplicationDto,
  ReviewApplicationDto,
  UpdateStatusDto,
  BulkUpdateStatusDto,
  BulkDeleteDto,
} from './applications.dto';
import { ApiKeyGuard } from '../common/api-key.guard';
import { ParseCuidPipe } from '../common/parse-cuid.pipe';

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: 'Submit screening form application (public)' })
  @ApiResponse({ status: 201, description: 'Application submitted successfully' })
  @ApiResponse({ status: 409, description: 'Duplicate email address' })
  async create(@Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(dto);
  }

  @Get('check-email')
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @ApiOperation({ summary: 'Check if email already has an application (public)' })
  @ApiResponse({ status: 200, description: 'Returns { exists: boolean }' })
  @ApiQuery({ name: 'email', required: true, description: 'Email to check' })
  async checkEmail(@Query('email') email: string) {
    return this.applicationsService.checkEmail(email);
  }

  @Get('stats')
  @SkipThrottle()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Get application statistics' })
  @ApiResponse({ status: 200, description: 'Returns application stats' })
  async getStats() {
    return this.applicationsService.getStats();
  }

  @Get('export')
  @SkipThrottle()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Export applications as CSV or Excel' })
  @ApiResponse({ status: 200, description: 'Returns file download' })
  @ApiQuery({ name: 'format', required: false, description: 'Export format: csv or xlsx (default: csv)' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name, email, or phone' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort field: createdAt, fullName, status' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort direction: asc or desc' })
  @ApiQuery({ name: 'attendanceMode', required: false, description: 'Filter by attendance mode' })
  @ApiQuery({ name: 'selectedSession', required: false, description: 'Filter by session' })
  @ApiQuery({ name: 'dateFrom', required: false, description: 'Filter from date (ISO string)' })
  @ApiQuery({ name: 'dateTo', required: false, description: 'Filter to date (ISO string)' })
  @ApiQuery({ name: 'tag', required: false, description: 'Filter by tag' })
  async export(
    @Res() res: Response,
    @Query('format') format?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('attendanceMode') attendanceMode?: string,
    @Query('selectedSession') selectedSession?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('tag') tag?: string,
  ) {
    const validFormat = format === 'xlsx' ? 'xlsx' : 'csv';
    const validSortBy = ['createdAt', 'fullName', 'status'].includes(sortBy || '')
      ? (sortBy as 'createdAt' | 'fullName' | 'status')
      : 'createdAt';
    const validSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    const applications = await this.applicationsService.findAllForExport(
      status,
      search,
      validSortBy,
      validSortOrder,
      attendanceMode,
      selectedSession,
      dateFrom,
      dateTo,
      tag,
    );

    const dateStr = new Date().toISOString().split('T')[0];

    if (validFormat === 'csv') {
      const csv = this.applicationsService.toCsv(applications);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="applications-${dateStr}.csv"`);
      res.send(csv);
      return;
    }

    // Excel export
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Applications');

    sheet.columns = [
      { header: 'ID', key: 'id', width: 28 },
      { header: 'Full Name', key: 'fullName', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Mobile Number', key: 'mobileNumber', width: 18 },
      { header: 'Current City', key: 'currentCity', width: 15 },
      { header: 'Nationality', key: 'nationality', width: 15 },
      { header: 'UAE Resident', key: 'uaeResident', width: 13 },
      { header: 'Caregiving Experience', key: 'caregivingExperience', width: 30 },
      { header: 'Willing to Work', key: 'willingToWork', width: 15 },
      { header: 'Willing to Drive', key: 'willingToDrive', width: 15 },
      { header: 'Accepts Timeframe', key: 'acceptsTimeframe', width: 17 },
      { header: 'Seeks Relocation', key: 'seeksPermanentRelocation', width: 16 },
      { header: 'Understands Info Only', key: 'understandsInfoOnly', width: 20 },
      { header: 'Accepts Financial Costs', key: 'acceptsFinancialCosts', width: 22 },
      { header: 'Attendance Mode', key: 'attendanceMode', width: 16 },
      { header: 'Selected Session', key: 'selectedSession', width: 25 },
      { header: 'Status', key: 'status', width: 28 },
      { header: 'Tags', key: 'tags', width: 30 },
      { header: 'Review Notes', key: 'reviewNotes', width: 30 },
      { header: 'Reviewed At', key: 'reviewedAt', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 20 },
    ];

    // Bold headers
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' },
    };
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    for (const a of applications) {
      sheet.addRow({
        id: a.id,
        fullName: a.fullName,
        email: a.email,
        mobileNumber: a.mobileNumber,
        currentCity: a.currentCity,
        nationality: a.nationality,
        uaeResident: a.uaeResident ? 'Yes' : 'No',
        caregivingExperience: Array.isArray(a.caregivingExperience) ? (a.caregivingExperience as string[]).join('; ') : '',
        willingToWork: a.willingToWork ? 'Yes' : 'No',
        willingToDrive: a.willingToDrive ? 'Yes' : 'No',
        acceptsTimeframe: a.acceptsTimeframe ? 'Yes' : 'No',
        seeksPermanentRelocation: a.seeksPermanentRelocation ? 'Yes' : 'No',
        understandsInfoOnly: a.understandsInfoOnly ? 'Yes' : 'No',
        acceptsFinancialCosts: a.acceptsFinancialCosts ? 'Yes' : 'No',
        attendanceMode: a.attendanceMode === 'IN_PERSON' ? 'In Person' : 'Online',
        selectedSession: a.selectedSession,
        status: a.status,
        tags: Array.isArray(a.tags) ? (a.tags as string[]).join('; ') : '',
        reviewNotes: a.reviewNotes || '',
        reviewedAt: a.reviewedAt ? new Date(a.reviewedAt).toISOString() : '',
        createdAt: new Date(a.createdAt).toISOString(),
      });
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="applications-${dateStr}.xlsx"`);
    await workbook.xlsx.write(res);
    res.end();
  }

  @Get()
  @SkipThrottle()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'List applications with pagination, search, and sort' })
  @ApiResponse({ status: 200, description: 'Returns paginated applications' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (1-based)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (max 100)' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name, email, or phone' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort field: createdAt, fullName, status' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort direction: asc or desc' })
  @ApiQuery({ name: 'attendanceMode', required: false, description: 'Filter by attendance mode' })
  @ApiQuery({ name: 'selectedSession', required: false, description: 'Filter by session' })
  @ApiQuery({ name: 'dateFrom', required: false, description: 'Filter from date (ISO string)' })
  @ApiQuery({ name: 'dateTo', required: false, description: 'Filter to date (ISO string)' })
  @ApiQuery({ name: 'tag', required: false, description: 'Filter by tag' })
  async findAll(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('attendanceMode') attendanceMode?: string,
    @Query('selectedSession') selectedSession?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('tag') tag?: string,
  ) {
    const pageNum = Math.max(1, parseInt(page || '1', 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit || '20', 10) || 20));
    const validSortBy = ['createdAt', 'fullName', 'status'].includes(sortBy || '')
      ? (sortBy as 'createdAt' | 'fullName' | 'status')
      : 'createdAt';
    const validSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    return this.applicationsService.findAll(
      status,
      pageNum,
      limitNum,
      search,
      validSortBy,
      validSortOrder,
      attendanceMode,
      selectedSession,
      dateFrom,
      dateTo,
      tag,
    );
  }

  @Post('bulk-delete')
  @SkipThrottle()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Bulk delete applications' })
  @ApiResponse({ status: 200, description: 'Returns count of deleted applications' })
  async bulkDelete(@Body() dto: BulkDeleteDto) {
    return this.applicationsService.bulkDelete(dto.ids);
  }

  @Get(':id')
  @SkipThrottle()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Get application by ID' })
  @ApiResponse({ status: 200, description: 'Returns application details' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async findById(@Param('id', ParseCuidPipe) id: string) {
    return this.applicationsService.findById(id);
  }

  @Delete(':id')
  @SkipThrottle()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Delete an application' })
  @ApiResponse({ status: 200, description: 'Application deleted' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async deleteOne(@Param('id', ParseCuidPipe) id: string) {
    return this.applicationsService.deleteOne(id);
  }

  @Patch('bulk-status')
  @SkipThrottle()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Bulk update application statuses' })
  @ApiResponse({ status: 200, description: 'Returns count of updated applications' })
  async bulkUpdateStatus(@Body() dto: BulkUpdateStatusDto) {
    return this.applicationsService.bulkUpdateStatus(dto.ids, dto.status);
  }

  @Patch(':id/status')
  @SkipThrottle()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Update application status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async updateStatus(
    @Param('id', ParseCuidPipe) id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.applicationsService.updateStatus(id, dto.status, dto.note);
  }

  @Patch(':id/review')
  @SkipThrottle()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Add review notes to application' })
  @ApiResponse({ status: 200, description: 'Review added successfully' })
  async review(@Param('id', ParseCuidPipe) id: string, @Body() dto: ReviewApplicationDto) {
    return this.applicationsService.review(id, dto.reviewNotes);
  }
}
