/**
 * File Manager - Permission Repository Interface
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { IRepository } from './base-repository.interface';
import { IBaseEntity, IEntityFilters } from './base-entity.interface';

/**
 * Permission entity interface based on Prisma schema
 * Following Single Responsibility Principle (SRP)
 * Note: Permissions use string IDs with format <resource>:<action>
 */
export interface IPermission extends Omit<IBaseEntity, 'id'> {
  id: string; // Format: <resource>:<action> (e.g., "users:create", "files:read")
  description: string;
}

/**
 * Permission creation data transfer object
 */
export interface ICreatePermissionData {
  id: string; // Must follow format <resource>:<action>
  description: string;
}

/**
 * Permission update data transfer object
 */
export interface IUpdatePermissionData {
  description?: string;
}

/**
 * Permission-specific filters
 */
export interface IPermissionFilters extends Omit<IEntityFilters, 'tenantId'> {
  resource?: string; // Extract resource from ID (e.g., "users" from "users:create")
  action?: string; // Extract action from ID (e.g., "create" from "users:create")
  description?: string;
  idPattern?: string; // For pattern matching (e.g., "users:*")
}

/**
 * Permission repository interface following SOLID principles
 * Dependency Inversion Principle (DIP) - depend on abstraction, not concretion
 * Note: Permissions are global (not tenant-scoped) but usage is controlled by roles
 */
export interface IPermissionRepository
  extends IRepository<IPermission, string> {
  /**
   * Find permission by resource and action
   * @param resource - Resource name (e.g., "users", "files")
   * @param action - Action name (e.g., "create", "read", "update", "delete")
   * @returns Promise with permission or null if not found
   */
  findByResourceAction(
    resource: string,
    action: string,
  ): Promise<IPermission | null>;

  /**
   * Find all permissions for a specific resource
   * @param resource - Resource name
   * @returns Promise with array of permissions
   */
  findByResource(resource: string): Promise<IPermission[]>;

  /**
   * Find all permissions by action across resources
   * @param action - Action name
   * @returns Promise with array of permissions
   */
  findByAction(action: string): Promise<IPermission[]>;

  /**
   * Find permissions by pattern (e.g., "users:*", "*:read")
   * @param pattern - Pattern to match (supports wildcards)
   * @returns Promise with array of matching permissions
   */
  findByPattern(pattern: string): Promise<IPermission[]>;

  /**
   * Find all permissions with optional filtering
   * @param filters - Optional filters
   * @returns Promise with array of permissions
   */
  findAllWithFilters(filters?: IPermissionFilters): Promise<IPermission[]>;

  /**
   * Create a new permission
   * @param permissionData - Permission creation data
   * @returns Promise with created permission
   */
  createPermission(permissionData: ICreatePermissionData): Promise<IPermission>;

  /**
   * Update permission description
   * @param id - Permission ID (format: <resource>:<action>)
   * @param updates - Permission update data
   * @returns Promise with updated permission or null if not found
   */
  updatePermission(
    id: string,
    updates: IUpdatePermissionData,
  ): Promise<IPermission | null>;

  /**
   * Delete permission (hard delete - use with caution)
   * @param id - Permission ID
   * @returns Promise indicating success
   */
  deletePermission(id: string): Promise<boolean>;

  /**
   * Check if permission ID follows correct format
   * @param id - Permission ID to validate
   * @returns boolean indicating if format is valid
   */
  validatePermissionFormat(id: string): boolean;

  /**
   * Get all unique resources from existing permissions
   * @returns Promise with array of unique resource names
   */
  getUniqueResources(): Promise<string[]>;

  /**
   * Get all unique actions from existing permissions
   * @returns Promise with array of unique action names
   */
  getUniqueActions(): Promise<string[]>;

  /**
   * Bulk create permissions
   * @param permissions - Array of permission data
   * @returns Promise with array of created permissions
   */
  bulkCreate(permissions: ICreatePermissionData[]): Promise<IPermission[]>;

  /**
   * Find permissions assigned to a specific role
   * @param roleId - Role ID
   * @returns Promise with array of permissions
   */
  findByRoleId(roleId: number): Promise<IPermission[]>;

  /**
   * Check if permission exists
   * @param id - Permission ID to check
   * @returns Promise with boolean indicating existence
   */
  permissionExists(id: string): Promise<boolean>;
}

/**
 * Token for dependency injection
 */
export const PERMISSION_REPOSITORY = Symbol('PermissionRepository');
