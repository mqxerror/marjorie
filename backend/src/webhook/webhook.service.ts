import { Injectable, Logger } from '@nestjs/common';
import { createHmac } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { SiteConfigService } from '../config/config.service';

interface WebhookConfig {
  url: string;
  secret: string;
  enabled: boolean;
  enabledEvents: string[];
}

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private prisma: PrismaService,
    private configService: SiteConfigService,
  ) {}

  async fireEvent(event: string, payload: object, skipEventFilter = false): Promise<void> {
    const config = await this.configService.getValue<WebhookConfig>('webhook_config');
    if (!config || !config.enabled) return;
    if (!skipEventFilter && !config.enabledEvents.includes(event)) return;

    // Fire-and-forget — don't await, don't block the caller
    this.deliver(event, payload, config).catch((err) => {
      this.logger.error(`Webhook delivery failed for ${event}: ${err.message}`);
    });
  }

  private async deliver(event: string, payload: object, config: WebhookConfig): Promise<void> {
    const body = JSON.stringify({ event, data: payload, timestamp: new Date().toISOString() });
    const signature = createHmac('sha256', config.secret).update(body).digest('hex');
    const delays = [1000, 4000, 16000];
    let lastStatus = 0;
    let lastResponse: string | null = null;
    let success = false;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(config.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
            'X-Webhook-Event': event,
          },
          body,
          signal: AbortSignal.timeout(10000),
        });

        lastStatus = res.status;
        lastResponse = (await res.text()).slice(0, 500);
        success = res.ok;

        if (success) {
          this.logger.log(`Webhook delivered: ${event} (attempt ${attempt})`);
          break;
        }

        this.logger.warn(`Webhook attempt ${attempt} failed: ${lastStatus}`);
      } catch (error) {
        lastStatus = 0;
        lastResponse = error.message?.slice(0, 500) ?? null;
        this.logger.warn(`Webhook attempt ${attempt} error: ${error.message}`);
      }

      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, delays[attempt - 1]));
      }
    }

    await this.prisma.webhookLog.create({
      data: {
        event,
        payload: payload as any,
        status: lastStatus,
        response: lastResponse,
        attempts: success ? 1 : 3,
        success,
      },
    });
  }

  async getRecentLogs(limit = 50) {
    return this.prisma.webhookLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
