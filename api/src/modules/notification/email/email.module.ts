/**
 * File Manager - email.module Module
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Module } from '@nestjs/common';
import { EmailProviderFactory } from './email.provider.factory';

@Module({
  providers: [EmailProviderFactory],
  exports: [EmailProviderFactory],
})
export class EmailModule {}
