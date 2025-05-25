﻿/**
 * File Manager - company.service Service
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { PrismaService } from '@libs/database/prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCompanyDto) {
    const existingCompany = await this.prisma.client.company.findFirst({
      where: {
        nit: data.nit,
        deletedAt: null,
      },
      select: {
        nit: true,
      },
    });

    if (existingCompany) {
      throw new ConflictException(
        'Ya hay una compaÃ±Ã­a registrada con este NIT',
      );
    }
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
