import { Module } from '@nestjs/common';
import { EmailProviderFactory } from './email.provider.factory';

@Module({
  providers: [EmailProviderFactory],
  exports: [EmailProviderFactory],
})
export class EmailModule {}
