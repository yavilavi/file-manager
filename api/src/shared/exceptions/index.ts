/**
 * File Manager - Domain Exceptions Index
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

/**
 * Centralized exports for all domain exceptions
 * Following DRY principle and improving developer experience
 */

// Base domain error classes
export * from './domain-error';

// User domain errors
export * from './user.errors';

// Company domain errors
export * from './company.errors';

// Tenant domain errors
export * from './tenant.errors';

// Role domain errors
export * from './role.errors';

// Permission domain errors
export * from './permission.errors';

/**
 * Union type of all domain errors for type safety
 */
export type DomainErrorUnion =
  // User errors
  | import('./user.errors').UserNotFoundError
  | import('./user.errors').InvalidEmailError
  | import('./user.errors').EmailAlreadyExistsError
  | import('./user.errors').InvalidPasswordError
  | import('./user.errors').InvalidUserNameError
  | import('./user.errors').UserInactiveError
  | import('./user.errors').InvalidDepartmentError
  | import('./user.errors').UserTenantMismatchError

  // Company errors
  | import('./company.errors').CompanyNotFoundError
  | import('./company.errors').InvalidNitError
  | import('./company.errors').NitAlreadyExistsError
  | import('./company.errors').InvalidCompanyNameError
  | import('./company.errors').InvalidTenantIdError
  | import('./company.errors').TenantIdAlreadyExistsError
  | import('./company.errors').CompanyInactiveError

  // Tenant errors
  | import('./tenant.errors').TenantNotFoundError
  | import('./tenant.errors').InvalidSubdomainError
  | import('./tenant.errors').SubdomainAlreadyExistsError
  | import('./tenant.errors').TenantInitializationError
  | import('./tenant.errors').TenantArchivedError
  | import('./tenant.errors').TenantLimitExceededError

  // Role errors
  | import('./role.errors').RoleNotFoundError
  | import('./role.errors').InvalidRoleNameError
  | import('./role.errors').RoleNameAlreadyExistsError
  | import('./role.errors').RoleHasAssignedUsersError
  | import('./role.errors').AdminRoleModificationError
  | import('./role.errors').InvalidRolePermissionError
  | import('./role.errors').RoleTenantMismatchError

  // Permission errors
  | import('./permission.errors').PermissionNotFoundError
  | import('./permission.errors').InvalidPermissionFormatError
  | import('./permission.errors').InvalidPermissionResourceError
  | import('./permission.errors').InvalidPermissionActionError
  | import('./permission.errors').PermissionAlreadyExistsError
  | import('./permission.errors').PermissionInUseError
  | import('./permission.errors').InvalidPermissionDescriptionError
  | import('./permission.errors').BulkPermissionOperationError;

/**
 * Helper function to check if an error is a domain error
 * @param error - Error to check
 * @returns True if error is a domain error
 */
export function isDomainError(
  error: unknown,
): error is import('./domain-error').DomainError {
  return (
    error instanceof Error &&
    'code' in error &&
    typeof (error as any).code === 'string'
  );
}

/**
 * Helper function to extract error code for programmatic handling
 * @param error - Domain error
 * @returns Error code or 'UNKNOWN_ERROR' if not a domain error
 */
export function getErrorCode(error: unknown): string {
  if (isDomainError(error)) {
    return error.code;
  }
  return 'UNKNOWN_ERROR';
}

/**
 * Error codes constants for easy reference
 * Following convention over configuration
 */
export const ERROR_CODES = {
  // User errors
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_VALIDATION_ERROR: 'USER_VALIDATION_ERROR',
  EMAIL_ALREADY_EXISTS: 'BUSINESS_RULE_VIOLATION',
  USER_INACTIVE: 'BUSINESS_RULE_VIOLATION',
  USER_TENANT_MISMATCH: 'BUSINESS_RULE_VIOLATION',

  // Company errors
  COMPANY_NOT_FOUND: 'COMPANY_NOT_FOUND',
  COMPANY_VALIDATION_ERROR: 'COMPANY_VALIDATION_ERROR',
  NIT_ALREADY_EXISTS: 'BUSINESS_RULE_VIOLATION',
  TENANT_ID_ALREADY_EXISTS: 'BUSINESS_RULE_VIOLATION',
  COMPANY_INACTIVE: 'BUSINESS_RULE_VIOLATION',

  // Tenant errors
  TENANT_NOT_FOUND: 'TENANT_NOT_FOUND',
  TENANT_VALIDATION_ERROR: 'TENANT_VALIDATION_ERROR',
  SUBDOMAIN_ALREADY_EXISTS: 'BUSINESS_RULE_VIOLATION',
  TENANT_INITIALIZATION_ERROR: 'BUSINESS_RULE_VIOLATION',
  TENANT_ARCHIVED: 'BUSINESS_RULE_VIOLATION',
  TENANT_LIMIT_EXCEEDED: 'BUSINESS_RULE_VIOLATION',

  // Role errors
  ROLE_NOT_FOUND: 'ROLE_NOT_FOUND',
  ROLE_VALIDATION_ERROR: 'ROLE_VALIDATION_ERROR',
  ROLE_NAME_ALREADY_EXISTS: 'BUSINESS_RULE_VIOLATION',
  ROLE_HAS_ASSIGNED_USERS: 'BUSINESS_RULE_VIOLATION',
  ADMIN_ROLE_MODIFICATION: 'BUSINESS_RULE_VIOLATION',
  ROLE_TENANT_MISMATCH: 'BUSINESS_RULE_VIOLATION',

  // Permission errors
  PERMISSION_NOT_FOUND: 'PERMISSION_NOT_FOUND',
  PERMISSION_VALIDATION_ERROR: 'PERMISSION_VALIDATION_ERROR',
  PERMISSION_ALREADY_EXISTS: 'BUSINESS_RULE_VIOLATION',
  PERMISSION_IN_USE: 'BUSINESS_RULE_VIOLATION',
  BULK_PERMISSION_OPERATION_ERROR: 'BUSINESS_RULE_VIOLATION',

  // Generic
  BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
} as const;
