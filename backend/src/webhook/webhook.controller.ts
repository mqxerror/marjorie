import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/api-key.guard';
import { WebhookService } from './webhook.service';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Get('logs')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Get recent webhook delivery logs' })
  async getLogs() {
    return this.webhookService.getRecentLogs();
  }

  @Post('test')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Send a test webhook event' })
  async sendTest() {
    await this.webhookService.fireEvent('webhook.test', {
      message: 'This is a test webhook delivery',
      timestamp: new Date().toISOString(),
    }, true);
    return { message: 'Test webhook fired' };
  }
}
