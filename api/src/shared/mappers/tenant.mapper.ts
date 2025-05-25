/**
 * File Manager - Tenant Mapper
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */

import { Injectable } from '@nestjs/common';
import { BaseRelationalMapper } from './base-mapper';
import { ITenant, ITenantWithInfo, ICreateTenantData } from '@shared/interfaces';
import { Company as PrismaCompany } from '@prisma/client';

/**
 * Tenant DTO for API responses
 */
export interface TenantDto {
  tenantId: string;
  name: string;
  nit: string;
  canSendEmail: boolean;
  createdAt: Date;
  updatedAt: Date;
  stats?: {
    usersCount: number;
    departmentsCount: number;
    filesCount: number;
    activeUsersCount: number;
    storageUsed?: bigint;
  };
  plan?: {
    id: number;
    name: string;
    storageSize: bigint;
    creditsIncluded: number;
    isActive: boolean;
  };
  credits?: {
    totalPurchased: number;
    currentBalance: number;
    lastPurchaseAt: Date | null;
  };
}

/**
 * Tenant mapper implementation following SOLID principles
 * Maps between Tenant concept and Company persistence model
 */
@Injectable()
export class TenantMapper extends BaseRelationalMapper<
  ITenant,
  PrismaCompany,
  ITenantWithInfo,
  TenantDto
> {

  /**
   * Convert from Prisma Company model to Tenant domain entity
   */
  toDomain(persistence: PrismaCompany): ITenant {
    this.validateRequired<PrismaCompany>(
      persistence,
      ['id', 'name', 'nit', 'tenantId', 'createdAt', 'updatedAt'],
      'Tenant'
    );

    return {
      id: persistence.id,
      tenantId: persistence.tenantId,
      name: persistence.name,
      nit: persistence.nit,
      canSendEmail: persistence.canSendEmail,
      ...this.mapAuditFields(persistence),
      deletedAt: persistence.deletedAt,
    };
  }

  /**
   * Convert from Prisma model with relations to tenant with info
   */
  toDomainWithRelations(persistence: any): ITenantWithInfo {
    const baseTenant = this.toDomain(persistence);
    
    return {
      ...baseTenant,
      stats: persistence._count ? {
        usersCount: persistence._count.users || 0,
        departmentsCount: persistence._count.departments || 0,
        filesCount: persistence._count.files || 0,
        activeUsersCount: persistence._count.activeUsers || 0,
        storageUsed: persistence.companyPlan?.storageUsed || BigInt(0),
      } : undefined,
      plan: persistence.companyPlan?.plan ? {
        id: persistence.companyPlan.plan.id,
        name: persistence.companyPlan.plan.name,
        storageSize: persistence.companyPlan.plan.storageSize,
        creditsIncluded: persistence.companyPlan.plan.creditsIncluded,
        isActive: persistence.companyPlan.plan.isActive,
      } : undefined,
      credits: persistence.credits ? {
        totalPurchased: persistence.credits.totalPurchased,
        currentBalance: persistence.credits.currentBalance,
        lastPurchaseAt: persistence.credits.lastPurchaseAt,
      } : undefined,
    };
  }

  /**
   * Convert from Tenant domain entity to Prisma Company model
   */
  toPersistence(domain: ITenant): Omit<PrismaCompany, 'id' | 'createdAt' | 'updatedAt'> {
    return this.cleanObject({
      name: domain.name,
      nit: domain.nit,
      tenantId: domain.tenantId,
      canSendEmail: domain.canSendEmail,
      deletedAt: domain.deletedAt,
    });
  }

  /**
   * Convert from Tenant domain entity to DTO
   */
  toDto(domain: ITenant): TenantDto {
    return {
      tenantId: domain.tenantId,
      name: domain.name,
      nit: domain.nit,
      canSendEmail: domain.canSendEmail,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  /**
   * Convert from DTO to Tenant domain entity (for creation)
   */
  fromDto(dto: TenantDto): Omit<ITenant, 'id' | 'createdAt' | 'updatedAt'> {
    return this.cleanObject({
      tenantId: dto.tenantId,
      name: dto.name,
      nit: dto.nit,
      canSendEmail: dto.canSendEmail,
      deletedAt: null,
    });
  }

  /**
   * Convert from ICreateTenantData to domain entity
   */
  fromCreateTenantData(data: ICreateTenantData): Omit<ITenant, 'id' | 'createdAt' | 'updatedAt'> {
    return this.cleanObject({
      tenantId: data.tenantId,
      name: data.name,
      nit: data.nit,
      canSendEmail: data.canSendEmail ?? false,
      deletedAt: null,
    });
  }

  /**
   * Convert tenant with info to DTO
   */
  toDtoWithInfo(domain: ITenantWithInfo): TenantDto {
    return {
      ...this.toDto(domain),
      stats: domain.stats,
      plan: domain.plan,
      credits: domain.credits,
    };
  }
} 