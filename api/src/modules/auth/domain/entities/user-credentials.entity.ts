/**
 * File Manager - User Credentials Domain Entity
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { DomainEntity } from '@shared/domain/base-domain.entity';
import { Email } from '@shared/domain/value-objects/email.value-object';
import { Password } from '@shared/domain/value-objects/password.value-object';

/**
 * User Credentials Domain Entity
 * Following Single Responsibility Principle (SRP) - manages user authentication data
 * Following encapsulation principles
 */
export class UserCredentialsEntity extends DomainEntity {
  private constructor(
    private readonly _id: number,
    private readonly _email: Email,
    private readonly _hashedPassword: string,
    private readonly _isActive: boolean,
    private readonly _tenantId: string,
    private readonly _departmentId: number | null,
  ) {
    super();
  }

  /**
   * Create user credentials entity
   * @param id - User ID
   * @param email - User email
   * @param hashedPassword - Hashed password
   * @param isActive - User active status
   * @param tenantId - Tenant ID
   * @param departmentId - Department ID
   */
  static create(
    id: number,
    email: string,
    hashedPassword: string,
    isActive: boolean,
    tenantId: string,
    departmentId: number | null,
  ): UserCredentialsEntity {
    return new UserCredentialsEntity(
      id,
      Email.create(email),
      hashedPassword,
      isActive,
      tenantId,
      departmentId,
    );
  }

  /**
   * Validate if user can authenticate
   * @param plainPassword - Plain text password to validate
   * @param passwordHashingService - Password hashing service
   * @returns Promise with validation result
   */
  async canAuthenticate(
    plainPassword: string,
    passwordHashingService: { verify(hash: string, plain: string): Promise<boolean> },
  ): Promise<boolean> {
    if (!this._isActive) {
      return false;
    }

    const passwordValid = Password.create(plainPassword);
    return await passwordHashingService.verify(this._hashedPassword, passwordValid.value);
  }

  // Getters
  get id(): number {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }

  get hashedPassword(): string {
    return this._hashedPassword;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get tenantId(): string {
    return this._tenantId;
  }

  get departmentId(): number | null {
    return this._departmentId;
  }
} 