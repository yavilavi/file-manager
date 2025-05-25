import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma/prisma.service';

@Injectable()
export class RoleInitializationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates super admin role and assigns it to the initial user
   * This is part of the company initialization process
   */
  async initializeSuperAdminRole(params: {
    tenantId: string;
    userId: number;
    tx?: any; // Prisma transaction client
  }): Promise<void> {
    const { tenantId, userId, tx } = params;
    const client = tx || this.prisma.client;

    // Create super admin role for the tenant
    const superAdminRole = await client.role.create({
      data: {
        name: 'Super Administrador',
        description: 'Rol con acceso completo a todas las funcionalidades del sistema',
        tenantId,
        isAdmin: true,
      },
    });

    // Get all permissions
    const allPermissions = await client.permission.findMany();

    // Assign all permissions to the super admin role
    if (allPermissions.length > 0) {
      const rolePermissions = allPermissions.map((permission: { id: string }) => ({
        roleId: superAdminRole.id,
        permissionId: permission.id,
      }));

      await client.rolePermission.createMany({
        data: rolePermissions,
        skipDuplicates: true,
      });
    }

    // Assign super admin role to the user
    await client.userRole.create({
      data: {
        userId,
        roleId: superAdminRole.id,
      },
    });
  }
} 