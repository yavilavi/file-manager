/**
 * File Manager - Base Repository Interface
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */

/**
 * Base repository interface following SOLID principles
 * Provides common CRUD operations for all entities
 * 
 * @template T - Entity type
 * @template K - Primary key type (number, string, etc.)
 */
export interface IRepository<T, K = number> {
  /**
   * Find entity by primary key
   * @param id - Primary key value
   * @returns Promise with entity or null if not found
   */
  findById(id: K): Promise<T | null>;

  /**
   * Find all entities with optional filtering
   * @param filters - Optional filters to apply
   * @returns Promise with array of entities
   */
  findAll(filters?: Record<string, any>): Promise<T[]>;

  /**
   * Create a new entity
   * @param entity - Entity data to create
   * @returns Promise with created entity
   */
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;

  /**
   * Update existing entity
   * @param id - Primary key of entity to update
   * @param updates - Partial entity data for updates
   * @returns Promise with updated entity or null if not found
   */
  update(id: K, updates: Partial<T>): Promise<T | null>;

  /**
   * Delete entity by primary key (soft delete recommended)
   * @param id - Primary key of entity to delete
   * @returns Promise indicating success
   */
  delete(id: K): Promise<boolean>;

  /**
   * Check if entity exists by primary key
   * @param id - Primary key to check
   * @returns Promise with boolean indicating existence
   */
  exists(id: K): Promise<boolean>;

  /**
   * Count total entities with optional filtering
   * @param filters - Optional filters to apply
   * @returns Promise with count
   */
  count(filters?: Record<string, any>): Promise<number>;
} 