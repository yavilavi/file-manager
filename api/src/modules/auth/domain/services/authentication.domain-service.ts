/**
 * File Manager - Authentication Domain Service
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { Injectable } from '@nestjs/common';
import { UserCredentialsEntity } from '../entities/user-credentials.entity';

/**
 * Authentication Domain Service
 * Following Single Responsibility Principle (SRP) - handles authentication business logic
 * Following Domain-Driven Design patterns - contains domain logic that doesn't fit in entities
 */
@Injectable()
export class AuthenticationDomainService {
  /**
   * Validate user credentials
   * @param credentials - User credentials entity
   * @param plainPassword - Plain text password to validate
   * @param passwordHashingService - Password hashing service
   * @returns Promise with validation result
   */
  async validateCredentials(
    credentials: UserCredentialsEntity | null,
    plainPassword: string,
    passwordHashingService: {
      verify(hash: string, plain: string): Promise<boolean>;
    },
  ): Promise<boolean> {
    if (!credentials) {
      return false;
    }

    return await credentials.canAuthenticate(
      plainPassword,
      passwordHashingService,
    );
  }

  /**
   * Check if user can be authenticated based on business rules
   * @param credentials - User credentials entity
   * @returns Boolean indicating if user can authenticate
   */
  canUserAuthenticate(credentials: UserCredentialsEntity | null): boolean {
    if (!credentials) {
      return false;
    }

    // Business rule: user must be active
    if (!credentials.isActive) {
      return false;
    }

    // Additional business rules can be added here
    return true;
  }

  /**
   * Create authentication payload for user
   * @param credentials - User credentials entity
   * @param jwtConfig - JWT configuration
   * @returns Authentication payload
   */
  createAuthPayload(
    credentials: UserCredentialsEntity,
    jwtConfig: { aud: string; iss: string },
  ): { aud: string; sub: number; iss: string } {
    return {
      aud: jwtConfig.aud,
      sub: credentials.id,
      iss: jwtConfig.iss,
    };
  }
}