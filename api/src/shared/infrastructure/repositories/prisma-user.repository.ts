/**
 * File Manager - Prisma User Repository Implementation
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
  IUserRepository,
  IUser,
  IUserWithRelations,
  ICreateUserData,
  IUpdateUserData,
  IUserFilters,
} from '@shared/interfaces/user-repository.interface';
import { UserMapper } from '@shared/mappers/user.mapper';

type UserWithRelationsSelect = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  tenantId: string;
  departmentId: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  password?: string;
  department?: {
    id: number;
    name: string;
  } | null;
  company?: {
    id: number;
    name: string;
    nit: string;
    tenantId: string;
    canSendEmail: boolean;
  } | null;
};

/**
 * Prisma implementation of User Repository
 * Following Dependency Inversion Principle (DIP)
 */
@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userMapper: UserMapper,
  ) {}

  async findById(id: number): Promise<IUser | null> {
    const user = await this.prisma.client.user.findFirst({
      where: { id, deletedAt: null },
    });

    return user ? this.userMapper.toDomain(user) : null;
  }

  async findByEmail(
    email: string,
    tenantId?: string,
    includePassword = false,
  ): Promise<IUserWithRelations | null> {
    const user = await this.prisma.client.user.findFirst({
      where: {
        email: email.toLowerCase(),
        tenantId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        tenantId: true,
        departmentId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        password: includePassword,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            nit: true,
            tenantId: true,
            canSendEmail: true,
          },
        },
      },
    });

    if (!user) return null;

    const result = this.userMapper.toDomainWithRelations(user);
    if (includePassword && user.password) {
      result.password = user.password;
    }
    return result;
  }

  async findUserById(
    id: number,
    tenantId?: string,
  ): Promise<IUserWithRelations | null> {
    const user = await this.prisma.client.user.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        tenantId: true,
        departmentId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        password: false,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            nit: true,
            tenantId: true,
            canSendEmail: true,
          },
        },
      },
    });

    return user ? this.convertToUserWithRelations(user) : null;
  }

  async findByIdWithRelations(
    id: number,
    tenantId?: string,
    includePassword = false,
  ): Promise<IUserWithRelations | null> {
    const user = await this.prisma.client.user.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        tenantId: true,
        departmentId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        password: includePassword,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            nit: true,
            tenantId: true,
            canSendEmail: true,
          },
        },
      },
    });

    if (!user) return null;

    const result = this.userMapper.toDomainWithRelations(user);
    if (includePassword && user.password) {
      result.password = user.password;
    }
    return result;
  }

  async findAllByTenant(
    tenantId: string,
    filters?: IUserFilters,
    includePassword = false,
  ): Promise<IUserWithRelations[]> {
    const where: any = {
      tenantId,
      deletedAt: null,
    };

    if (filters) {
      if (filters.email)
        where.email = { contains: filters.email, mode: 'insensitive' };
      if (filters.name)
        where.name = { contains: filters.name, mode: 'insensitive' };
      if (filters.departmentId) where.departmentId = filters.departmentId;
      if (filters.isActive !== undefined) where.isActive = filters.isActive;
    }

    const users = await this.prisma.client.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        tenantId: true,
        departmentId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        password: includePassword,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            nit: true,
            tenantId: true,
            canSendEmail: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return users.map((user) => {
      const result = this.userMapper.toDomainWithRelations(user);
      if (includePassword && user.password) {
        result.password = user.password;
      }
      return result;
    });
  }

  async findAll(): Promise<IUser[]> {
    const users = await this.prisma.client.user.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });

    return users.map((user) => this.userMapper.toDomain(user));
  }

  async createUser(userData: ICreateUserData): Promise<IUserWithRelations> {
    const user = await this.prisma.client.user.create({
      data: {
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: userData.password,
        tenantId: userData.tenantId,
        departmentId: userData.departmentId,
        isActive: userData.isActive ?? true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        tenantId: true,
        departmentId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        password: false,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            nit: true,
            tenantId: true,
            canSendEmail: true,
          },
        },
      },
    });

    return this.convertToUserWithRelations(user);
  }

  async create(entity: IUser): Promise<IUser> {
    const persistenceData = this.userMapper.toPersistence(entity);
    const user = await this.prisma.client.user.create({
      data: persistenceData,
    });

    return this.userMapper.toDomain(user);
  }

  async update(id: number, entity: Partial<IUser>): Promise<IUser | null> {
    const persistenceData = this.userMapper.toPersistence(entity as IUser);

    try {
      const user = await this.prisma.client.user.update({
        where: { id },
        data: persistenceData,
      });

      return this.userMapper.toDomain(user);
    } catch {
      return null;
    }
  }

  async updateUser(
    id: number,
    tenantId: string,
    updates: IUpdateUserData,
    includePassword = false,
  ): Promise<IUserWithRelations | null> {
    try {
      const user = await this.prisma.client.user.update({
        where: {
          id,
          tenantId,
          deletedAt: null,
        },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          name: true,
          email: true,
          isActive: true,
          tenantId: true,
          departmentId: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          password: includePassword,
          department: {
            select: {
              id: true,
              name: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
              nit: true,
              tenantId: true,
              canSendEmail: true,
            },
          },
        },
      });

      const result = this.userMapper.toDomainWithRelations(user);
      if (includePassword && user.password) {
        result.password = user.password;
      }
      return result;
    } catch {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.client.user.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async softDelete(id: number, tenantId: string): Promise<boolean> {
    try {
      await this.prisma.client.user.update({
        where: {
          id,
          tenantId,
        },
        data: {
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  async emailExists(
    email: string,
    tenantId?: string,
    excludeUserId?: number,
  ): Promise<boolean> {
    const where: any = {
      email: email.toLowerCase(),
      deletedAt: null,
    };

    if (tenantId) where.tenantId = tenantId;
    if (excludeUserId) where.id = { not: excludeUserId };

    const user = await this.prisma.client.user.findFirst({
      where,
      select: { id: true },
    });

    return !!user;
  }

  async countActiveByTenant(tenantId: string): Promise<number> {
    return await this.prisma.client.user.count({
      where: {
        tenantId,
        isActive: true,
        deletedAt: null,
      },
    });
  }

  async exists(id: number): Promise<boolean> {
    const user = await this.prisma.client.user.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    return !!user;
  }

  async count(filters?: Record<string, any>): Promise<number> {
    const where: any = { deletedAt: null };
    if (filters) {
      Object.assign(where, filters);
    }

    return await this.prisma.client.user.count({ where });
  }

  private convertToUserWithRelations(
    user: UserWithRelationsSelect,
    includePassword = false,
  ): IUserWithRelations {
    const result: IUserWithRelations = {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      tenantId: user.tenantId,
      departmentId: user.departmentId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      department: user.department,
      company: user.company,
    };

    if (includePassword && user.password) {
      result.password = user.password;
    }

    return result;
  }
}
