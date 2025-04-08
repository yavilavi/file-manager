import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { PrismaService } from '@libs/database/prisma/client/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCompanyDto) {
    return this.prisma.client.company.create({
      data: {
        name: data.name,
        nit: data.nit,
        tenantId: data.tenantId,
        departments: {
          create: data.departments.map((dep) => ({
            name: dep.name,
          })),
        },
      },
      include: {
        departments: true,
      },
    });
  }
}
