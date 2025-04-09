import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma/prisma.service';
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

  async updateDepartment(
    id: number,
    dto: CreateDepartmentDto,
    tenantId: string,
  ) {
    const exists = await this.prisma.client.department.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!exists) {
      throw new NotFoundException('No existe el departamento seleccionado');
    }
    return this.prisma.client.department.update({
      where: { id: exists.id },
      data: {
        name: dto.name,
        tenantId,
      },
      select: { id: true, name: true, createdAt: true },
    });
  }
}
