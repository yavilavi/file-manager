/**
 * File Manager - Password Hashing Service Interface
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

/**
 * Password hashing service interface following SOLID principles
 * Single Responsibility Principle (SRP) - only handles password operations
 * Dependency Inversion Principle (DIP) - depend on abstraction, not concretion
 */
export interface IPasswordHashingService {
  /**
   * Hash a plain text password
   * @param password - Plain text password to hash
   * @returns Promise with hashed password
   */
  hash(password: string): Promise<string>;

  /**
   * Verify a password against its hash
   * @param hashedPassword - Previously hashed password
   * @param plainPassword - Plain text password to verify
   * @returns Promise with boolean indicating if password matches
   */
  verify(hashedPassword: string, plainPassword: string): Promise<boolean>;
}

/**
 * Token for dependency injection
 */
export const PASSWORD_HASHING_SERVICE = Symbol('PasswordHashingService');
