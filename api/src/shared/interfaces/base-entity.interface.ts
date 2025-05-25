/**
 * File Manager - Base Entity Interface
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

/**
 * Base entity interface with common audit fields
 * Following Single Responsibility Principle (SRP)
 */
export interface IBaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Base entity interface with soft delete capability
 * Following Interface Segregation Principle (ISP)
 */
export interface ISoftDeletableEntity extends IBaseEntity {
  deletedAt: Date | null;
}

/**
 * Base entity interface for tenant-scoped entities
 * Following Single Responsibility Principle (SRP)
 */
export interface ITenantEntity extends IBaseEntity {
  tenantId: string;
}

/**
 * Combined interface for entities that support both tenancy and soft delete
 */
export interface ITenantSoftDeletableEntity
  extends ITenantEntity,
    ISoftDeletableEntity {}

/**
 * Interface for entities with user ownership
 */
export interface IUserOwnedEntity extends IBaseEntity {
  userId: number;
}

/**
 * Generic filter interface for repository queries
 */
export interface IEntityFilters {
  tenantId?: string;
  isActive?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  updatedAfter?: Date;
  updatedBefore?: Date;
}
