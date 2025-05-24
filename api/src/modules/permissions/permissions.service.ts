import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permission } from './interfaces/permission.interface';

interface CountResult {
  count: string | number;
}

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const result = await this.prisma.client.$queryRaw<Permission[]>`
      INSERT INTO "permission" ("id", "description", "createdAt", "updatedAt")
      VALUES (${createPermissionDto.id}, ${createPermissionDto.description}, NOW(), NOW())
      RETURNING *
    `;
    return result[0];
  }

  async findAll(): Promise<Permission[]> {
    return this.prisma.client.$queryRaw<Permission[]>`
      SELECT * FROM "permission"
      ORDER BY "id" ASC
    `;
  }

  async findById(id: string): Promise<Permission | null> {
    const results = await this.prisma.client.$queryRaw<Permission[]>`
      SELECT * FROM "permission"
      WHERE "id" = ${id}
    `;
    return results[0] || null;
  }

  async findByIds(ids: string[]): Promise<Permission[]> {
    if (ids.length === 0) return [];

    // For simplicity, we'll create a query for each ID and combine results
    const allPermissions: Permission[] = [];
    for (const id of ids) {
      const permissions = await this.prisma.client.$queryRaw<Permission[]>`
        SELECT * FROM "permission"
        WHERE "id" = ${id}
      `;
      allPermissions.push(...permissions);
    }

    return allPermissions;
  }

  async remove(id: string): Promise<Permission> {
    const result = await this.prisma.client.$queryRaw<Permission[]>`
      DELETE FROM "permission"
      WHERE "id" = ${id}
      RETURNING *
    `;
    return result[0];
  }

  async hasPermission(
    userId: number,
    permissionId: string,
    tenantId: string,
  ): Promise<boolean> {
    // First check if user exists and get roles
    const user = await this.prisma.client.user.findFirst({
      where: {
        id: userId,
        tenantId,
      },
    });

    if (!user) {
      return false;
    }

    // Check for admin role with raw query
    const adminRoleResult = await this.prisma.client.$queryRaw<CountResult[]>`
      SELECT COUNT(*) as count
      FROM "user_role" ur
      JOIN "role" r ON ur."roleId" = r."id"
      WHERE ur."userId" = ${userId} AND r."isAdmin" = true AND r."tenantId" = ${tenantId}
    `;

    // If user has admin role, they have all permissions
    if (Number(adminRoleResult[0].count) > 0) {
      return true;
    }

    // Check for specific permission
    const permissionResult = await this.prisma.client.$queryRaw<CountResult[]>`
      SELECT COUNT(*) as count
      FROM "user_role" ur
      JOIN "role_permission" rp ON ur."roleId" = rp."roleId"
      WHERE ur."userId" = ${userId} AND rp."permissionId" = ${permissionId}
    `;

    return Number(permissionResult[0].count) > 0;
  }
}
