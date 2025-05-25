/**
 * File Manager - roles.service Service
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role, UserRole } from './interfaces/role.interface';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto, tenantId: string): Promise<Role> {
    const { name, description, permissionIds, isAdmin } = createRoleDto;

    const newRole = await this.prisma.client.role.create({
      data: {
        name,
        description,
        isAdmin: isAdmin || false,
        tenantId,
        rolePermissions:
          permissionIds && permissionIds.length > 0
            ? {
                create: permissionIds.map((permissionId) => ({
                  permission: {
                    connect: { id: permissionId },
                  },
                })),
              }
            : undefined,
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    // Transform to match existing interface
    return {
      ...newRole,
      permissions: newRole.rolePermissions?.map((rp) => rp.permission) || [],
    };
  }

  async findAll(tenantId: string): Promise<Role[]> {
    const roles = await this.prisma.client.role.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
        userRoles: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Transform to match existing interface
    return roles.map((role) => ({
      ...role,
      userCount: role.userRoles.length,
      permissions: role.rolePermissions.map((rp) => rp.permission),
    }));
  }

  async findOne(id: number, tenantId: string): Promise<Role> {
    const role = await this.prisma.client.role.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Transform to match existing interface
    return {
      ...role,
      permissions: role.rolePermissions.map((rp) => rp.permission),
    };
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
    tenantId: string,
  ): Promise<Role> {
    // First check if role exists
    await this.findOne(id, tenantId);

    const { name, description, permissionIds, isAdmin } = updateRoleDto;

    // Update role info and permissions if specified
    const updatedRole = await this.prisma.client.role.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(isAdmin !== undefined && { isAdmin }),
        ...(permissionIds !== undefined && {
          rolePermissions: {
            deleteMany: {},
            create: permissionIds.map((permissionId) => ({
              permission: {
                connect: { id: permissionId },
              },
            })),
          },
        }),
        updatedAt: new Date(),
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    // Transform to match existing interface
    return {
      ...updatedRole,
      permissions: updatedRole.rolePermissions.map((rp) => rp.permission),
    };
  }

  async remove(id: number, tenantId: string): Promise<Role> {
    // First check if role exists
    await this.findOne(id, tenantId);

    // Soft delete the role
    const deletedRole = await this.prisma.client.role.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return deletedRole;
  }

  async assignRoleToUser(
    userId: number,
    roleId: number,
    tenantId: string,
  ): Promise<UserRole> {
    // Check if user exists
    const user = await this.prisma.client.user.findFirst({
      where: {
        id: userId,
        tenantId,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if role exists
    const role = await this.prisma.client.role.findFirst({
      where: {
        id: roleId,
        tenantId,
        deletedAt: null,
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    // Create role assignment or update if it exists
    return await this.prisma.client.userRole.upsert({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
      update: {
        updatedAt: new Date(),
      },
      create: {
        userId,
        roleId,
      },
    });
  }

  async removeRoleFromUser(
    userId: number,
    roleId: number,
    tenantId: string,
  ): Promise<UserRole> {
    // Check if user exists
    const user = await this.prisma.client.user.findFirst({
      where: {
        id: userId,
        tenantId,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if role exists
    const role = await this.prisma.client.role.findFirst({
      where: {
        id: roleId,
        tenantId,
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    // Remove role assignment
    const deletedUserRole = await this.prisma.client.userRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });

    return deletedUserRole;
  }

  async getUserRoles(userId: number, tenantId: string): Promise<Role[]> {
    // Check if user exists
    const user = await this.prisma.client.user.findFirst({
      where: {
        id: userId,
        tenantId,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Get all roles associated with the user
    const userRoles = await this.prisma.client.userRole.findMany({
      where: {
        userId,
      },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    // Transform to match existing interface
    return userRoles.map((ur) => ({
      ...ur.role,
      permissions: ur.role.rolePermissions.map((rp) => rp.permission),
    }));
  }

  async getRoleUsers(roleId: number, tenantId: string): Promise<any[]> {
    // Check if role exists
    await this.findOne(roleId, tenantId);

    // Get all users with this role
    const userRoles = await this.prisma.client.userRole.findMany({
      where: {
        roleId,
      },
      include: {
        user: {
          include: {
            department: true,
          },
        },
      },
      orderBy: {
        user: {
          name: 'asc',
        },
      },
    });

    // Transform results to proper format
    return userRoles.map((ur) => ({
      id: ur.user.id,
      name: ur.user.name,
      email: ur.user.email,
      isActive: ur.user.isActive,
      createdAt: ur.user.createdAt,
      updatedAt: ur.user.updatedAt,
      department: ur.user.department
        ? {
            id: ur.user.department.id,
            name: ur.user.department.name,
          }
        : null,
    }));
  }
}
