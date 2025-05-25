/**
 * File Manager - company-plan-repository.interface Interface
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { CompanyPlan } from '../entities/company-plan.entity';

export const COMPANY_PLAN_REPOSITORY = 'COMPANY_PLAN_REPOSITORY';

export interface ICompanyPlanRepository {
  findAll(): Promise<CompanyPlan[]>;

  findById(id: number): Promise<CompanyPlan | null>;

  findByTenantId(tenantId: string): Promise<CompanyPlan | null>;

  findByPlanId(planId: number): Promise<CompanyPlan[]>;

  findActive(): Promise<CompanyPlan[]>;

  findWithPlan(id: number): Promise<CompanyPlan | null>;

  create(companyPlan: CompanyPlan): Promise<CompanyPlan>;

  update(id: number, companyPlan: Partial<CompanyPlan>): Promise<CompanyPlan>;

  updateStorageUsed(
    tenantId: string,
    storageUsed: bigint,
  ): Promise<CompanyPlan>;

  deactivate(id: number): Promise<void>;
}
