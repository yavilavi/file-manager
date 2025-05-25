/**
 * File Manager - Prisma Company Repository Implementation
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
  ICompanyRepository,
  ICompany,
  ICompanyWithRelations,
  ICreateCompanyData,
  IUpdateCompanyData,
  ICompanyFilters,
} from '@shared/interfaces/company-repository.interface';
import { CompanyMapper } from '@shared/mappers/company.mapper';

/**
 * Prisma implementation of Company Repository
 * Following Dependency Inversion Principle (DIP)
 */
@Injectable()
export class PrismaCompanyRepository implements ICompanyRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly companyMapper: CompanyMapper,
  ) {}

  async findById(id: number): Promise<ICompany | null> {
    const company = await this.prisma.client.company.findFirst({
      where: { id, deletedAt: null },
    });

    return company ? this.companyMapper.toDomain(company) : null;
  }

  async findByTenantId(
    tenantId: string,
  ): Promise<ICompanyWithRelations | null> {
    const company = await this.prisma.client.company.findFirst({
      where: { tenantId, deletedAt: null },
      include: {
        departments: {
          where: { deletedAt: null },
          orderBy: { name: 'asc' },
        },
        _count: {
          select: {
            users: { where: { deletedAt: null } },
            departments: { where: { deletedAt: null } },
            files: { where: { deletedAt: null } },
          },
        },
      },
    });

    return company ? this.companyMapper.toDomainWithRelations(company) : null;
  }

  async findByNit(nit: string): Promise<ICompanyWithRelations | null> {
    const company = await this.prisma.client.company.findFirst({
      where: { nit, deletedAt: null },
      include: {
        departments: {
          where: { deletedAt: null },
          orderBy: { name: 'asc' },
        },
        _count: {
          select: {
            users: { where: { deletedAt: null } },
            departments: { where: { deletedAt: null } },
            files: { where: { deletedAt: null } },
          },
        },
      },
    });

    return company ? this.companyMapper.toDomainWithRelations(company) : null;
  }

  async findByIdWithRelations(
    id: number,
    includeRelations = true,
  ): Promise<ICompanyWithRelations | null> {
    const company = await this.prisma.client.company.findFirst({
      where: { id, deletedAt: null },
      include: includeRelations
        ? {
            departments: {
              where: { deletedAt: null },
              orderBy: { name: 'asc' },
            },
            _count: {
              select: {
                users: { where: { deletedAt: null } },
                departments: { where: { deletedAt: null } },
                files: { where: { deletedAt: null } },
              },
            },
          }
        : undefined,
    });

    return company ? this.companyMapper.toDomainWithRelations(company) : null;
  }

  async findAll(): Promise<ICompany[]> {
    const companies = await this.prisma.client.company.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });

    return companies.map((company) => this.companyMapper.toDomain(company));
  }

  async findAllWithFilters(
    filters?: ICompanyFilters,
    includeRelations = false,
  ): Promise<ICompanyWithRelations[]> {
    const where: any = { deletedAt: null };

    if (filters) {
      if (filters.name)
        where.name = { contains: filters.name, mode: 'insensitive' };
      if (filters.nit)
        where.nit = { contains: filters.nit, mode: 'insensitive' };
      if (filters.canSendEmail !== undefined)
        where.canSendEmail = filters.canSendEmail;
    }

    const companies = await this.prisma.client.company.findMany({
      where,
      include: includeRelations
        ? {
            departments: {
              where: { deletedAt: null },
              orderBy: { name: 'asc' },
            },
            _count: {
              select: {
                users: { where: { deletedAt: null } },
                departments: { where: { deletedAt: null } },
                files: { where: { deletedAt: null } },
              },
            },
          }
        : undefined,
      orderBy: { name: 'asc' },
    });

    return companies.map((company) =>
      this.companyMapper.toDomainWithRelations(company),
    );
  }

  async createCompany(
    companyData: ICreateCompanyData,
  ): Promise<ICompanyWithRelations> {
    const company = await this.prisma.client.company.create({
      data: {
        name: companyData.name,
        nit: companyData.nit,
        tenantId: companyData.tenantId,
        canSendEmail: companyData.canSendEmail ?? false,
        departments: companyData.departments
          ? {
              create: companyData.departments.map((dept) => ({
                name: dept.name,
              })),
            }
          : undefined,
      },
      include: {
        departments: {
          where: { deletedAt: null },
          orderBy: { name: 'asc' },
        },
        _count: {
          select: {
            users: { where: { deletedAt: null } },
            departments: { where: { deletedAt: null } },
            files: { where: { deletedAt: null } },
          },
        },
      },
    });

    return this.companyMapper.toDomainWithRelations(company);
  }

  async createCompanyWithDepartments(
    companyData: ICreateCompanyData,
  ): Promise<ICompanyWithRelations> {
    return this.createCompany(companyData);
  }

  async create(entity: ICompany): Promise<ICompany> {
    const persistenceData = this.companyMapper.toPersistence(entity);
    const company = await this.prisma.client.company.create({
      data: persistenceData,
    });

    return this.companyMapper.toDomain(company);
  }

  async update(
    id: number,
    entity: Partial<ICompany>,
  ): Promise<ICompany | null> {
    const persistenceData = this.companyMapper.toPersistence(
      entity as ICompany,
    );

    try {
      const company = await this.prisma.client.company.update({
        where: { id },
        data: persistenceData,
      });

      return this.companyMapper.toDomain(company);
    } catch {
      return null;
    }
  }

  async updateCompany(
    id: number,
    updates: IUpdateCompanyData,
  ): Promise<ICompanyWithRelations | null> {
    try {
      const company = await this.prisma.client.company.update({
        where: { id, deletedAt: null },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
        include: {
          departments: {
            where: { deletedAt: null },
            orderBy: { name: 'asc' },
          },
          _count: {
            select: {
              users: { where: { deletedAt: null } },
              departments: { where: { deletedAt: null } },
              files: { where: { deletedAt: null } },
            },
          },
        },
      });

      return this.companyMapper.toDomainWithRelations(company);
    } catch {
      return null;
    }
  }

  async updateByTenantId(
    tenantId: string,
    updates: IUpdateCompanyData,
  ): Promise<ICompanyWithRelations | null> {
    try {
      const company = await this.prisma.client.company.update({
        where: { tenantId, deletedAt: null },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
        include: {
          departments: {
            where: { deletedAt: null },
            orderBy: { name: 'asc' },
          },
          _count: {
            select: {
              users: { where: { deletedAt: null } },
              departments: { where: { deletedAt: null } },
              files: { where: { deletedAt: null } },
            },
          },
        },
      });

      return this.companyMapper.toDomainWithRelations(company);
    } catch {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.client.company.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async softDelete(id: number): Promise<boolean> {
    try {
      await this.prisma.client.company.update({
        where: { id },
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

  async softDeleteByTenantId(tenantId: string): Promise<boolean> {
    try {
      await this.prisma.client.company.update({
        where: { tenantId },
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

  async nitExists(nit: string, excludeCompanyId?: number): Promise<boolean> {
    const where: any = {
      nit,
      deletedAt: null,
    };

    if (excludeCompanyId) where.id = { not: excludeCompanyId };

    const company = await this.prisma.client.company.findFirst({
      where,
      select: { id: true },
    });

    return !!company;
  }

  async tenantIdExists(
    tenantId: string,
    excludeCompanyId?: number,
  ): Promise<boolean> {
    const where: any = {
      tenantId,
      deletedAt: null,
    };

    if (excludeCompanyId) where.id = { not: excludeCompanyId };

    const company = await this.prisma.client.company.findFirst({
      where,
      select: { id: true },
    });

    return !!company;
  }

  async countWithFilters(filters?: ICompanyFilters): Promise<number> {
    const where: any = { deletedAt: null };

    if (filters) {
      if (filters.name)
        where.name = { contains: filters.name, mode: 'insensitive' };
      if (filters.nit)
        where.nit = { contains: filters.nit, mode: 'insensitive' };
      if (filters.canSendEmail !== undefined)
        where.canSendEmail = filters.canSendEmail;
    }

    return await this.prisma.client.company.count({ where });
  }

  async findActive(): Promise<ICompanyWithRelations[]> {
    const companies = await this.prisma.client.company.findMany({
      where: { deletedAt: null },
      include: {
        departments: {
          where: { deletedAt: null },
          orderBy: { name: 'asc' },
        },
        _count: {
          select: {
            users: { where: { deletedAt: null } },
            departments: { where: { deletedAt: null } },
            files: { where: { deletedAt: null } },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return companies.map((company) =>
      this.companyMapper.toDomainWithRelations(company),
    );
  }

  async search(
    searchTerm: string,
    limit = 10,
  ): Promise<ICompanyWithRelations[]> {
    const companies = await this.prisma.client.company.findMany({
      where: {
        deletedAt: null,
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { nit: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        departments: {
          where: { deletedAt: null },
          orderBy: { name: 'asc' },
        },
        _count: {
          select: {
            users: { where: { deletedAt: null } },
            departments: { where: { deletedAt: null } },
            files: { where: { deletedAt: null } },
          },
        },
      },
      orderBy: { name: 'asc' },
      take: limit,
    });

    return companies.map((company) =>
      this.companyMapper.toDomainWithRelations(company),
    );
  }

  async getCompanyStats(companyId: number): Promise<{
    usersCount: number;
    departmentsCount: number;
    filesCount: number;
    activeUsersCount: number;
  }> {
    const company = await this.prisma.client.company.findFirst({
      where: { id: companyId, deletedAt: null },
      include: {
        _count: {
          select: {
            users: { where: { deletedAt: null } },
            departments: { where: { deletedAt: null } },
            files: { where: { deletedAt: null } },
          },
        },
      },
    });

    if (!company) {
      return {
        usersCount: 0,
        departmentsCount: 0,
        filesCount: 0,
        activeUsersCount: 0,
      };
    }

    const activeUsersCount = await this.prisma.client.user.count({
      where: {
        tenantId: company.tenantId,
        isActive: true,
        deletedAt: null,
      },
    });

    return {
      usersCount: company._count.users,
      departmentsCount: company._count.departments,
      filesCount: company._count.files,
      activeUsersCount,
    };
  }

  async toggleEmailCapability(
    tenantId: string,
    canSendEmail: boolean,
  ): Promise<ICompanyWithRelations | null> {
    try {
      const company = await this.prisma.client.company.update({
        where: { tenantId, deletedAt: null },
        data: {
          canSendEmail,
          updatedAt: new Date(),
        },
        include: {
          departments: {
            where: { deletedAt: null },
            orderBy: { name: 'asc' },
          },
          _count: {
            select: {
              users: { where: { deletedAt: null } },
              departments: { where: { deletedAt: null } },
              files: { where: { deletedAt: null } },
            },
          },
        },
      });

      return this.companyMapper.toDomainWithRelations(company);
    } catch {
      return null;
    }
  }

  async exists(id: number): Promise<boolean> {
    const company = await this.prisma.client.company.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    return !!company;
  }

  async count(filters?: Record<string, any>): Promise<number> {
    const where: any = { deletedAt: null };
    if (filters) {
      Object.assign(where, filters);
    }

    return await this.prisma.client.company.count({ where });
  }
}
