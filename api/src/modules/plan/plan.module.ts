import { Module } from '@nestjs/common';
import { PlanService } from './application/services/plan.service';
import { CompanyPlanService } from './application/services/company-plan.service';
import { PlanController } from './infrastructure/controllers/plan.controller';
import { CompanyPlanController } from './infrastructure/controllers/company-plan.controller';
import { PrismaPlanRepository } from './infrastructure/repositories/prisma-plan.repository';
import { PrismaCompanyPlanRepository } from './infrastructure/repositories/prisma-company-plan.repository';
import { PLAN_REPOSITORY } from './domain/repositories/plan-repository.interface';
import { COMPANY_PLAN_REPOSITORY } from './domain/repositories/company-plan-repository.interface';
import { PrismaService } from '@libs/database/prisma/prisma.service';

@Module({
  controllers: [PlanController, CompanyPlanController],
  providers: [
    PrismaService,
    PlanService,
    CompanyPlanService,
    {
      provide: PLAN_REPOSITORY,
      useClass: PrismaPlanRepository,
    },
    {
      provide: COMPANY_PLAN_REPOSITORY,
      useClass: PrismaCompanyPlanRepository,
    },
  ],
  exports: [PlanService, CompanyPlanService],
})
export class PlanModule {}
