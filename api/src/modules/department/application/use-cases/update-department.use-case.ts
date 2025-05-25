/**
 * File Manager - Update Department.Use Case
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

export interface UpdateDepartmentCommand {
  id: number;
  name: string;
  tenantId: string;
}

export interface UpdateDepartmentResult {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UpdateDepartmentUseCase {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: DepartmentRepository,
  ) {}

  async execute(
    command: UpdateDepartmentCommand,
  ): Promise<UpdateDepartmentResult> {
    // Find existing department
    const department = await this.departmentRepository.findById(
      command.id,
      command.tenantId,
    );

    if (!department || department.isDeleted) {
      throw new Error('No existe el departamento seleccionado');
    }

    // Business rule: New name must be unique within tenant (excluding current department)
    const nameExists = await this.departmentRepository.existsByName(
      command.name,
      command.tenantId,
      command.id,
    );

    if (nameExists) {
      throw new Error('Ya hay un departamento con ese nombre');
    }

    // Update domain entity
    department.updateName(command.name);

    // Persist changes
    const updatedDepartment = await this.departmentRepository.save(department);

    return {
      id: updatedDepartment.id,
      name: updatedDepartment.name,
      createdAt: updatedDepartment.createdAt,
      updatedAt: updatedDepartment.updatedAt,
    };
  }
}
