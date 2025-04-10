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
