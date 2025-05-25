/**
 * File Manager - Tenant Id.Vo
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
export class TenantId {
  private constructor(private readonly _value: string) {}

  public static create(value: string): TenantId {
    if (!value || value.trim().length === 0) {
      throw new Error('Tenant ID cannot be empty');
    }

    if (value.length > 15) {
      throw new Error('Tenant ID cannot exceed 15 characters');
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      throw new Error(
        'Tenant ID can only contain alphanumeric characters, underscores, and hyphens',
      );
    }

    return new TenantId(value.trim());
  }

  get value(): string {
    return this._value;
  }

  public equals(other: TenantId): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
