/**
 * File Manager - email-notifications.service Service
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EmailProvider } from '@modules/notification/interfaces/email.provider.interface';
import { OnEvent } from '@nestjs/event-emitter';
import { SignupDto } from '@modules/auth/dtos/signup.dto';
import { ConfigService } from '@nestjs/config';
import buildWelcomeEmailTemplate from '@modules/notification/email/templates/signup-wellcome-email.template';
import buildNewUserWelcomeEmail from '@modules/notification/email/templates/new-user-wellcome-email.template';
import { CreateUserDto } from '@modules/users/dtos/create-user.dto';

interface SendEmailDTO {
  to: string;
  subject: string;
  body: string;
}

@Injectable()
export class EmailNotificationsService {
  constructor(
    @Inject('EMAIL_PROVIDER') private readonly email: EmailProvider,
    private configService: ConfigService,
  ) {}

  @OnEvent('company.created')
  async sendSignupWellcome(payload: SignupDto): Promise<void> {
    const { user, company } = payload;
    const appUrl = `${this.configService.get('protocol') ?? 'http'}://${company.tenantId}.${this.configService.getOrThrow('baseAppUrl')}`;

    const subject = `Â¡Bienvenido a Docma, ${company.name}!`;
    const htmlBody = buildWelcomeEmailTemplate(user.name, company.name, appUrl);

    try {
      await this.email.sendEmail(user.email, subject, htmlBody);
    } catch (error) {
      console.error('Error enviando correo de bienvenida:', error);
    }
  }

  @OnEvent('user.created')
  async sendNewUserWelcome(payload: {
    user: CreateUserDto;
    company: {
      name: string;
      tenantId: string;
    };
  }): Promise<void> {
    const { user, company } = payload;
    const appUrl = `${this.configService.get('protocol') ?? 'http'}://${company.tenantId}.${this.configService.getOrThrow('baseAppUrl')}`;

    const subject = `Â¡Bienvenido a Docma, ${user.name}!`;
    const htmlBody = buildNewUserWelcomeEmail(user, company.name, appUrl);

    try {
      await this.email.sendEmail(user.email, subject, htmlBody);
    } catch (error) {
      Logger.error('Error enviando correo de bienvenida:', error);
    }
  }

  async sendEmail({ to, subject, body }: SendEmailDTO): Promise<void> {
    try {
      await this.email.sendEmail(to, subject, body);
      Logger.log(`Correo enviado a ${to}`);
    } catch (error) {
      Logger.error(`Error enviando correo a ${to}:`, error);
      throw new Error('No se pudo enviar el correo');
    }
  }
}
