/**
 * File Manager - Domain Error Base Classes
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

/**
 * Base class for all domain errors
 * Following Single Responsibility Principle (SRP) and Open/Closed Principle (OCP)
 */
export abstract class DomainError extends Error {
  /**
   * Domain error constructor
   * @param message - Human readable error message
   * @param code - Unique error code for programmatic handling
   * @param cause - Optional underlying error that caused this domain error
   */
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = this.constructor.name;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Returns a JSON representation of the error
   * Useful for logging and API responses
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      stack: this.stack,
      cause: this.cause?.message,
    };
  }

  /**
   * Returns a string representation suitable for logging
   */
  toString(): string {
    const base = `${this.name} [${this.code}]: ${this.message}`;
    return this.cause ? `${base} (caused by: ${this.cause.message})` : base;
  }
}

/**
 * Base class for entity not found errors
 * Following Liskov Substitution Principle (LSP)
 */
export abstract class EntityNotFoundError extends DomainError {
  constructor(entityName: string, identifier: string | number, cause?: Error) {
    super(
      `${entityName} with identifier '${identifier}' was not found`,
      `${entityName.toUpperCase()}_NOT_FOUND`,
      cause,
    );
  }
}

/**
 * Base class for validation errors
 * Following Interface Segregation Principle (ISP)
 */
export abstract class ValidationError extends DomainError {
  constructor(
    entityName: string,
    field: string,
    value: any,
    constraint: string,
    cause?: Error,
  ) {
    super(
      `Validation failed for ${entityName}.${field}: ${constraint}. Received: ${value}`,
      `${entityName.toUpperCase()}_VALIDATION_ERROR`,
      cause,
    );
  }
}

/**
 * Base class for business rule violations
 * Following Single Responsibility Principle (SRP)
 */
export abstract class BusinessRuleViolationError extends DomainError {
  constructor(rule: string, context: string, cause?: Error) {
    super(
      `Business rule violation: ${rule} in context: ${context}`,
      'BUSINESS_RULE_VIOLATION',
      cause,
    );
  }
}

/**
 * Base class for permission/authorization errors
 * Following Single Responsibility Principle (SRP)
 */
export abstract class PermissionError extends DomainError {
  constructor(
    action: string,
    resource: string,
    context?: string,
    cause?: Error,
  ) {
    const message = context
      ? `Permission denied: Cannot ${action} ${resource} in context: ${context}`
      : `Permission denied: Cannot ${action} ${resource}`;

    super(message, 'PERMISSION_DENIED', cause);
  }
}
