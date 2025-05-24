import { Inject, Injectable } from '@nestjs/common';
import { Department } from '../../domain/entities/department.entity';
import {
  DepartmentRepository,
  DEPARTMENT_REPOSITORY,
} from '../../domain/repositories/department.repository.interface';

export interface CreateDepartmentCommand {
  name: string;
  tenantId: string;
}

export interface CreateDepartmentResult {
  id: number;
  name: string;
  createdAt: Date;
}

@Injectable()
export class CreateDepartmentUseCase {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: DepartmentRepository,
  ) {}

  async execute(
    command: CreateDepartmentCommand,
  ): Promise<CreateDepartmentResult> {
    // Business rule: Department name must be unique within tenant
    const existingDepartment = await this.departmentRepository.findByName(
      command.name,
      command.tenantId,
    );

    if (existingDepartment && !existingDepartment.isDeleted) {
      throw new Error('Ya hay un departamento con ese nombre');
    }

    // Create domain entity
    const department = Department.create(command.name, command.tenantId);

    // Persist
    const savedDepartment = await this.departmentRepository.save(department);

    // Return result
    return {
      id: savedDepartment.id,
      name: savedDepartment.name,
      createdAt: savedDepartment.createdAt,
    };
  }
}
