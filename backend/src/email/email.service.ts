import { Injectable, Logger } from '@nestjs/common';

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly apiKey = process.env.EMAILIT_API_KEY;
  private readonly fromAddress = process.env.EMAILIT_FROM_ADDRESS || 'noreply@marjoriequintos.com';
  private readonly adminEmails = (process.env.ADMIN_NOTIFICATION_EMAILS || '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    if (!this.apiKey) {
      this.logger.warn('EMAILIT_API_KEY not configured — skipping email');
      return false;
    }

    try {
      const response = await fetch('https://api.emailit.com/v2/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: options.from || this.fromAddress,
          to: Array.isArray(options.to) ? options.to.join(',') : options.to,
          subject: options.subject,
          html: options.html,
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        this.logger.error(`EmailIt API error (${response.status}): ${body}`);
        return false;
      }

      this.logger.log(`Email sent to ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      return false;
    }
  }

  async sendAdminNotification(application: {
    fullName: string;
    email: string;
    mobileNumber: string;
    currentCity: string;
    nationality: string;
    status: string;
    attendanceMode: string;
    selectedSession: string;
    tags: string[];
  }): Promise<void> {
    if (this.adminEmails.length === 0) {
      this.logger.warn('No ADMIN_NOTIFICATION_EMAILS configured — skipping notification');
      return;
    }

    const isQualified = application.status === 'Qualified – Invite';
    const statusColor = isQualified ? '#16a34a' : '#dc2626';
    const statusLabel = isQualified ? 'QUALIFIED' : 'NOT SUITABLE';

    const tagsHtml =
      application.tags.length > 0
        ? application.tags
            .map((t) => `<span style="background:#fef2f2;color:#991b1b;padding:2px 8px;border-radius:4px;font-size:12px;">${t}</span>`)
            .join(' ')
        : '<span style="background:#f0fdf4;color:#166534;padding:2px 8px;border-radius:4px;font-size:12px;">No disqualifiers</span>';

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1e293b;color:#ffffff;padding:20px;border-radius:8px 8px 0 0;">
          <h2 style="margin:0;font-size:18px;">New Application Received</h2>
          <p style="margin:4px 0 0;opacity:0.8;font-size:14px;">EB-3 Information Session Screening Form</p>
        </div>
        <div style="border:1px solid #e2e8f0;border-top:none;padding:20px;border-radius:0 0 8px 8px;">
          <div style="background:${statusColor}10;border-left:4px solid ${statusColor};padding:12px;margin-bottom:16px;border-radius:0 4px 4px 0;">
            <strong style="color:${statusColor};font-size:14px;">${statusLabel}</strong>
            <span style="color:#475569;font-size:14px;margin-left:8px;">${application.status}</span>
          </div>

          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:8px 0;color:#64748b;width:140px;">Name</td><td style="padding:8px 0;font-weight:600;">${application.fullName}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Email</td><td style="padding:8px 0;"><a href="mailto:${application.email}" style="color:#2563eb;">${application.email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Mobile</td><td style="padding:8px 0;"><a href="https://wa.me/${application.mobileNumber.replace(/[^0-9]/g, '')}" style="color:#2563eb;">${application.mobileNumber}</a></td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">City</td><td style="padding:8px 0;">${application.currentCity}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Nationality</td><td style="padding:8px 0;">${application.nationality}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Attendance</td><td style="padding:8px 0;">${application.attendanceMode === 'IN_PERSON' ? 'In Person' : 'Online'}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Session</td><td style="padding:8px 0;">${application.selectedSession}</td></tr>
          </table>

          <div style="margin-top:16px;">
            <p style="color:#64748b;font-size:12px;margin:0 0 6px;">Tags</p>
            ${tagsHtml}
          </div>

          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />
          <p style="color:#94a3b8;font-size:12px;margin:0;text-align:center;">
            This is an automated notification from the EB-3 Screening System.
          </p>
        </div>
      </div>
    `;

    // Fire-and-forget — don't await, don't block the API response
    this.sendEmail({
      to: this.adminEmails,
      subject: `${isQualified ? '[QUALIFIED]' : '[NOT SUITABLE]'} New Application: ${application.fullName}`,
      html,
    }).catch((err) => {
      this.logger.error(`Admin notification failed: ${err.message}`);
    });
  }
}
