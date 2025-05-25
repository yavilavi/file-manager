/**
 * File Manager - Tenant Repository Interface
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { IRepository } from './base-repository.interface';
import { ISoftDeletableEntity, IEntityFilters } from './base-entity.interface';

/**
 * Tenant entity interface (maps to Company table in database)
 * Following Single Responsibility Principle (SRP)
 * Note: In this system, Tenant is a conceptual entity that maps to Company
 */
export interface ITenant extends ISoftDeletableEntity {
  tenantId: string; // The unique tenant identifier (maps to Company.tenantId)
  name: string; // Company name
  nit: string; // Tax identification number
  canSendEmail: boolean;
}

/**
 * Tenant creation data transfer object
 */
export interface ICreateTenantData {
  tenantId: string;
  name: string;
  nit: string;
  canSendEmail?: boolean;
  // Initial user data for tenant setup
  initialUser?: {
    name: string;
    email: string;
    password: string;
  };
  // Initial department data
  initialDepartments?: Array<{
    name: string;
  }>;
}

/**
 * Tenant update data transfer object
 */
export interface IUpdateTenantData {
  name?: string;
  canSendEmail?: boolean;
  // Note: tenantId and nit should not be updateable for data integrity
}

/**
 * Tenant-specific filters
 */
export interface ITenantFilters extends IEntityFilters {
  name?: string;
  nit?: string;
  canSendEmail?: boolean;
  hasUsers?: boolean;
  isActive?: boolean;
}

/**
 * Tenant with aggregated information
 */
export interface ITenantWithInfo extends ITenant {
  stats?: {
    usersCount: number;
    departmentsCount: number;
    filesCount: number;
    activeUsersCount: number;
    storageUsed?: bigint;
  };
  plan?: {
    id: number;
    name: string;
    storageSize: bigint;
    creditsIncluded: number;
    isActive: boolean;
  };
  credits?: {
    totalPurchased: number;
    currentBalance: number;
    lastPurchaseAt: Date | null;
  };
}

/**
 * Tenant repository interface following SOLID principles
 * Dependency Inversion Principle (DIP) - depend on abstraction, not concretion
 *
 * Note: This interface represents tenant operations that conceptually map to Company operations
 * in the database, but provides a tenant-centric view of the data
 */
export interface ITenantRepository extends IRepository<ITenant, string> {
  /**
   * Find tenant by tenant ID
   * @param tenantId - Tenant identifier
   * @returns Promise with tenant or null if not found
   */
  findByTenantId(tenantId: string): Promise<ITenantWithInfo | null>;

  /**
   * Find tenant by NIT
   * @param nit - Tax identification number
   * @returns Promise with tenant or null if not found
   */
  findByNit(nit: string): Promise<ITenantWithInfo | null>;

  /**
   * Find all tenants with optional filtering
   * @param filters - Optional filters
   * @param includeStats - Whether to include aggregated statistics
   * @returns Promise with array of tenants
   */
  findAllWithFilters(
    filters?: ITenantFilters,
    includeStats?: boolean,
  ): Promise<ITenantWithInfo[]>;

  /**
   * Create a new tenant (company)
   * @param tenantData - Tenant creation data
   * @returns Promise with created tenant
   */
  createTenant(tenantData: ICreateTenantData): Promise<ITenantWithInfo>;

  /**
   * Update tenant by tenant ID
   * @param tenantId - Tenant identifier
   * @param updates - Tenant update data
   * @returns Promise with updated tenant or null if not found
   */
  updateTenant(
    tenantId: string,
    updates: IUpdateTenantData,
  ): Promise<ITenantWithInfo | null>;

  /**
   * Soft delete tenant by tenant ID
   * @param tenantId - Tenant identifier
   * @returns Promise indicating success
   */
  softDeleteTenant(tenantId: string): Promise<boolean>;

  /**
   * Check if tenant ID exists
   * @param tenantId - Tenant ID to check
   * @returns Promise with boolean indicating existence
   */
  tenantExists(tenantId: string): Promise<boolean>;

  /**
   * Check if NIT exists
   * @param nit - NIT to check
   * @param excludeTenantId - Optional tenant ID to exclude from check
   * @returns Promise with boolean indicating existence
   */
  nitExists(nit: string, excludeTenantId?: string): Promise<boolean>;

  /**
   * Get tenant statistics
   * @param tenantId - Tenant identifier
   * @returns Promise with tenant statistics
   */
  getTenantStats(tenantId: string): Promise<{
    usersCount: number;
    departmentsCount: number;
    filesCount: number;
    activeUsersCount: number;
    storageUsed: bigint;
    creditsBalance: number;
  } | null>;

  /**
   * Get active tenants (not soft deleted)
   * @returns Promise with array of active tenants
   */
  findActiveTenants(): Promise<ITenantWithInfo[]>;

  /**
   * Search tenants by name or NIT
   * @param searchTerm - Search term
   * @param limit - Optional limit for results
   * @returns Promise with array of matching tenants
   */
  searchTenants(searchTerm: string, limit?: number): Promise<ITenantWithInfo[]>;

  /**
   * Toggle email capability for tenant
   * @param tenantId - Tenant identifier
   * @param canSendEmail - New email capability status
   * @returns Promise with updated tenant
   */
  toggleEmailCapability(
    tenantId: string,
    canSendEmail: boolean,
  ): Promise<ITenantWithInfo | null>;

  /**
   * Initialize tenant with default data
   * @param tenantId - Tenant identifier
   * @param initData - Initialization data
   * @returns Promise indicating success
   */
  initializeTenant(
    tenantId: string,
    initData: {
      adminUser: {
        name: string;
        email: string;
        password: string;
      };
      departments: string[];
      defaultPermissions?: string[];
    },
  ): Promise<boolean>;

  /**
   * Get tenant by company ID (internal mapping)
   * @param companyId - Company ID from database
   * @returns Promise with tenant or null if not found
   */
  findByCompanyId(companyId: number): Promise<ITenantWithInfo | null>;

  /**
   * Archive tenant (different from soft delete - keeps data but marks as archived)
   * @param tenantId - Tenant identifier
   * @returns Promise indicating success
   */
  archiveTenant(tenantId: string): Promise<boolean>;

  /**
   * Restore archived tenant
   * @param tenantId - Tenant identifier
   * @returns Promise indicating success
   */
  restoreTenant(tenantId: string): Promise<boolean>;
}
