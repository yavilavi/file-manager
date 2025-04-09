import { EmailProvider } from '@modules/notification/interfaces/email.provider.interface';
import { SesProvider } from '@modules/aws/ses/ses.provider';
import { ConfigService } from '@nestjs/config';

export enum EmailProviderType {
  SES = 'ses',
}

export const EmailProviderFactory = {
  provide: 'EMAIL_PROVIDER',
  useFactory: (configService: ConfigService): EmailProvider => {
    const provider =
      configService.getOrThrow<EmailProviderType>('email.provider');
    if (!provider) {
      throw new Error('Email provider is not configured');
    }
    if (provider === EmailProviderType.SES) {
      return new SesProvider(configService);
    }

    throw new Error(`Unsupported email provider: ${String(provider)}`);
  },
  inject: [ConfigService],
};
