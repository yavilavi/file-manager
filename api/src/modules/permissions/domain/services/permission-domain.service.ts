/**
 * File Manager - Permission Domain Service
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import {
  IPermissionRepository,
  PERMISSION_REPOSITORY,
} from '@shared/interfaces/permission-repository.interface';

/**
 * Permission Domain Service
 * Following Single Responsibility Principle (SRP) - handles permission business logic
 * Following Dependency Inversion Principle (DIP) - depends on abstractions
 */
@Injectable()
export class PermissionDomainService {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Check if a user has a specific permission
   * @param userId - User ID
   * @param permissionId - Permission ID
   * @param tenantId - Tenant ID
   * @returns Promise with boolean indicating if user has permission
   */
  async hasPermission(
    userId: number,
    permissionId: string,
    tenantId: string,
  ): Promise<boolean> {
    // First check if user exists
    const user = await this.prisma.client.user.findFirst({
      where: {
        id: userId,
        tenantId,
        deletedAt: null,
        isActive: true,
      },
    });

    if (!user) {
      return false;
    }

    // Check if user has admin role (admin has all permissions)
    const adminRoleCount = await this.prisma.client.userRole.count({
      where: {
        userId,
        role: {
          isAdmin: true,
          tenantId,
          deletedAt: null,
        },
      },
    });

    if (adminRoleCount > 0) {
      return true;
    }

    // Check for specific permission through role assignments
    const permissionCount = await this.prisma.client.userRole.count({
      where: {
        userId,
        role: {
          tenantId,
          deletedAt: null,
          rolePermissions: {
            some: {
              permissionId,
            },
          },
        },
      },
    });

    return permissionCount > 0;
  }

  /**
   * Check if user has any of the specified permissions
   * @param userId - User ID
   * @param permissionIds - Array of permission IDs
   * @param tenantId - Tenant ID
   * @returns Promise with boolean indicating if user has any permission
   */
  async hasAnyPermission(
    userId: number,
    permissionIds: string[],
    tenantId: string,
  ): Promise<boolean> {
    if (permissionIds.length === 0) return false;

    // Check if user exists and is active
    const user = await this.prisma.client.user.findFirst({
      where: {
        id: userId,
        tenantId,
        deletedAt: null,
        isActive: true,
      },
    });

    if (!user) {
      return false;
    }

    // Check if user has admin role
    const adminRoleCount = await this.prisma.client.userRole.count({
      where: {
        userId,
        role: {
          isAdmin: true,
          tenantId,
          deletedAt: null,
        },
      },
    });

    if (adminRoleCount > 0) {
      return true;
    }

    // Check for any of the specified permissions
    const permissionCount = await this.prisma.client.userRole.count({
      where: {
        userId,
        role: {
          tenantId,
          deletedAt: null,
          rolePermissions: {
            some: {
              permissionId: {
                in: permissionIds,
              },
            },
          },
        },
      },
    });

    return permissionCount > 0;
  }

  /**
   * Get all permissions for a user
   * @param userId - User ID
   * @param tenantId - Tenant ID
   * @returns Promise with array of permission IDs
   */
  async getUserPermissions(
    userId: number,
    tenantId: string,
  ): Promise<string[]> {
    // Check if user has admin role
    const adminRoleCount = await this.prisma.client.userRole.count({
      where: {
        userId,
        role: {
          isAdmin: true,
          tenantId,
          deletedAt: null,
        },
      },
    });

    if (adminRoleCount > 0) {
      // Admin has all permissions
      const allPermissions = await this.permissionRepository.findAll();
      return allPermissions.map((p) => p.id);
    }

    // Get specific permissions through role assignments
    const rolePermissions = await this.prisma.client.rolePermission.findMany({
      where: {
        role: {
          userRoles: {
            some: {
              userId,
            },
          },
          tenantId,
          deletedAt: null,
        },
      },
      select: {
        permissionId: true,
      },
      distinct: ['permissionId'],
    });

    return rolePermissions.map((rp) => rp.permissionId);
  }

  /**
   * Validate permission ID format
   * @param permissionId - Permission ID to validate
   * @returns boolean indicating if format is valid
   */
  validatePermissionFormat(permissionId: string): boolean {
    return this.permissionRepository.validatePermissionFormat(permissionId);
  }

  /**
   * Extract resource from permission ID
   * @param permissionId - Permission ID
   * @returns Resource name
   */
  extractResource(permissionId: string): string {
    const parts = permissionId.split(':');
    return parts[0] || '';
  }

  /**
   * Extract action from permission ID
   * @param permissionId - Permission ID
   * @returns Action name
   */
  extractAction(permissionId: string): string {
    const parts = permissionId.split(':');
    return parts[1] || '';
  }
}
