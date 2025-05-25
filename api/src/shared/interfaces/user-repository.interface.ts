/**
 * File Manager - User Repository Interface
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */

import { IRepository } from './base-repository.interface';
import { ITenantSoftDeletableEntity, IEntityFilters } from './base-entity.interface';

/**
 * User entity interface based on Prisma schema
 * Following Single Responsibility Principle (SRP)
 */
export interface IUser extends ITenantSoftDeletableEntity {
  name: string;
  email: string;
  password: string;
  departmentId: number | null;
  isActive: boolean;
}

/**
 * User entity with relations for read operations
 * Following Interface Segregation Principle (ISP)
 */
export interface IUserWithRelations extends Omit<IUser, 'password'> {
  department?: {
    id: number;
    name: string;
  } | null;
  company?: {
    id: number;
    name: string;
    nit: string;
    tenantId: string;
    canSendEmail: boolean;
  } | null;
}

/**
 * User creation data transfer object
 */
export interface ICreateUserData {
  name: string;
  email: string;
  password: string;
  tenantId: string;
  departmentId: number | null;
  isActive?: boolean;
}

/**
 * User update data transfer object
 */
export interface IUpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  departmentId?: number | null;
  isActive?: boolean;
}

/**
 * User-specific filters
 */
export interface IUserFilters extends IEntityFilters {
  email?: string;
  departmentId?: number;
  name?: string;
  isActive?: boolean;
}

/**
 * User repository interface following SOLID principles
 * Dependency Inversion Principle (DIP) - depend on abstraction, not concretion
 */
export interface IUserRepository extends IRepository<IUser, number> {
  /**
   * Find user by email within tenant scope
   * @param email - User email address
   * @param tenantId - Tenant identifier
   * @param includePassword - Whether to include password in result
   * @returns Promise with user or null if not found
   */
  findByEmail(email: string, tenantId?: string, includePassword?: boolean): Promise<IUserWithRelations | null>;

  /**
   * Find user by ID within tenant scope with relations
   * @param id - User ID
   * @param tenantId - Tenant identifier
   * @param includePassword - Whether to include password in result
   * @returns Promise with user or null if not found
   */
  findByIdWithRelations(id: number, tenantId?: string, includePassword?: boolean): Promise<IUserWithRelations | null>;

  /**
   * Find all users within tenant scope
   * @param tenantId - Tenant identifier
   * @param filters - Optional filters
   * @param includePassword - Whether to include password in results
   * @returns Promise with array of users
   */
  findAllByTenant(tenantId: string, filters?: IUserFilters, includePassword?: boolean): Promise<IUserWithRelations[]>;

  /**
   * Create a new user
   * @param userData - User creation data
   * @returns Promise with created user (without password)
   */
  createUser(userData: ICreateUserData): Promise<IUserWithRelations>;

  /**
   * Update user by ID within tenant scope
   * @param id - User ID
   * @param tenantId - Tenant identifier
   * @param updates - User update data
   * @param includePassword - Whether to include password in result
   * @returns Promise with updated user or null if not found
   */
  updateUser(id: number, tenantId: string, updates: IUpdateUserData, includePassword?: boolean): Promise<IUserWithRelations | null>;

  /**
   * Soft delete user by ID within tenant scope
   * @param id - User ID
   * @param tenantId - Tenant identifier
   * @returns Promise indicating success
   */
  softDelete(id: number, tenantId: string): Promise<boolean>;

  /**
   * Check if email exists within tenant or globally
   * @param email - Email to check
   * @param tenantId - Optional tenant scope
   * @param excludeUserId - Optional user ID to exclude from check
   * @returns Promise with boolean indicating existence
   */
  emailExists(email: string, tenantId?: string, excludeUserId?: number): Promise<boolean>;

  /**
   * Count active users within tenant
   * @param tenantId - Tenant identifier
   * @returns Promise with count
   */
  countActiveByTenant(tenantId: string): Promise<number>;
} 