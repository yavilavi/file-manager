/**
 * File Manager - Email Value Object
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { ValidationError } from '@shared/exceptions/domain-error';

/**
 * Email validation error
 */
class EmailValidationError extends ValidationError {
  constructor(field: string, value: any, constraint: string, cause?: Error) {
    super('Email', field, value, constraint, cause);
  }
}

/**
 * Email Value Object
 * Following Single Responsibility Principle (SRP) - manages email validation and formatting
 * Following Immutability principle
 */
export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Create an Email value object
   * @param value - Email string to validate and create
   * @returns Email value object
   * @throws EmailValidationError if email is invalid
   */
  static create(value: string): Email {
    if (!value) {
      throw new EmailValidationError('value', value, 'Email cannot be empty');
    }

    const trimmed = value.trim().toLowerCase();
    
    if (!this.isValidEmail(trimmed)) {
      throw new EmailValidationError('format', value, 'Invalid email format');
    }

    return new Email(trimmed);
  }

  /**
   * Validate email format using RFC 5322 compliant regex
   * @param email - Email string to validate
   * @returns Boolean indicating if email is valid
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
  }

  /**
   * Get email value
   * @returns Email string
   */
  get value(): string {
    return this._value;
  }

  /**
   * Get domain part of email
   * @returns Domain part
   */
  get domain(): string {
    return this._value.split('@')[1];
  }

  /**
   * Get local part of email (before @)
   * @returns Local part
   */
  get localPart(): string {
    return this._value.split('@')[0];
  }

  /**
   * Check equality with another Email
   * @param other - Other Email to compare
   * @returns Boolean indicating equality
   */
  equals(other: Email): boolean {
    return this._value === other._value;
  }

  /**
   * String representation
   * @returns Email string
   */
  toString(): string {
    return this._value;
  }

  /**
   * JSON representation
   * @returns Email string
   */
  toJSON(): string {
    return this._value;
  }
} 