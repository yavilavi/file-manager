/**
 * File Manager - tenant.repository.interface Interface
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { TenantEntity } from '../entities/tenant.entity';

export const TENANT_REPOSITORY = 'TENANT_REPOSITORY';

export interface ITenantRepository {
  findById(tenantId: string): Promise<TenantEntity | null>;

  findByNit(nit: string): Promise<TenantEntity | null>;

  findAll(): Promise<TenantEntity[]>;

  findActive(): Promise<TenantEntity[]>;

  existsByTenantId(tenantId: string): Promise<boolean>;

  existsByNit(nit: string): Promise<boolean>;

  save(tenant: TenantEntity): Promise<TenantEntity>;

  delete(tenantId: string): Promise<void>;
}
