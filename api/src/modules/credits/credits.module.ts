/**
 * File Manager - credits.module Module
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Module } from '@nestjs/common';
import { CreditsService } from './application/services/credits.service';
import { PlanInfoService } from './application/services/plan-info.service';
import { CompanyPlanCreatedHandler } from './application/handlers/company-plan-created.handler';
import { CompanyCreditsRepositoryImpl } from './infrastructure/repositories/company-credits.repository.impl';
import { CreditTransactionRepositoryImpl } from './infrastructure/repositories/credit-transaction.repository.impl';
import { CreditsController } from './infrastructure/controllers/credits.controller';
import { PrismaService } from '@libs/database/prisma/prisma.service';

@Module({
  imports: [],
  providers: [
    CreditsService,
    PlanInfoService,
    CompanyPlanCreatedHandler,
    {
      provide: 'CompanyCreditsRepository',
      useClass: CompanyCreditsRepositoryImpl,
    },
    {
      provide: 'CreditTransactionRepository',
      useClass: CreditTransactionRepositoryImpl,
    },
    PrismaService,
  ],
  controllers: [CreditsController],
  exports: [CreditsService, PlanInfoService],
})
export class CreditsModule {}
