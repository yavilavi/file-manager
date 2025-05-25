/**
 * File Manager - Delete Department.Use Case
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
import { DepartmentDomainService } from '../../domain/services/department-domain.service';

export interface DeleteDepartmentCommand {
  id: number;
  tenantId: string;
}

@Injectable()
export class DeleteDepartmentUseCase {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: DepartmentRepository,
    private readonly departmentDomainService: DepartmentDomainService,
  ) {}

  async execute(command: DeleteDepartmentCommand): Promise<void> {
    // Check if department can be deleted using domain service
    const deletionValidation =
      await this.departmentDomainService.canDeleteDepartment(
        command.id,
        command.tenantId,
      );

    if (!deletionValidation.canDelete) {
      throw new Error(
        deletionValidation.reason || 'No se puede eliminar el departamento',
      );
    }

    // Find existing department
    const department = await this.departmentRepository.findById(
      command.id,
      command.tenantId,
    );

    if (!department || department.isDeleted) {
      throw new Error('No existe el departamento seleccionado');
    }

    // Mark as deleted (soft delete)
    department.markAsDeleted();

    // Persist changes
    await this.departmentRepository.save(department);
  }
}
