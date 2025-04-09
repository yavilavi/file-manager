import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma/client/prisma.service';
import { CreateDepartmentDto } from '@modules/department/dtos/create-department.dto';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllDepartments(tenantId: string) {
    return this.prisma.client.department.findMany({
      where: { tenantId },
      select: { id: true, name: true, createdAt: true },
    });
  }

  async createDepartment(dto: CreateDepartmentDto, tenantId: string) {
    const exists = await this.prisma.client.department.findFirst({
      where: { name: dto.name, tenantId, deletedAt: null },
    });
    if (exists) {
      throw new ConflictException('Ya hay un departamento con ese nombre');
    }
    return this.prisma.client.department.create({
      data: {
        ...dto,
        tenantId,
      },
      select: { id: true, name: true, createdAt: true },
    });
  }
}
