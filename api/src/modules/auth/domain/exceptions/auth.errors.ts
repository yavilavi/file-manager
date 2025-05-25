/**
 * File Manager - Authentication Domain Errors
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import {
  DomainError,
  EntityNotFoundError,
  ValidationError,
  BusinessRuleViolationError,
} from '@shared/exceptions/domain-error';

/**
 * Thrown when user credentials are not found
 * Following Liskov Substitution Principle (LSP)
 */
export class UserCredentialsNotFoundError extends EntityNotFoundError {
  constructor(identifier: string | number, cause?: Error) {
    super('UserCredentials', identifier, cause);
  }
}

/**
 * Thrown when authentication fails
 * Following Single Responsibility Principle (SRP)
 */
export class AuthenticationFailedError extends DomainError {
  constructor(reason: string, cause?: Error) {
    super(`Authentication failed: ${reason}`, 'AUTHENTICATION_FAILED', cause);
  }
}

/**
 * Thrown when user account is inactive
 * Following Business Rule Violation pattern
 */
export class InactiveUserError extends BusinessRuleViolationError {
  constructor(userId: number, cause?: Error) {
    super(
      'User account must be active to authenticate',
      `User ID: ${userId}`,
      cause,
    );
  }
}

/**
 * Thrown when password validation fails
 * Following Single Responsibility Principle (SRP)
 */
export class InvalidPasswordError extends ValidationError {
  constructor(reason: string, cause?: Error) {
    super('User', 'password', '[REDACTED]', reason, cause);
  }
}

/**
 * Thrown when JWT token is invalid or expired
 * Following Single Responsibility Principle (SRP)
 */
export class InvalidTokenError extends DomainError {
  constructor(reason: string, cause?: Error) {
    super(
      `Invalid token: ${reason}`,
      'INVALID_TOKEN',
      cause,
    );
  }
}

/**
 * Thrown when user lacks required permissions
 * Following Single Responsibility Principle (SRP)
 */
export class InsufficientPermissionsError extends DomainError {
  constructor(action: string, resource: string, cause?: Error) {
    super(
      `Insufficient permissions to ${action} ${resource}`,
      'INSUFFICIENT_PERMISSIONS',
      cause,
    );
  }
} 