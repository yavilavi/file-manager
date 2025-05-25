/**
 * File Manager - Role Repository Interface
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */

import { IRepository } from './base-repository.interface';
import { ITenantSoftDeletableEntity, IEntityFilters } from './base-entity.interface';
import { IPermission } from './permission-repository.interface';

/**
 * Role entity interface based on Prisma schema
 * Following Single Responsibility Principle (SRP)
 */
export interface IRole extends ITenantSoftDeletableEntity {
  name: string;
  description: string | null;
  isAdmin: boolean;
}

/**
 * Role entity with permissions for read operations
 * Following Interface Segregation Principle (ISP)
 */
export interface IRoleWithPermissions extends IRole {
  permissions?: IPermission[];
}

/**
 * User role relationship interface
 */
export interface IUserRole {
  userId: number;
  roleId: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Role creation data transfer object
 */
export interface ICreateRoleData {
  name: string;
  description?: string | null;
  tenantId: string;
  isAdmin?: boolean;
  permissionIds?: string[];
}

/**
 * Role update data transfer object
 */
export interface IUpdateRoleData {
  name?: string;
  description?: string | null;
  isAdmin?: boolean;
}

/**
 * Role-specific filters
 */
export interface IRoleFilters extends IEntityFilters {
  name?: string;
  isAdmin?: boolean;
  hasPermission?: string;
}

/**
 * Role repository interface following SOLID principles
 * Dependency Inversion Principle (DIP) - depend on abstraction, not concretion
 */
export interface IRoleRepository extends IRepository<IRole, number> {
  /**
   * Find role by name within tenant scope
   * @param name - Role name
   * @param tenantId - Tenant identifier
   * @returns Promise with role or null if not found
   */
  findByName(name: string, tenantId: string): Promise<IRoleWithPermissions | null>;

  /**
   * Find role by ID with permissions
   * @param id - Role ID
   * @param tenantId - Tenant identifier
   * @returns Promise with role or null if not found
   */
  findByIdWithPermissions(id: number, tenantId: string): Promise<IRoleWithPermissions | null>;

  /**
   * Find all roles within tenant scope
   * @param tenantId - Tenant identifier
   * @param filters - Optional filters
   * @param includePermissions - Whether to include permissions
   * @returns Promise with array of roles
   */
  findAllByTenant(tenantId: string, filters?: IRoleFilters, includePermissions?: boolean): Promise<IRoleWithPermissions[]>;

  /**
   * Create a new role
   * @param roleData - Role creation data
   * @returns Promise with created role
   */
  createRole(roleData: ICreateRoleData): Promise<IRoleWithPermissions>;

  /**
   * Update role by ID within tenant scope
   * @param id - Role ID
   * @param tenantId - Tenant identifier
   * @param updates - Role update data
   * @returns Promise with updated role or null if not found
   */
  updateRole(id: number, tenantId: string, updates: IUpdateRoleData): Promise<IRoleWithPermissions | null>;

  /**
   * Soft delete role by ID within tenant scope
   * @param id - Role ID
   * @param tenantId - Tenant identifier
   * @returns Promise indicating success
   */
  softDelete(id: number, tenantId: string): Promise<boolean>;

  /**
   * Check if role name exists within tenant
   * @param name - Role name to check
   * @param tenantId - Tenant identifier
   * @param excludeRoleId - Optional role ID to exclude from check
   * @returns Promise with boolean indicating existence
   */
  nameExists(name: string, tenantId: string, excludeRoleId?: number): Promise<boolean>;

  /**
   * Add permissions to role
   * @param roleId - Role ID
   * @param permissionIds - Array of permission IDs
   * @returns Promise indicating success
   */
  addPermissions(roleId: number, permissionIds: string[]): Promise<boolean>;

  /**
   * Remove permissions from role
   * @param roleId - Role ID
   * @param permissionIds - Array of permission IDs
   * @returns Promise indicating success
   */
  removePermissions(roleId: number, permissionIds: string[]): Promise<boolean>;

  /**
   * Replace all permissions for a role
   * @param roleId - Role ID
   * @param permissionIds - Array of permission IDs
   * @returns Promise indicating success
   */
  setPermissions(roleId: number, permissionIds: string[]): Promise<boolean>;

  /**
   * Find roles assigned to a user
   * @param userId - User ID
   * @param tenantId - Tenant identifier
   * @returns Promise with array of roles
   */
  findUserRoles(userId: number, tenantId: string): Promise<IRoleWithPermissions[]>;

  /**
   * Find users assigned to a role
   * @param roleId - Role ID
   * @param tenantId - Tenant identifier
   * @returns Promise with array of simplified user objects
   */
  findRoleUsers(roleId: number, tenantId: string): Promise<any[]>;

  /**
   * Assign role to user
   * @param userId - User ID
   * @param roleId - Role ID
   * @returns Promise indicating success
   */
  assignUserRole(userId: number, roleId: number): Promise<boolean>;

  /**
   * Remove role from user
   * @param userId - User ID
   * @param roleId - Role ID
   * @returns Promise indicating success
   */
  removeUserRole(userId: number, roleId: number): Promise<boolean>;

  /**
   * Replace all roles for a user
   * @param userId - User ID
   * @param roleIds - Array of role IDs
   * @returns Promise indicating success
   */
  setUserRoles(userId: number, roleIds: number[]): Promise<boolean>;
} 