/**
 * File Manager - prisma-department.repository Repository
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import { Department } from '../../domain/entities/department.entity';
import { DepartmentRepository } from '../../domain/repositories/department.repository.interface';
import { Department as PrismaDepartment } from '@prisma/client';

@Injectable()
export class PrismaDepartmentRepository implements DepartmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string): Promise<Department[]> {
    const departments = await this.prisma.client.department.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return departments.map((dept) => this.toDomain(dept));
  }

  async findById(id: number, tenantId: string): Promise<Department | null> {
    const department = await this.prisma.client.department.findFirst({
      where: { id, tenantId },
    });

    return department ? this.toDomain(department) : null;
  }

  async findByName(name: string, tenantId: string): Promise<Department | null> {
    const department = await this.prisma.client.department.findFirst({
      where: {
        name: name.trim(),
        tenantId,
      },
    });

    return department ? this.toDomain(department) : null;
  }

  async save(department: Department): Promise<Department> {
    const data = {
      name: department.name,
      tenantId: department.tenantId,
      updatedAt: department.updatedAt,
      deletedAt: department.deletedAt,
    };

    let savedDepartment: PrismaDepartment;

    if (department.id === 0) {
      // Create new department
      savedDepartment = await this.prisma.client.department.create({
        data: {
          ...data,
          createdAt: department.createdAt,
        },
      });
    } else {
      // Update existing department
      savedDepartment = await this.prisma.client.department.update({
        where: { id: department.id },
        data,
      });
    }

    return this.toDomain(savedDepartment);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.client.department.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async existsByName(
    name: string,
    tenantId: string,
    excludeId?: number,
  ): Promise<boolean> {
    const whereCondition: {
      name: string;
      tenantId: string;
      deletedAt: null;
      id?: { not: number };
    } = {
      name: name.trim(),
      tenantId,
      deletedAt: null,
    };

    if (excludeId) {
      whereCondition.id = { not: excludeId };
    }

    const count = await this.prisma.client.department.count({
      where: whereCondition,
    });

    return count > 0;
  }

  private toDomain(prismaData: PrismaDepartment): Department {
    return Department.reconstitute(
      prismaData.id,
      prismaData.name,
      prismaData.tenantId,
      prismaData.createdAt,
      prismaData.updatedAt,
      prismaData.deletedAt,
    );
  }
}
