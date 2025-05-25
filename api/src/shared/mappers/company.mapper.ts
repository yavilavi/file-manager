/**
 * File Manager - Company Mapper
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */

import { Injectable } from '@nestjs/common';
import { BaseRelationalMapper } from './base-mapper';
import { ICompany, ICompanyWithRelations, ICreateCompanyData } from '@shared/interfaces';
import { Company as PrismaCompany } from '@prisma/client';

/**
 * Company DTO for API responses
 */
export interface CompanyDto {
  id: number;
  name: string;
  nit: string;
  tenantId: string;
  canSendEmail: boolean;
  createdAt: Date;
  updatedAt: Date;
  departments?: Array<{ id: number; name: string }>;
  _count?: {
    users: number;
    departments: number;
    files: number;
  };
}

/**
 * Company mapper implementation following SOLID principles
 */
@Injectable()
export class CompanyMapper extends BaseRelationalMapper<
  ICompany,
  PrismaCompany,
  ICompanyWithRelations,
  CompanyDto
> {

  /**
   * Convert from Prisma model to domain entity
   */
  toDomain(persistence: PrismaCompany): ICompany {
    this.validateRequired<PrismaCompany>(
      persistence,
      ['id', 'name', 'nit', 'tenantId', 'createdAt', 'updatedAt'],
      'Company'
    );

    return {
      id: persistence.id,
      name: persistence.name,
      nit: persistence.nit,
      tenantId: persistence.tenantId,
      canSendEmail: persistence.canSendEmail,
      ...this.mapAuditFields(persistence),
      deletedAt: persistence.deletedAt,
    };
  }

  /**
   * Convert from Prisma model with relations to domain entity with relations
   */
  toDomainWithRelations(persistence: any): ICompanyWithRelations {
    const baseCompany = this.toDomain(persistence);
    
    return {
      ...baseCompany,
      departments: persistence.departments?.map((dept: any) => ({
        id: dept.id,
        name: dept.name,
        tenantId: dept.tenantId,
        createdAt: dept.createdAt,
        updatedAt: dept.updatedAt,
        deletedAt: dept.deletedAt,
      })) || [],
      users: persistence.users || [],
      _count: persistence._count,
    };
  }

  /**
   * Convert from domain entity to Prisma model
   */
  toPersistence(domain: ICompany): Omit<PrismaCompany, 'id' | 'createdAt' | 'updatedAt'> {
    return this.cleanObject({
      name: domain.name,
      nit: domain.nit,
      tenantId: domain.tenantId,
      canSendEmail: domain.canSendEmail,
      deletedAt: domain.deletedAt,
    });
  }

  /**
   * Convert from domain entity to DTO
   */
  toDto(domain: ICompany): CompanyDto {
    return {
      id: domain.id,
      name: domain.name,
      nit: domain.nit,
      tenantId: domain.tenantId,
      canSendEmail: domain.canSendEmail,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  /**
   * Convert from DTO to domain entity (for creation)
   */
  fromDto(dto: CompanyDto): Omit<ICompany, 'id' | 'createdAt' | 'updatedAt'> {
    return this.cleanObject({
      name: dto.name,
      nit: dto.nit,
      tenantId: dto.tenantId,
      canSendEmail: dto.canSendEmail,
      deletedAt: null,
    });
  }

  /**
   * Convert from ICreateCompanyData to domain entity
   */
  fromCreateCompanyData(data: ICreateCompanyData): Omit<ICompany, 'id' | 'createdAt' | 'updatedAt'> {
    return this.cleanObject({
      name: data.name,
      nit: data.nit,
      tenantId: data.tenantId,
      canSendEmail: data.canSendEmail ?? false,
      deletedAt: null,
    });
  }
} 