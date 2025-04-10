import { Body, Controller, Post } from '@nestjs/common';
import { EmailNotificationsService } from '@modules/notification/email-notifications.service';

@Controller('email-notification')
export class EmailNotificationController {
  constructor(private emailService: EmailNotificationsService) {}

  @Post('send-email')
  async manualSendEmail(
    @Body() dto: { to: string; subject: string; body: string },
  ) {
    await this.emailService.sendEmail(dto);
    return { message: 'Correo enviado' };
  }
}
