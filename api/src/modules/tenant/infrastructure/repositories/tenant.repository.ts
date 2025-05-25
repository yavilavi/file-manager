/**
 * File Manager - tenant.repository Repository
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import { TenantEntity } from '../../domain/entities/tenant.entity';
import { ITenantRepository } from '../../domain/repositories/tenant.repository.interface';

@Injectable()
export class TenantRepository implements ITenantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(tenantId: string): Promise<TenantEntity | null> {
    const company = await this.prisma.client.company.findUnique({
      where: {
        tenantId,
        deletedAt: null,
      },
    });

    if (!company) {
      return null;
    }

    return TenantEntity.fromPersistence({
      id: company.tenantId,
      name: company.name,
      nit: company.nit,
      canSendEmail: company.canSendEmail,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      deletedAt: company.deletedAt,
    });
  }

  async findByNit(nit: string): Promise<TenantEntity | null> {
    const company = await this.prisma.client.company.findFirst({
      where: {
        nit,
        deletedAt: null,
      },
    });

    if (!company) {
      return null;
    }

    return TenantEntity.fromPersistence({
      id: company.tenantId,
      name: company.name,
      nit: company.nit,
      canSendEmail: company.canSendEmail,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      deletedAt: company.deletedAt,
    });
  }

  async findAll(): Promise<TenantEntity[]> {
    const companies = await this.prisma.client.company.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return companies.map((company) =>
      TenantEntity.fromPersistence({
        id: company.tenantId,
        name: company.name,
        nit: company.nit,
        canSendEmail: company.canSendEmail,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
        deletedAt: company.deletedAt,
      }),
    );
  }

  async findActive(): Promise<TenantEntity[]> {
    const companies = await this.prisma.client.company.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return companies.map((company) =>
      TenantEntity.fromPersistence({
        id: company.tenantId,
        name: company.name,
        nit: company.nit,
        canSendEmail: company.canSendEmail,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
        deletedAt: company.deletedAt,
      }),
    );
  }

  async existsByTenantId(tenantId: string): Promise<boolean> {
    const count = await this.prisma.client.company.count({
      where: {
        tenantId,
        deletedAt: null,
      },
    });

    return count > 0;
  }

  async existsByNit(nit: string): Promise<boolean> {
    const count = await this.prisma.client.company.count({
      where: {
        nit,
        deletedAt: null,
      },
    });

    return count > 0;
  }

  async save(tenant: TenantEntity): Promise<TenantEntity> {
    const existingCompany = await this.prisma.client.company.findUnique({
      where: { tenantId: tenant.id },
    });

    if (existingCompany) {
      // Update existing tenant
      const updatedCompany = await this.prisma.client.company.update({
        where: { tenantId: tenant.id },
        data: {
          name: tenant.name,
          nit: tenant.nit,
          canSendEmail: tenant.canSendEmail,
          updatedAt: new Date(),
          deletedAt: tenant.deletedAt,
        },
      });

      return TenantEntity.fromPersistence({
        id: updatedCompany.tenantId,
        name: updatedCompany.name,
        nit: updatedCompany.nit,
        canSendEmail: updatedCompany.canSendEmail,
        createdAt: updatedCompany.createdAt,
        updatedAt: updatedCompany.updatedAt,
        deletedAt: updatedCompany.deletedAt,
      });
    } else {
      // Create new tenant
      const createdCompany = await this.prisma.client.company.create({
        data: {
          tenantId: tenant.id,
          name: tenant.name,
          nit: tenant.nit,
          canSendEmail: tenant.canSendEmail,
        },
      });

      return TenantEntity.fromPersistence({
        id: createdCompany.tenantId,
        name: createdCompany.name,
        nit: createdCompany.nit,
        canSendEmail: createdCompany.canSendEmail,
        createdAt: createdCompany.createdAt,
        updatedAt: createdCompany.updatedAt,
        deletedAt: createdCompany.deletedAt,
      });
    }
  }

  async delete(tenantId: string): Promise<void> {
    await this.prisma.client.company.update({
      where: { tenantId },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
