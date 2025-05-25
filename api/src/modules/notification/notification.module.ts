/**
 * File Manager - notification.module Module
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Module } from '@nestjs/common';
import { EmailNotificationsService } from '@modules/notification/email-notifications.service';
import { EmailModule } from '@modules/notification/email/email.module';
import { EmailNotificationController } from '@modules/notification/email-notification.controller';

@Module({
  imports: [EmailModule],
  providers: [EmailNotificationsService],
  controllers: [EmailNotificationController],
})
export class NotificationModule {}
