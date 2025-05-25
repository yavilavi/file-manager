/**
 * File Manager - Tenant Domain Errors
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */

import { EntityNotFoundError, ValidationError, BusinessRuleViolationError } from './domain-error';

/**
 * Thrown when a tenant is not found
 * Following Liskov Substitution Principle (LSP)
 */
export class TenantNotFoundError extends EntityNotFoundError {
  constructor(identifier: string, cause?: Error) {
    super('Tenant', identifier, cause);
  }
}

/**
 * Thrown when tenant subdomain validation fails
 * Following Single Responsibility Principle (SRP)
 */
export class InvalidSubdomainError extends ValidationError {
  constructor(subdomain: string, reason: string, cause?: Error) {
    super('Tenant', 'subdomain', subdomain, reason, cause);
  }
}

/**
 * Thrown when tenant subdomain already exists
 * Following Business Rule pattern
 */
export class SubdomainAlreadyExistsError extends BusinessRuleViolationError {
  constructor(subdomain: string, cause?: Error) {
    super(
      'Tenant subdomain must be unique',
      `Tenant registration with subdomain: ${subdomain}`,
      cause,
    );
  }
}

/**
 * Thrown when tenant initialization fails
 * Following Business Process pattern
 */
export class TenantInitializationError extends BusinessRuleViolationError {
  constructor(tenantId: string, reason: string, cause?: Error) {
    super(
      'Tenant initialization failed',
      `Tenant ${tenantId}: ${reason}`,
      cause,
    );
  }
}

/**
 * Thrown when tenant is archived but trying to perform operations
 * Following Business Rule pattern
 */
export class TenantArchivedError extends BusinessRuleViolationError {
  constructor(tenantId: string, action: string, cause?: Error) {
    super(
      'Archived tenants cannot perform this action',
      `Tenant ${tenantId} attempting to: ${action}`,
      cause,
    );
  }
}

/**
 * Thrown when tenant limit is exceeded
 * Following Business Rule pattern
 */
export class TenantLimitExceededError extends BusinessRuleViolationError {
  constructor(limit: string, current: number, max: number, cause?: Error) {
    super(
      `Tenant ${limit} limit exceeded`,
      `Current: ${current}, Maximum allowed: ${max}`,
      cause,
    );
  }
} 