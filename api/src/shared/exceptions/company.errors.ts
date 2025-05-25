/**
 * File Manager - Company Domain Errors
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */

import { EntityNotFoundError, ValidationError, BusinessRuleViolationError } from './domain-error';

/**
 * Thrown when a company is not found
 * Following Liskov Substitution Principle (LSP)
 */
export class CompanyNotFoundError extends EntityNotFoundError {
  constructor(identifier: string | number, cause?: Error) {
    super('Company', identifier, cause);
  }
}

/**
 * Thrown when company NIT validation fails
 * Following Single Responsibility Principle (SRP)
 */
export class InvalidNitError extends ValidationError {
  constructor(nit: string, reason: string, cause?: Error) {
    super('Company', 'nit', nit, reason, cause);
  }
}

/**
 * Thrown when company NIT already exists
 * Following Business Rule pattern
 */
export class NitAlreadyExistsError extends BusinessRuleViolationError {
  constructor(nit: string, cause?: Error) {
    super(
      'Company NIT must be unique',
      `Company registration with NIT: ${nit}`,
      cause,
    );
  }
}

/**
 * Thrown when company name validation fails
 * Following Single Responsibility Principle (SRP)
 */
export class InvalidCompanyNameError extends ValidationError {
  constructor(name: string, reason: string, cause?: Error) {
    super('Company', 'name', name, reason, cause);
  }
}

/**
 * Thrown when tenant ID validation fails
 * Following Domain validation pattern
 */
export class InvalidTenantIdError extends ValidationError {
  constructor(tenantId: string, reason: string, cause?: Error) {
    super('Company', 'tenantId', tenantId, reason, cause);
  }
}

/**
 * Thrown when tenant ID already exists
 * Following Business Rule pattern
 */
export class TenantIdAlreadyExistsError extends BusinessRuleViolationError {
  constructor(tenantId: string, cause?: Error) {
    super(
      'Tenant ID must be unique',
      `Company registration with tenant ID: ${tenantId}`,
      cause,
    );
  }
}

/**
 * Thrown when company is inactive but trying to perform operations
 * Following Business Rule pattern
 */
export class CompanyInactiveError extends BusinessRuleViolationError {
  constructor(companyId: number, action: string, cause?: Error) {
    super(
      'Only active companies can perform this action',
      `Company ${companyId} attempting to: ${action}`,
      cause,
    );
  }
} 