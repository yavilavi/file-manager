/**
 * File Manager - Role Mapper
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */

import { Injectable } from '@nestjs/common';
import { BaseRelationalMapper } from './base-mapper';
import { IRole, IRoleWithPermissions, ICreateRoleData, IPermission } from '@shared/interfaces';
import { Role as PrismaRole } from '@prisma/client';

/**
 * Role DTO for API responses
 */
export interface RoleDto {
  id: number;
  name: string;
  description: string | null;
  isAdmin: boolean;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
  permissions?: IPermission[];
}

/**
 * Role creation DTO
 */
export interface CreateRoleDto {
  name: string;
  description?: string | null;
  tenantId: string;
  isAdmin?: boolean;
  permissionIds?: string[];
}

/**
 * Prisma Role with relations type
 */
type PrismaRoleWithRelations = PrismaRole & {
  rolePermissions?: Array<{
    permission: {
      id: string;
      description: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }>;
};

/**
 * Role mapper implementation following SOLID principles
 * Single Responsibility: Only handles Role entity transformations
 * Open/Closed: Can be extended for additional transformation logic
 * Dependency Inversion: Depends on abstractions (BaseMapper)
 */
@Injectable()
export class RoleMapper extends BaseRelationalMapper<
  IRole,
  PrismaRole,
  IRoleWithPermissions,
  RoleDto
> {

  /**
   * Convert from Prisma model to domain entity
   * Following Single Responsibility Principle
   */
  toDomain(persistence: PrismaRole): IRole {
    this.validateRequired<PrismaRole>(
      persistence,
      ['id', 'name', 'tenantId', 'createdAt', 'updatedAt'],
      'Role'
    );

    return {
      id: persistence.id,
      name: persistence.name,
      description: persistence.description,
      isAdmin: persistence.isAdmin,
      tenantId: persistence.tenantId,
      ...this.mapAuditFields(persistence),
      deletedAt: persistence.deletedAt,
    };
  }

  /**
   * Convert from Prisma model with relations to domain entity with relations
   * Following Interface Segregation Principle
   */
  toDomainWithRelations(persistence: PrismaRoleWithRelations): IRoleWithPermissions {
    const baseRole = this.toDomain(persistence);
    
    return {
      ...baseRole,
      permissions: persistence.rolePermissions?.map(rp => ({
        id: rp.permission.id,
        description: rp.permission.description,
        createdAt: rp.permission.createdAt,
        updatedAt: rp.permission.updatedAt,
      })) || [],
    };
  }

  /**
   * Convert from domain entity to Prisma model
   * Following Single Responsibility Principle
   */
  toPersistence(domain: IRole): Omit<PrismaRole, 'id' | 'createdAt' | 'updatedAt'> {
    return this.cleanObject({
      name: domain.name,
      description: domain.description,
      isAdmin: domain.isAdmin,
      tenantId: domain.tenantId,
      deletedAt: domain.deletedAt,
    });
  }

  /**
   * Convert from domain entity to DTO
   * Following Single Responsibility Principle
   */
  toDto(domain: IRole): RoleDto {
    return {
      id: domain.id,
      name: domain.name,
      description: domain.description,
      isAdmin: domain.isAdmin,
      tenantId: domain.tenantId,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  /**
   * Convert from domain entity with relations to DTO
   * Following Interface Segregation Principle
   */
  toDtoWithPermissions(domain: IRoleWithPermissions): RoleDto {
    return {
      ...this.toDto(domain),
      permissions: domain.permissions,
    };
  }

  /**
   * Convert from DTO to domain entity (for creation)
   * Following Single Responsibility Principle
   */
  fromDto(dto: RoleDto): Omit<IRole, 'id' | 'createdAt' | 'updatedAt'> {
    return this.cleanObject({
      name: dto.name,
      description: dto.description,
      isAdmin: dto.isAdmin,
      tenantId: dto.tenantId,
      deletedAt: null,
    });
  }

  /**
   * Convert from CreateRoleDto to domain entity (for creation)
   * Following Single Responsibility Principle
   */
  fromCreateDto(dto: CreateRoleDto): Omit<IRole, 'id' | 'createdAt' | 'updatedAt'> {
    return this.cleanObject({
      name: dto.name,
      description: dto.description || null,
      isAdmin: dto.isAdmin ?? false,
      tenantId: dto.tenantId,
      deletedAt: null,
    });
  }

  /**
   * Convert from ICreateRoleData to domain entity
   * Following Adapter pattern
   */
  fromCreateRoleData(data: ICreateRoleData): Omit<IRole, 'id' | 'createdAt' | 'updatedAt'> {
    return this.cleanObject({
      name: data.name,
      description: data.description || null,
      isAdmin: data.isAdmin ?? false,
      tenantId: data.tenantId,
      deletedAt: null,
    });
  }

  /**
   * Batch convert domain entities with permissions to DTOs
   * Following DRY principle
   */
  toDtoWithPermissionsList(domainList: IRoleWithPermissions[]): RoleDto[] {
    return domainList.map(item => this.toDtoWithPermissions(item));
  }

  /**
   * Create minimal role DTO (for references)
   * Following Interface Segregation Principle
   */
  toMinimalDto(domain: IRole): { id: number; name: string; isAdmin: boolean } {
    return {
      id: domain.id,
      name: domain.name,
      isAdmin: domain.isAdmin,
    };
  }

  /**
   * Create role summary DTO (excludes tenant info)
   * Following Interface Segregation Principle
   */
  toSummaryDto(domain: IRoleWithPermissions): Omit<RoleDto, 'tenantId'> {
    const dto = this.toDtoWithPermissions(domain);
    const { tenantId, ...summaryDto } = dto;
    return summaryDto;
  }
} 