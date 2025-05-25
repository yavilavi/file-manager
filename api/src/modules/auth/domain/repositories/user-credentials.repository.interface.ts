/**
 * File Manager - User Credentials Repository Interface
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { UserCredentialsEntity } from '../entities/user-credentials.entity';
import { Email } from '@shared/domain/value-objects/email.value-object';

/**
 * User Credentials Repository Interface
 * Following Dependency Inversion Principle (DIP) - domain defines the contract
 * Following Interface Segregation Principle (ISP) - specific to authentication needs
 */
export interface IUserCredentialsRepository {
  /**
   * Find user credentials by email within tenant scope
   * @param email - User email
   * @param tenantId - Optional tenant ID for scope
   * @returns Promise with user credentials or null if not found
   */
  findByEmail(email: Email, tenantId?: string): Promise<UserCredentialsEntity | null>;

  /**
   * Find user credentials by ID within tenant scope
   * @param id - User ID
   * @param tenantId - Optional tenant ID for scope
   * @returns Promise with user credentials or null if not found
   */
  findById(id: number, tenantId?: string): Promise<UserCredentialsEntity | null>;
}

/**
 * Token for dependency injection
 */
export const USER_CREDENTIALS_REPOSITORY = Symbol('UserCredentialsRepository'); 