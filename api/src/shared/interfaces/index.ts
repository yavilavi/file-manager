/**
 * Centralized exports for all repository interfaces
 * Following DRY principle and improving developer experience
 */

// Base interfaces
export * from './base-repository.interface';
export * from './base-entity.interface';

// Domain-specific repository interfaces
export * from './user-repository.interface';
export * from './role-repository.interface';
export * from './permission-repository.interface';
export * from './company-repository.interface';
export * from './tenant-repository.interface';

// Existing interfaces (maintaining backward compatibility)
export * from './request-user-interface';
export * from './jwt-payload.interface';

/**
 * Repository token constants for dependency injection
 * Following Dependency Inversion Principle (DIP)
 */
export const REPOSITORY_TOKENS = {
  USER_REPOSITORY: 'USER_REPOSITORY',
  ROLE_REPOSITORY: 'ROLE_REPOSITORY', 
  PERMISSION_REPOSITORY: 'PERMISSION_REPOSITORY',
  COMPANY_REPOSITORY: 'COMPANY_REPOSITORY',
  TENANT_REPOSITORY: 'TENANT_REPOSITORY',
} as const;

/**
 * Type helper for repository tokens
 */
export type RepositoryToken = typeof REPOSITORY_TOKENS[keyof typeof REPOSITORY_TOKENS]; 