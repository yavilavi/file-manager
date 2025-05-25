/**
 * File Manager - Permission Mapper
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { Injectable } from '@nestjs/common';
import { BaseMapper } from './base-mapper';
import { IPermission, ICreatePermissionData } from '@shared/interfaces';
import { Permission as PrismaPermission } from '@prisma/client';

/**
 * Permission DTO for API responses
 */
export interface PermissionDto {
  id: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Permission mapper implementation following SOLID principles
 * Single Responsibility: Only handles Permission entity transformations
 */
@Injectable()
export class PermissionMapper extends BaseMapper<
  IPermission,
  PrismaPermission,
  PermissionDto
> {
  /**
   * Convert from Prisma model to domain entity
   */
  toDomain(persistence: PrismaPermission): IPermission {
    this.validateRequired<PrismaPermission>(
      persistence,
      ['id', 'description', 'createdAt', 'updatedAt'],
      'Permission',
    );

    return {
      id: persistence.id,
      description: persistence.description,
      ...this.mapAuditFields(persistence),
    };
  }

  /**
   * Convert from domain entity to Prisma model
   */
  toPersistence(
    domain: IPermission,
  ): Omit<PrismaPermission, 'id' | 'createdAt' | 'updatedAt'> {
    return this.cleanObject({
      description: domain.description,
    });
  }

  /**
   * Convert from domain entity to DTO
   */
  toDto(domain: IPermission): PermissionDto {
    return {
      id: domain.id,
      description: domain.description,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  /**
   * Convert from DTO to domain entity (for creation)
   */
  fromDto(
    dto: PermissionDto,
  ): Omit<IPermission, 'id' | 'createdAt' | 'updatedAt'> {
    return this.cleanObject({
      description: dto.description,
    });
  }

  /**
   * Convert from ICreatePermissionData to domain entity
   */
  fromCreatePermissionData(
    data: ICreatePermissionData,
  ): Omit<IPermission, 'createdAt' | 'updatedAt'> {
    return this.cleanObject({
      id: data.id,
      description: data.description,
    });
  }

  /**
   * Extract resource from permission ID
   */
  extractResource(permissionId: string): string {
    const parts = permissionId.split(':');
    return parts[0] || '';
  }

  /**
   * Extract action from permission ID
   */
  extractAction(permissionId: string): string {
    const parts = permissionId.split(':');
    return parts[1] || '';
  }

  /**
   * Validate permission ID format
   */
  validatePermissionFormat(permissionId: string): boolean {
    const pattern = /^[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+$/;
    return pattern.test(permissionId);
  }
}
