/**
 * File Manager - Prisma Permission Repository Implementation
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import {
  IPermissionRepository,
  IPermission,
  ICreatePermissionData,
  IUpdatePermissionData,
  IPermissionFilters,
} from '@shared/interfaces/permission-repository.interface';
import { PermissionMapper } from '@shared/mappers/permission.mapper';

/**
 * Prisma implementation of Permission Repository
 * Following Dependency Inversion Principle (DIP)
 */
@Injectable()
export class PrismaPermissionRepository implements IPermissionRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionMapper: PermissionMapper,
  ) {}

  async findById(id: string): Promise<IPermission | null> {
    const permission = await this.prisma.client.permission.findUnique({
      where: { id },
    });

    return permission ? this.permissionMapper.toDomain(permission) : null;
  }

  async findAll(): Promise<IPermission[]> {
    const permissions = await this.prisma.client.permission.findMany({
      orderBy: { id: 'asc' },
    });

    return permissions.map((permission) =>
      this.permissionMapper.toDomain(permission),
    );
  }

  async findByResourceAction(
    resource: string,
    action: string,
  ): Promise<IPermission | null> {
    const id = `${resource}:${action}`;
    return this.findById(id);
  }

  async findByResource(resource: string): Promise<IPermission[]> {
    const permissions = await this.prisma.client.permission.findMany({
      where: {
        id: {
          startsWith: `${resource}:`,
        },
      },
      orderBy: { id: 'asc' },
    });

    return permissions.map((permission) =>
      this.permissionMapper.toDomain(permission),
    );
  }

  async findByAction(action: string): Promise<IPermission[]> {
    const permissions = await this.prisma.client.permission.findMany({
      where: {
        id: {
          endsWith: `:${action}`,
        },
      },
      orderBy: { id: 'asc' },
    });

    return permissions.map((permission) =>
      this.permissionMapper.toDomain(permission),
    );
  }

  async findByPattern(pattern: string): Promise<IPermission[]> {
    // Convert wildcard pattern to SQL LIKE pattern
    const sqlPattern = pattern.replace(/\*/g, '%');

    const permissions = await this.prisma.client.permission.findMany({
      where: {
        id: {
          contains: sqlPattern.replace(/%/g, ''),
          mode: 'insensitive',
        },
      },
      orderBy: { id: 'asc' },
    });

    return permissions.map((permission) =>
      this.permissionMapper.toDomain(permission),
    );
  }

  async findAllWithFilters(
    filters?: IPermissionFilters,
  ): Promise<IPermission[]> {
    const where: any = {};

    if (filters) {
      if (filters.resource) {
        where.id = { startsWith: `${filters.resource}:` };
      }
      if (filters.action) {
        where.id = { endsWith: `:${filters.action}` };
      }
      if (filters.description) {
        where.description = {
          contains: filters.description,
          mode: 'insensitive',
        };
      }
      if (filters.idPattern) {
        const sqlPattern = filters.idPattern.replace(/\*/g, '%');
        where.id = {
          contains: sqlPattern.replace(/%/g, ''),
          mode: 'insensitive',
        };
      }
    }

    const permissions = await this.prisma.client.permission.findMany({
      where,
      orderBy: { id: 'asc' },
    });

    return permissions.map((permission) =>
      this.permissionMapper.toDomain(permission),
    );
  }

  async createPermission(
    permissionData: ICreatePermissionData,
  ): Promise<IPermission> {
    const permission = await this.prisma.client.permission.create({
      data: {
        id: permissionData.id,
        description: permissionData.description,
      },
    });

    return this.permissionMapper.toDomain(permission);
  }

  async create(entity: IPermission): Promise<IPermission> {
    const persistenceData = this.permissionMapper.toPersistence(entity);
    const permission = await this.prisma.client.permission.create({
      data: {
        id: entity.id,
        ...persistenceData,
      },
    });

    return this.permissionMapper.toDomain(permission);
  }

  async update(
    id: string,
    entity: Partial<IPermission>,
  ): Promise<IPermission | null> {
    try {
      const permission = await this.prisma.client.permission.update({
        where: { id },
        data: {
          description: entity.description,
          updatedAt: new Date(),
        },
      });

      return this.permissionMapper.toDomain(permission);
    } catch {
      return null;
    }
  }

  async updatePermission(
    id: string,
    updates: IUpdatePermissionData,
  ): Promise<IPermission | null> {
    try {
      const permission = await this.prisma.client.permission.update({
        where: { id },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
      });

      return this.permissionMapper.toDomain(permission);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.client.permission.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async deletePermission(id: string): Promise<boolean> {
    return this.delete(id);
  }

  validatePermissionFormat(id: string): boolean {
    const pattern = /^[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+$/;
    return pattern.test(id);
  }

  async getUniqueResources(): Promise<string[]> {
    const permissions = await this.prisma.client.permission.findMany({
      select: { id: true },
    });

    const resources = new Set<string>();
    permissions.forEach((permission) => {
      const parts = permission.id.split(':');
      if (parts.length >= 2) {
        resources.add(parts[0]);
      }
    });

    return Array.from(resources).sort();
  }

  async getUniqueActions(): Promise<string[]> {
    const permissions = await this.prisma.client.permission.findMany({
      select: { id: true },
    });

    const actions = new Set<string>();
    permissions.forEach((permission) => {
      const parts = permission.id.split(':');
      if (parts.length >= 2) {
        actions.add(parts[1]);
      }
    });

    return Array.from(actions).sort();
  }

  async bulkCreate(
    permissions: ICreatePermissionData[],
  ): Promise<IPermission[]> {
    const createdPermissions = await this.prisma.client.$transaction(
      permissions.map((permissionData) =>
        this.prisma.client.permission.create({
          data: {
            id: permissionData.id,
            description: permissionData.description,
          },
        }),
      ),
    );

    return createdPermissions.map((permission) =>
      this.permissionMapper.toDomain(permission),
    );
  }

  async findByRoleId(roleId: number): Promise<IPermission[]> {
    const rolePermissions = await this.prisma.client.rolePermission.findMany({
      where: { roleId },
      include: { permission: true },
    });

    return rolePermissions.map((rp) =>
      this.permissionMapper.toDomain(rp.permission),
    );
  }

  async permissionExists(id: string): Promise<boolean> {
    const permission = await this.prisma.client.permission.findUnique({
      where: { id },
      select: { id: true },
    });

    return !!permission;
  }

  async exists(id: string): Promise<boolean> {
    return this.permissionExists(id);
  }

  async count(filters?: Record<string, any>): Promise<number> {
    const where: any = {};
    if (filters) {
      Object.assign(where, filters);
    }

    return await this.prisma.client.permission.count({ where });
  }
}
