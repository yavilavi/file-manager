/**
 * File Manager - company.module Module
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Module } from '@nestjs/common';
import { CompanyService } from '@modules/company/company.service';
import { PrismaService } from '@libs/database/prisma/prisma.service';

@Module({
  providers: [CompanyService, PrismaService],
  exports: [CompanyService],
})
export class CompanyModule {}
