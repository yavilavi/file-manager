import { Department } from '../entities/department.entity';

export const DEPARTMENT_REPOSITORY = Symbol('DEPARTMENT_REPOSITORY');

export interface DepartmentRepository {
  findAll(tenantId: string): Promise<Department[]>;
  findById(id: number, tenantId: string): Promise<Department | null>;
  findByName(name: string, tenantId: string): Promise<Department | null>;
  save(department: Department): Promise<Department>;
  delete(id: number, tenantId: string): Promise<void>;
  existsByName(
    name: string,
    tenantId: string,
    excludeId?: number,
  ): Promise<boolean>;
}
