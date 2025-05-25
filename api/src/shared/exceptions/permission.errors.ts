/**
 * File Manager - Permission Domain Errors
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */

import { EntityNotFoundError, ValidationError, BusinessRuleViolationError } from './domain-error';

/**
 * Thrown when a permission is not found
 * Following Liskov Substitution Principle (LSP)
 */
export class PermissionNotFoundError extends EntityNotFoundError {
  constructor(identifier: string, cause?: Error) {
    super('Permission', identifier, cause);
  }
}

/**
 * Thrown when permission ID format validation fails
 * Following Single Responsibility Principle (SRP)
 */
export class InvalidPermissionFormatError extends ValidationError {
  constructor(permissionId: string, cause?: Error) {
    super(
      'Permission',
      'id',
      permissionId,
      'must follow format <resource>:<action> (e.g., "users:create")',
      cause,
    );
  }
}

/**
 * Thrown when permission resource validation fails
 * Following Domain validation pattern
 */
export class InvalidPermissionResourceError extends ValidationError {
  constructor(resource: string, reason: string, cause?: Error) {
    super('Permission', 'resource', resource, reason, cause);
  }
}

/**
 * Thrown when permission action validation fails
 * Following Domain validation pattern
 */
export class InvalidPermissionActionError extends ValidationError {
  constructor(action: string, reason: string, cause?: Error) {
    super('Permission', 'action', action, reason, cause);
  }
}

/**
 * Thrown when permission already exists
 * Following Business Rule pattern
 */
export class PermissionAlreadyExistsError extends BusinessRuleViolationError {
  constructor(permissionId: string, cause?: Error) {
    super(
      'Permission must be unique',
      `Permission registration with ID: ${permissionId}`,
      cause,
    );
  }
}

/**
 * Thrown when trying to delete a permission that is assigned to roles
 * Following Business Rule pattern
 */
export class PermissionInUseError extends BusinessRuleViolationError {
  constructor(permissionId: string, roleCount: number, cause?: Error) {
    super(
      'Cannot delete permission that is assigned to roles',
      `Permission ${permissionId} is assigned to ${roleCount} roles`,
      cause,
    );
  }
}

/**
 * Thrown when permission description validation fails
 * Following Single Responsibility Principle (SRP)
 */
export class InvalidPermissionDescriptionError extends ValidationError {
  constructor(description: string, reason: string, cause?: Error) {
    super('Permission', 'description', description, reason, cause);
  }
}

/**
 * Thrown when bulk permission operation fails
 * Following Business Process pattern
 */
export class BulkPermissionOperationError extends BusinessRuleViolationError {
  constructor(operation: string, failedCount: number, totalCount: number, cause?: Error) {
    super(
      `Bulk permission ${operation} partially failed`,
      `${failedCount}/${totalCount} operations failed`,
      cause,
    );
  }
} 