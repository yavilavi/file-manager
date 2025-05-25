/**
 * File Manager - Company Credits.Repository.Impl
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/database/prisma/prisma.service';
import { CompanyCreditsRepository } from '../../domain/repositories/company-credits.repository';
import { CompanyCreditsEntity } from '../../domain/entities/company-credits.entity';

@Injectable()
export class CompanyCreditsRepositoryImpl implements CompanyCreditsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByTenantId(tenantId: string): Promise<CompanyCreditsEntity | null> {
    const companyCredits = await this.prisma.client.companyCredits.findUnique({
      where: { tenantId },
    });

    if (!companyCredits) {
      return null;
    }

    return new CompanyCreditsEntity(
      companyCredits.id,
      companyCredits.tenantId,
      companyCredits.totalPurchased,
      companyCredits.currentBalance,
      companyCredits.lastPurchaseAt,
      companyCredits.createdAt,
      companyCredits.updatedAt,
    );
  }

  async save(
    companyCredits: CompanyCreditsEntity,
  ): Promise<CompanyCreditsEntity> {
    const updated = await this.prisma.client.companyCredits.update({
      where: { id: companyCredits.getId() },
      data: {
        totalPurchased: companyCredits.getTotalPurchased(),
        currentBalance: companyCredits.getCurrentBalance(),
        lastPurchaseAt: companyCredits.getLastPurchaseAt(),
        updatedAt: new Date(),
      },
    });

    return new CompanyCreditsEntity(
      updated.id,
      updated.tenantId,
      updated.totalPurchased,
      updated.currentBalance,
      updated.lastPurchaseAt,
      updated.createdAt,
      updated.updatedAt,
    );
  }

  async create(
    companyCredits: CompanyCreditsEntity,
  ): Promise<CompanyCreditsEntity> {
    const created = await this.prisma.client.companyCredits.create({
      data: {
        tenantId: companyCredits.getTenantId(),
        totalPurchased: companyCredits.getTotalPurchased(),
        currentBalance: companyCredits.getCurrentBalance(),
        lastPurchaseAt: companyCredits.getLastPurchaseAt(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return new CompanyCreditsEntity(
      created.id,
      created.tenantId,
      created.totalPurchased,
      created.currentBalance,
      created.lastPurchaseAt,
      created.createdAt,
      created.updatedAt,
    );
  }
}
