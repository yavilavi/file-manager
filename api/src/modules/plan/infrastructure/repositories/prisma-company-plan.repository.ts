/**
 * File Manager - prisma-company-plan.repository Repository
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import { ICompanyPlanRepository } from '../../domain/repositories/company-plan-repository.interface';
import { CompanyPlan } from '../../domain/entities/company-plan.entity';
import { Plan } from '../../domain/entities/plan.entity';
import {
  Plan as PrismaPlan,
  CompanyPlan as PrismaCompanyPlan,
} from '@prisma/client';

@Injectable()
export class PrismaCompanyPlanRepository implements ICompanyPlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomainEntity(
    prismaCompanyPlan: PrismaCompanyPlan,
    prismaPlan?: PrismaPlan,
  ): CompanyPlan {
    const companyPlan = new CompanyPlan({
      tenantId: prismaCompanyPlan.tenantId,
      planId: prismaCompanyPlan.planId,
      startDate: prismaCompanyPlan.startDate,
      endDate: prismaCompanyPlan.endDate,
      isActive: prismaCompanyPlan.isActive,
      storageUsed: prismaCompanyPlan.storageUsed,
      createdAt: prismaCompanyPlan.createdAt,
      updatedAt: prismaCompanyPlan.updatedAt,
      plan: prismaPlan ? this.toPlanEntity(prismaPlan) : undefined,
    });

    companyPlan.id = prismaCompanyPlan.id;
    return companyPlan;
  }

  private toPlanEntity(prismaPlan: PrismaPlan): Plan {
    const plan = new Plan({
      name: prismaPlan.name,
      description: prismaPlan.description,
      storageSize: prismaPlan.storageSize,
      creditsIncluded: prismaPlan.creditsIncluded,
      isActive: prismaPlan.isActive,
      createdAt: prismaPlan.createdAt,
      updatedAt: prismaPlan.updatedAt,
      deletedAt: prismaPlan.deletedAt,
    });

    plan.id = prismaPlan.id;
    return plan;
  }

  private toPrismaEntity(
    companyPlan: CompanyPlan,
  ): Omit<PrismaCompanyPlan, 'id'> {
    return {
      tenantId: companyPlan.tenantId,
      planId: companyPlan.planId,
      startDate: companyPlan.startDate,
      endDate: companyPlan.endDate,
      isActive: companyPlan.isActive,
      storageUsed: companyPlan.storageUsed,
      createdAt: companyPlan.createdAt,
      updatedAt: companyPlan.updatedAt,
    };
  }

  async findAll(): Promise<CompanyPlan[]> {
    const companyPlans = await this.prisma.client.companyPlan.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return companyPlans.map((companyPlan: PrismaCompanyPlan) =>
      this.toDomainEntity(companyPlan),
    );
  }

  async findById(id: number): Promise<CompanyPlan | null> {
    const companyPlan = await this.prisma.client.companyPlan.findUnique({
      where: { id },
    });

    return companyPlan ? this.toDomainEntity(companyPlan) : null;
  }

  async findByTenantId(tenantId: string): Promise<CompanyPlan | null> {
    const companyPlan = await this.prisma.client.companyPlan.findUnique({
      where: { tenantId },
      include: { plan: true },
    });

    if (!companyPlan) return null;

    return this.toDomainEntity(companyPlan, companyPlan.plan);
  }

  async findByPlanId(planId: number): Promise<CompanyPlan[]> {
    const companyPlans = await this.prisma.client.companyPlan.findMany({
      where: { planId },
      orderBy: { createdAt: 'desc' },
    });

    return companyPlans.map((plan: PrismaCompanyPlan) =>
      this.toDomainEntity(plan),
    );
  }

  async findActive(): Promise<CompanyPlan[]> {
    const companyPlans = await this.prisma.client.companyPlan.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return companyPlans.map((plan: PrismaCompanyPlan) =>
      this.toDomainEntity(plan),
    );
  }

  async findWithPlan(id: number): Promise<CompanyPlan | null> {
    const companyPlan = await this.prisma.client.companyPlan.findUnique({
      where: { id },
      include: { plan: true },
    });

    if (!companyPlan) return null;

    return this.toDomainEntity(companyPlan, companyPlan.plan);
  }

  async create(companyPlan: CompanyPlan): Promise<CompanyPlan> {
    const createdCompanyPlan = await this.prisma.client.companyPlan.create({
      data: this.toPrismaEntity(companyPlan),
    });

    return this.toDomainEntity(createdCompanyPlan);
  }

  async update(id: number, companyPlan: CompanyPlan): Promise<CompanyPlan> {
    const updatedCompanyPlan = await this.prisma.client.companyPlan.update({
      where: { id },
      data: {
        ...this.toPrismaEntity(companyPlan),
        updatedAt: new Date(),
      },
    });

    return this.toDomainEntity(updatedCompanyPlan);
  }

  async updateStorageUsed(
    tenantId: string,
    storageUsed: bigint,
  ): Promise<CompanyPlan> {
    const updatedCompanyPlan = await this.prisma.client.companyPlan.update({
      where: { tenantId },
      data: {
        storageUsed,
        updatedAt: new Date(),
      },
    });

    return this.toDomainEntity(updatedCompanyPlan);
  }

  async deactivate(id: number): Promise<void> {
    await this.prisma.client.companyPlan.update({
      where: { id },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });
  }
}
