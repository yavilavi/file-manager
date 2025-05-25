/**
 * File Manager - Mappers Index
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

/**
 * Centralized exports for all mappers
 * Following DRY principle and improving developer experience
 */

// Base mapper classes and interfaces
export * from './base-mapper';

// Domain-specific mappers
export * from './user.mapper';
export * from './role.mapper';
export * from './permission.mapper';
export * from './company.mapper';
export * from './tenant.mapper';

/**
 * Mapper token constants for dependency injection
 * Following Dependency Inversion Principle (DIP)
 */
export const MAPPER_TOKENS = {
  USER_MAPPER: 'USER_MAPPER',
  ROLE_MAPPER: 'ROLE_MAPPER',
  PERMISSION_MAPPER: 'PERMISSION_MAPPER',
  COMPANY_MAPPER: 'COMPANY_MAPPER',
  TENANT_MAPPER: 'TENANT_MAPPER',
} as const;

/**
 * Type definitions for mapper injection
 */
export type MapperTokens = (typeof MAPPER_TOKENS)[keyof typeof MAPPER_TOKENS];
