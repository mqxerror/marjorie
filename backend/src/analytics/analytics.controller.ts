import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { TrackEventDto, TrackBatchDto } from './analytics.dto';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  @ApiOperation({ summary: 'Track a single analytics event' })
  @ApiResponse({ status: 201, description: 'Event tracked successfully' })
  async trackEvent(@Body() trackEventDto: TrackEventDto) {
    return this.analyticsService.trackEvent(trackEventDto);
  }

  @Post('track/batch')
  @ApiOperation({ summary: 'Track multiple analytics events in batch' })
  @ApiResponse({ status: 201, description: 'Events tracked successfully' })
  async trackBatch(@Body() trackBatchDto: TrackBatchDto) {
    return this.analyticsService.trackBatch(trackBatchDto.events);
  }

  @Get('events')
  @ApiOperation({ summary: 'Get analytics events' })
  @ApiResponse({ status: 200, description: 'Returns analytics events' })
  @ApiQuery({ name: 'eventType', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getEvents(
    @Query('eventType') eventType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
  ) {
    return this.analyticsService.getEvents({
      eventType,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('counts')
  @ApiOperation({ summary: 'Get event counts by type' })
  @ApiResponse({ status: 200, description: 'Returns event counts grouped by type' })
  @ApiQuery({ name: 'eventType', required: false })
  async getEventCounts(@Query('eventType') eventType?: string) {
    return this.analyticsService.getEventCounts(eventType);
  }

  @Get('cta-metrics')
  @ApiOperation({ summary: 'Get CTA click metrics' })
  @ApiResponse({ status: 200, description: 'Returns CTA click metrics by position' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async getCTAMetrics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getCTAMetrics(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }
}
