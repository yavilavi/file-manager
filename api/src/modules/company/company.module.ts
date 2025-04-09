import { Module } from '@nestjs/common';
import { CompanyService } from '@modules/company/company.service';
import { PrismaService } from '@libs/database/prisma/prisma.service';

@Module({
  providers: [CompanyService, PrismaService],
  exports: [CompanyService],
})
export class CompanyModule {}
