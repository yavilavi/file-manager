import { IRepository } from './base-repository.interface';
import { ISoftDeletableEntity, IEntityFilters } from './base-entity.interface';

/**
 * Company entity interface based on Prisma schema
 * Following Single Responsibility Principle (SRP)
 */
export interface ICompany extends ISoftDeletableEntity {
  name: string;
  nit: string; // Tax identification number (unique)
  tenantId: string; // Acts as unique identifier for the company
  canSendEmail: boolean;
}

/**
 * Department interface for company relations
 */
export interface IDepartment {
  id: number;
  name: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * Company entity with relations for read operations
 * Following Interface Segregation Principle (ISP)
 */
export interface ICompanyWithRelations extends ICompany {
  departments?: IDepartment[];
  users?: any[]; // Simplified user representation
  _count?: {
    users: number;
    departments: number;
    files: number;
  };
}

/**
 * Company creation data transfer object
 */
export interface ICreateCompanyData {
  name: string;
  nit: string;
  tenantId: string;
  canSendEmail?: boolean;
  departments?: Array<{
    name: string;
  }>;
}

/**
 * Company update data transfer object
 */
export interface IUpdateCompanyData {
  name?: string;
  canSendEmail?: boolean;
  // Note: nit and tenantId should not be updateable for data integrity
}

/**
 * Company-specific filters
 */
export interface ICompanyFilters extends IEntityFilters {
  name?: string;
  nit?: string;
  canSendEmail?: boolean;
  hasDepartments?: boolean;
  hasUsers?: boolean;
}

/**
 * Company repository interface following SOLID principles
 * Dependency Inversion Principle (DIP) - depend on abstraction, not concretion
 */
export interface ICompanyRepository extends IRepository<ICompany, number> {
  /**
   * Find company by tenant ID
   * @param tenantId - Tenant identifier (unique to company)
   * @returns Promise with company or null if not found
   */
  findByTenantId(tenantId: string): Promise<ICompanyWithRelations | null>;

  /**
   * Find company by NIT (Tax ID)
   * @param nit - Company NIT
   * @returns Promise with company or null if not found
   */
  findByNit(nit: string): Promise<ICompanyWithRelations | null>;

  /**
   * Find company by ID with relations
   * @param id - Company ID
   * @param includeRelations - Whether to include departments and users count
   * @returns Promise with company or null if not found
   */
  findByIdWithRelations(id: number, includeRelations?: boolean): Promise<ICompanyWithRelations | null>;

  /**
   * Find all companies with optional filtering
   * @param filters - Optional filters
   * @param includeRelations - Whether to include related data
   * @returns Promise with array of companies
   */
  findAllWithFilters(filters?: ICompanyFilters, includeRelations?: boolean): Promise<ICompanyWithRelations[]>;

  /**
   * Create a new company with departments
   * @param companyData - Company creation data
   * @returns Promise with created company
   */
  createCompany(companyData: ICreateCompanyData): Promise<ICompanyWithRelations>;

  /**
   * Update company by ID
   * @param id - Company ID
   * @param updates - Company update data
   * @returns Promise with updated company or null if not found
   */
  updateCompany(id: number, updates: IUpdateCompanyData): Promise<ICompanyWithRelations | null>;

  /**
   * Update company by tenant ID
   * @param tenantId - Tenant identifier
   * @param updates - Company update data
   * @returns Promise with updated company or null if not found
   */
  updateByTenantId(tenantId: string, updates: IUpdateCompanyData): Promise<ICompanyWithRelations | null>;

  /**
   * Soft delete company by ID
   * @param id - Company ID
   * @returns Promise indicating success
   */
  softDelete(id: number): Promise<boolean>;

  /**
   * Soft delete company by tenant ID
   * @param tenantId - Tenant identifier
   * @returns Promise indicating success
   */
  softDeleteByTenantId(tenantId: string): Promise<boolean>;

  /**
   * Check if NIT exists
   * @param nit - NIT to check
   * @param excludeCompanyId - Optional company ID to exclude from check
   * @returns Promise with boolean indicating existence
   */
  nitExists(nit: string, excludeCompanyId?: number): Promise<boolean>;

  /**
   * Check if tenant ID exists
   * @param tenantId - Tenant ID to check
   * @param excludeCompanyId - Optional company ID to exclude from check
   * @returns Promise with boolean indicating existence
   */
  tenantIdExists(tenantId: string, excludeCompanyId?: number): Promise<boolean>;

  /**
   * Get companies count by filter criteria
   * @param filters - Optional filters
   * @returns Promise with count
   */
  countWithFilters(filters?: ICompanyFilters): Promise<number>;

  /**
   * Get active companies (not soft deleted)
   * @returns Promise with array of active companies
   */
  findActive(): Promise<ICompanyWithRelations[]>;

  /**
   * Search companies by name or NIT
   * @param searchTerm - Search term
   * @param limit - Optional limit for results
   * @returns Promise with array of matching companies
   */
  search(searchTerm: string, limit?: number): Promise<ICompanyWithRelations[]>;

  /**
   * Get company statistics
   * @param companyId - Company ID
   * @returns Promise with company statistics
   */
  getCompanyStats(companyId: number): Promise<{
    usersCount: number;
    departmentsCount: number;
    filesCount: number;
    activeUsersCount: number;
  }>;

  /**
   * Toggle email sending capability
   * @param tenantId - Tenant identifier
   * @param canSendEmail - New email capability status
   * @returns Promise with updated company
   */
  toggleEmailCapability(tenantId: string, canSendEmail: boolean): Promise<ICompanyWithRelations | null>;
} 