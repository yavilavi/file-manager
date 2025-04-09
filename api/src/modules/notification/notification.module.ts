import { Module } from '@nestjs/common';
import { EmailNotificationsService } from '@modules/notification/email-notifications.service';
import { EmailModule } from '@modules/notification/email/email.module';

@Module({
  imports: [EmailModule],
  providers: [EmailNotificationsService],
})
export class NotificationModule {}
