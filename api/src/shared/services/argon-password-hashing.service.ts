/**
 * File Manager - Argon2 Password Hashing Service
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { IPasswordHashingService } from '../interfaces/password-hashing.interface';

/**
 * Argon2 implementation of password hashing service
 * Following Single Responsibility Principle (SRP)
 */
@Injectable()
export class ArgonPasswordHashingService implements IPasswordHashingService {
  /**
   * Hash a plain text password using Argon2
   * @param password - Plain text password to hash
   * @returns Promise with hashed password
   */
  async hash(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  /**
   * Verify a password against its Argon2 hash
   * @param hashedPassword - Previously hashed password
   * @param plainPassword - Plain text password to verify
   * @returns Promise with boolean indicating if password matches
   */
  async verify(
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    return await argon2.verify(hashedPassword, plainPassword);
  }
}
