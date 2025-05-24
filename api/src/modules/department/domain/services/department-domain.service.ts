import { Inject, Injectable } from '@nestjs/common';
import {
  DepartmentRepository,
  DEPARTMENT_REPOSITORY,
} from '../repositories/department.repository.interface';

@Injectable()
export class DepartmentDomainService {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: DepartmentRepository,
  ) {}

  /**
   * Business rule: Check if department can be safely deleted
   * A department can be deleted if:
   * 1. It exists and is not already deleted
   * 2. It has no active users assigned to it
   * 3. It's not the last department in the tenant (business rule)
   */
  async canDeleteDepartment(
    departmentId: number,
    tenantId: string,
  ): Promise<{
    canDelete: boolean;
    reason?: string;
  }> {
    // Find the department
    const department = await this.departmentRepository.findById(
      departmentId,
      tenantId,
    );

    if (!department || department.isDeleted) {
      return {
        canDelete: false,
        reason: 'Departamento no encontrado o ya eliminado',
      };
    }

    // Check if it's the last department in the tenant
    const allDepartments = await this.departmentRepository.findAll(tenantId);
    const activeDepartments = allDepartments.filter((dept) => !dept.isDeleted);

    if (activeDepartments.length <= 1) {
      return {
        canDelete: false,
        reason: 'No se puede eliminar el último departamento de la empresa',
      };
    }

    // TODO: Add check for users assigned to this department
    // This would require a user repository or a separate domain service
    // For now, we'll allow deletion

    return { canDelete: true };
  }

  /**
   * Business rule: Validate department name uniqueness within tenant
   */
  async isNameUniqueInTenant(
    name: string,
    tenantId: string,
    excludeDepartmentId?: number,
  ): Promise<boolean> {
    return !(await this.departmentRepository.existsByName(
      name,
      tenantId,
      excludeDepartmentId,
    ));
  }

  /**
   * Business rule: Generate suggested name for duplicate departments
   */
  async generateUniqueNameSuggestion(
    baseName: string,
    tenantId: string,
  ): Promise<string> {
    let counter = 1;
    let suggestedName = `${baseName} (${counter})`;

    while (
      await this.departmentRepository.existsByName(suggestedName, tenantId)
    ) {
      counter++;
      suggestedName = `${baseName} (${counter})`;
    }

    return suggestedName;
  }
}
