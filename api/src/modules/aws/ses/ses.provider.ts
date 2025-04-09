import { Injectable, Logger } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { EmailProvider } from '@modules/notification/interfaces/email.provider.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SesProvider implements EmailProvider {
  private readonly sesClient: SESClient;
  private readonly logger = new Logger(SesProvider.name);

  constructor(private configService: ConfigService) {
    this.sesClient = new SESClient({
      region: 'us-east-1',
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    htmlBody: string,
    from?: string,
  ) {
    const source = from || this.configService.getOrThrow('email.from');
    const command = new SendEmailCommand({
      Source: source,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: 'UTF-8',
          },
        },
      },
    });

    try {
      const result = await this.sesClient.send(command);
      this.logger.log(`Email sent to ${to}`, JSON.stringify(result));
      return result;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
      throw error;
    }
  }
}
