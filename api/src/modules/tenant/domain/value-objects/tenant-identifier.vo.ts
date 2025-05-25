/**
 * File Manager - Tenant Identifier.Vo
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
export class TenantIdentifier {
  private constructor(private readonly _value: string) {}

  public static create(value: string): TenantIdentifier {
    if (!value || value.trim().length === 0) {
      throw new Error('Tenant identifier cannot be empty');
    }

    if (value.length > 15) {
      throw new Error('Tenant identifier cannot exceed 15 characters');
    }

    if (value.length < 3) {
      throw new Error('Tenant identifier must be at least 3 characters long');
    }

    // Only allow alphanumeric characters, underscores, and hyphens
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      throw new Error(
        'Tenant identifier can only contain alphanumeric characters, underscores, and hyphens',
      );
    }

    // Must start with a letter
    if (!/^[a-zA-Z]/.test(value)) {
      throw new Error('Tenant identifier must start with a letter');
    }

    // Cannot end with underscore or hyphen
    if (/_$|-$/.test(value)) {
      throw new Error('Tenant identifier cannot end with underscore or hyphen');
    }

    // Reserved keywords that cannot be used as tenant identifiers
    const reservedKeywords = [
      'api',
      'www',
      'admin',
      'root',
      'system',
      'public',
      'private',
      'mail',
      'email',
      'ftp',
      'http',
      'https',
      'ssl',
      'tls',
      'tenant',
      'tenants',
      'company',
      'companies',
    ];

    if (reservedKeywords.includes(value.toLowerCase())) {
      throw new Error(
        `'${value}' is a reserved keyword and cannot be used as tenant identifier`,
      );
    }

    return new TenantIdentifier(value.toLowerCase().trim());
  }

  get value(): string {
    return this._value;
  }

  public equals(other: TenantIdentifier): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }

  public toSubdomain(): string {
    return this._value;
  }

  public isValidForSubdomain(): boolean {
    // Additional subdomain-specific validation
    return (
      this._value.length >= 3 &&
      this._value.length <= 15 &&
      !this._value.includes('--') && // No consecutive hyphens
      !this._value.includes('__')
    ); // No consecutive underscores
  }
}
