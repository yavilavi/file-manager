/**
 * File Manager - Password Value Object
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { ValidationError } from '@shared/exceptions/domain-error';

/**
 * Password validation error
 */
class PasswordValidationError extends ValidationError {
  constructor(field: string, value: any, constraint: string, cause?: Error) {
    super('Password', field, value, constraint, cause);
  }
}

/**
 * Password Value Object
 * Following Single Responsibility Principle (SRP) - manages password validation
 * Following Immutability principle
 */
export class Password {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Create a Password value object
   * @param value - Password string to validate and create
   * @returns Password value object
   * @throws PasswordValidationError if password is invalid
   */
  static create(value: string): Password {
    if (!value) {
      throw new PasswordValidationError('value', '[REDACTED]', 'Password cannot be empty');
    }

    if (value.length < 8) {
      throw new PasswordValidationError('length', '[REDACTED]', 'Password must be at least 8 characters long');
    }

    if (value.length > 128) {
      throw new PasswordValidationError('length', '[REDACTED]', 'Password must be less than 128 characters');
    }

    return new Password(value);
  }

  /**
   * Create a password without validation (for already hashed passwords)
   * @param value - Already validated/hashed password
   * @returns Password value object
   */
  static createWithoutValidation(value: string): Password {
    return new Password(value);
  }

  /**
   * Get password value
   * @returns Password string
   */
  get value(): string {
    return this._value;
  }

  /**
   * Check equality with another Password
   * @param other - Other Password to compare
   * @returns Boolean indicating equality
   */
  equals(other: Password): boolean {
    return this._value === other._value;
  }

  /**
   * String representation (redacted for security)
   * @returns Redacted string
   */
  toString(): string {
    return '[REDACTED]';
  }

  /**
   * JSON representation (redacted for security)
   * @returns Redacted string
   */
  toJSON(): string {
    return '[REDACTED]';
  }
} 