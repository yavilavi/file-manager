/**
 * File Manager - department.repository.interface Interface
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
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
