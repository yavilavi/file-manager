/**
 * File Manager - Get All Departments.Use Case
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Inject, Injectable } from '@nestjs/common';
import {
  DepartmentRepository,
  DEPARTMENT_REPOSITORY,
} from '../../domain/repositories/department.repository.interface';

export interface GetAllDepartmentsQuery {
  tenantId: string;
}

export interface DepartmentSummary {
  id: number;
  name: string;
  createdAt: Date;
}

@Injectable()
export class GetAllDepartmentsUseCase {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: DepartmentRepository,
  ) {}

  async execute(query: GetAllDepartmentsQuery): Promise<DepartmentSummary[]> {
    const departments = await this.departmentRepository.findAll(query.tenantId);

    return departments
      .filter((department) => !department.isDeleted)
      .map((department) => ({
        id: department.id,
        name: department.name,
        createdAt: department.createdAt,
      }));
  }
}
