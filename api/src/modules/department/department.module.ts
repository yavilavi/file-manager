/**
 * File Manager - department.module Module
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Module } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma/prisma.service';

// Infrastructure
import { DepartmentController } from './infrastructure/controllers/department.controller';
import { PrismaDepartmentRepository } from './infrastructure/repositories/prisma-department.repository';

// Application Use Cases
import { CreateDepartmentUseCase } from './application/use-cases/create-department.use-case';
import { GetAllDepartmentsUseCase } from './application/use-cases/get-all-departments.use-case';
import { UpdateDepartmentUseCase } from './application/use-cases/update-department.use-case';
import { DeleteDepartmentUseCase } from './application/use-cases/delete-department.use-case';

// Domain
import { DEPARTMENT_REPOSITORY } from './domain/repositories/department.repository.interface';
import { DepartmentDomainService } from './domain/services/department-domain.service';

@Module({
  controllers: [DepartmentController],
  providers: [
    // Infrastructure
    PrismaService,
    {
      provide: DEPARTMENT_REPOSITORY,
      useClass: PrismaDepartmentRepository,
    },

    // Domain Services
    DepartmentDomainService,

    // Application Use Cases
    CreateDepartmentUseCase,
    GetAllDepartmentsUseCase,
    UpdateDepartmentUseCase,
    DeleteDepartmentUseCase,
  ],
  exports: [
    // Export use cases for other modules that might need them
    CreateDepartmentUseCase,
    GetAllDepartmentsUseCase,
    UpdateDepartmentUseCase,
    DeleteDepartmentUseCase,
  ],
})
export class DepartmentModule {}
