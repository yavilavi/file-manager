/**
 * File Manager - User Domain Errors
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */

import { EntityNotFoundError, ValidationError, BusinessRuleViolationError } from './domain-error';

/**
 * Thrown when a user is not found
 * Following Liskov Substitution Principle (LSP)
 */
export class UserNotFoundError extends EntityNotFoundError {
  constructor(identifier: string | number, cause?: Error) {
    super('User', identifier, cause);
  }
}

/**
 * Thrown when user email validation fails
 * Following Single Responsibility Principle (SRP)
 */
export class InvalidEmailError extends ValidationError {
  constructor(email: string, cause?: Error) {
    super('User', 'email', email, 'must be a valid email address', cause);
  }
}

/**
 * Thrown when user email already exists
 * Following Open/Closed Principle (OCP)
 */
export class EmailAlreadyExistsError extends BusinessRuleViolationError {
  constructor(email: string, cause?: Error) {
    super(
      'Email must be unique',
      `User registration with email: ${email}`,
      cause,
    );
  }
}

/**
 * Thrown when user password validation fails
 * Following Single Responsibility Principle (SRP)
 */
export class InvalidPasswordError extends ValidationError {
  constructor(reason: string, cause?: Error) {
    super('User', 'password', '[REDACTED]', reason, cause);
  }
}

/**
 * Thrown when user name validation fails
 * Following Single Responsibility Principle (SRP)
 */
export class InvalidUserNameError extends ValidationError {
  constructor(name: string, reason: string, cause?: Error) {
    super('User', 'name', name, reason, cause);
  }
}

/**
 * Thrown when user is inactive but trying to perform actions
 * Following Business Rule pattern
 */
export class UserInactiveError extends BusinessRuleViolationError {
  constructor(userId: number, action: string, cause?: Error) {
    super(
      'Only active users can perform this action',
      `User ${userId} attempting to: ${action}`,
      cause,
    );
  }
}

/**
 * Thrown when user department validation fails
 * Following Domain logic encapsulation
 */
export class InvalidDepartmentError extends ValidationError {
  constructor(departmentId: number, tenantId: string, cause?: Error) {
    super(
      'User',
      'departmentId',
      departmentId,
      `must belong to tenant ${tenantId}`,
      cause,
    );
  }
}

/**
 * Thrown when user tries to access resources from different tenant
 * Following Security and Business Rule principles
 */
export class UserTenantMismatchError extends BusinessRuleViolationError {
  constructor(userId: number, userTenant: string, resourceTenant: string, cause?: Error) {
    super(
      'Users can only access resources within their tenant',
      `User ${userId} (tenant: ${userTenant}) accessing resource (tenant: ${resourceTenant})`,
      cause,
    );
  }
} 