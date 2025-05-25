/**
 * File Manager - tenant-initialization.service Service
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma/prisma.service';

interface InitializeTenantParams {
  tenantId: string;
  initialUserId?: number;
}

@Injectable()
export class TenantInitializationService {
  constructor(private readonly prisma: PrismaService) {}

  async initializeTenant(params: InitializeTenantParams): Promise<void> {
    const { tenantId, initialUserId } = params;

    // Create super admin role for the tenant
    const superAdminRole = await this.createSuperAdminRole(tenantId);

    // Get all permissions
    const allPermissions = await this.getAllPermissions();

    // Assign all permissions to the super admin role
    await this.assignPermissionsToRole(superAdminRole.id, allPermissions);

    // If initial user is provided, assign super admin role to them
    if (initialUserId) {
      await this.assignRoleToUser(initialUserId, superAdminRole.id);
    }
  }

  private async createSuperAdminRole(tenantId: string) {
    return await this.prisma.client.role.create({
      data: {
        name: 'Super Administrador',
        description:
          'Rol con acceso completo a todas las funcionalidades del sistema',
        tenantId,
        isAdmin: true,
      },
    });
  }

  private async getAllPermissions() {
    return await this.prisma.client.permission.findMany();
  }

  private async assignPermissionsToRole(roleId: number, permissions: any[]) {
    const rolePermissions = permissions.map((permission) => ({
      roleId,
      permissionId: permission.id,
    }));

    // Use createMany with skipDuplicates to avoid conflicts
    await this.prisma.client.rolePermission.createMany({
      data: rolePermissions,
      skipDuplicates: true,
    });
  }

  private async assignRoleToUser(userId: number, roleId: number) {
    await this.prisma.client.userRole.upsert({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
      update: {},
      create: {
        userId,
        roleId,
      },
    });
  }

  async createInitialUserForTenant(
    tenantId: string,
    userData: {
      name: string;
      email: string;
      password: string;
    },
  ): Promise<number> {
    const user = await this.prisma.client.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        tenantId,
        isActive: true,
      },
    });

    return user.id;
  }
}
