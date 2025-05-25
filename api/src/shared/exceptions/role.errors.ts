/**
 * File Manager - Role Domain Errors
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */

import { EntityNotFoundError, ValidationError, BusinessRuleViolationError } from './domain-error';

/**
 * Thrown when a role is not found
 * Following Liskov Substitution Principle (LSP)
 */
export class RoleNotFoundError extends EntityNotFoundError {
  constructor(identifier: string | number, cause?: Error) {
    super('Role', identifier, cause);
  }
}

/**
 * Thrown when role name validation fails
 * Following Single Responsibility Principle (SRP)
 */
export class InvalidRoleNameError extends ValidationError {
  constructor(name: string, reason: string, cause?: Error) {
    super('Role', 'name', name, reason, cause);
  }
}

/**
 * Thrown when role name already exists within tenant
 * Following Business Rule pattern
 */
export class RoleNameAlreadyExistsError extends BusinessRuleViolationError {
  constructor(name: string, tenantId: string, cause?: Error) {
    super(
      'Role name must be unique within tenant',
      `Role '${name}' in tenant '${tenantId}'`,
      cause,
    );
  }
}

/**
 * Thrown when trying to delete a role that has assigned users
 * Following Business Rule pattern
 */
export class RoleHasAssignedUsersError extends BusinessRuleViolationError {
  constructor(roleId: number, userCount: number, cause?: Error) {
    super(
      'Cannot delete role with assigned users',
      `Role ${roleId} has ${userCount} assigned users`,
      cause,
    );
  }
}

/**
 * Thrown when trying to modify admin role in unauthorized way
 * Following Security and Business Rule pattern
 */
export class AdminRoleModificationError extends BusinessRuleViolationError {
  constructor(action: string, roleId: number, cause?: Error) {
    super(
      'Admin roles have restricted modification rules',
      `Attempting to ${action} admin role ${roleId}`,
      cause,
    );
  }
}

/**
 * Thrown when role permission validation fails
 * Following Domain validation pattern
 */
export class InvalidRolePermissionError extends ValidationError {
  constructor(roleId: number, permissionId: string, reason: string, cause?: Error) {
    super(
      'Role',
      'permissions',
      `role:${roleId}, permission:${permissionId}`,
      reason,
      cause,
    );
  }
}

/**
 * Thrown when trying to assign role from different tenant
 * Following Security and Multi-tenancy pattern
 */
export class RoleTenantMismatchError extends BusinessRuleViolationError {
  constructor(roleId: number, roleTenant: string, targetTenant: string, cause?: Error) {
    super(
      'Roles can only be assigned within their tenant',
      `Role ${roleId} (tenant: ${roleTenant}) being assigned to tenant: ${targetTenant}`,
      cause,
    );
  }
} 