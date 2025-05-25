/**
 * File Manager - credits.module Module
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { Module, forwardRef } from '@nestjs/common';
import { CreditsService } from './application/services/credits.service';
import { CompanyCreditsRepositoryImpl } from './infrastructure/repositories/company-credits.repository.impl';
import { CreditTransactionRepositoryImpl } from './infrastructure/repositories/credit-transaction.repository.impl';
import { CreditsController } from './infrastructure/controllers/credits.controller';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import { PlanModule } from '../plan/plan.module';

@Module({
  imports: [forwardRef(() => PlanModule)],
  providers: [
    CreditsService,
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
  exports: [CreditsService],
})
export class CreditsModule {}
