import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { EmailNotificationsService } from '@modules/notification/email-notifications.service';
import { RequirePermission } from '@modules/auth/decorators/require-permission.decorator';
import { Request as Req } from 'express';

@Controller('email-notification')
export class EmailNotificationController {
  constructor(private emailService: EmailNotificationsService) {}

  @Post('send-email')
  @RequirePermission('notification:send')
  async manualSendEmail(
    @Request() req: Req,
    @Body() dto: { to: string; subject: string; body: string },
  ) {
    if (req.user.data.canSendEmail) {
      await this.emailService.sendEmail(dto);
      return { message: 'Correo enviado' };
    }
    throw new UnauthorizedException('Envío de correo deshabilitado');
  }
}
