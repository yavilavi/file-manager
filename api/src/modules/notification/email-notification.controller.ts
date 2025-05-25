/**
 * File Manager - email-notification.controller Controller
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
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
    throw new UnauthorizedException('EnvÃ­o de correo deshabilitado');
  }
}
