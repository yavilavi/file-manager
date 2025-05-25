/**
 * File Manager - Company Info.Vo
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
export class CompanyInfo {
  private constructor(
    private readonly _name: string,
    private readonly _nit: string,
  ) {}

  public static create(props: { name: string; nit: string }): CompanyInfo {
    // Validate company name
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Company name cannot be empty');
    }

    if (props.name.trim().length < 2) {
      throw new Error('Company name must be at least 2 characters long');
    }

    if (props.name.trim().length > 255) {
      throw new Error('Company name cannot exceed 255 characters');
    }

    // Validate NIT (Tax ID)
    if (!props.nit || props.nit.trim().length === 0) {
      throw new Error('Company NIT cannot be empty');
    }

    // Basic NIT format validation (adjust according to your country's requirements)
    const nitPattern = /^[0-9\-.]+$/;
    if (!nitPattern.test(props.nit.trim())) {
      throw new Error(
        'NIT format is invalid. Only numbers, hyphens, and dots are allowed',
      );
    }

    if (props.nit.trim().length < 5) {
      throw new Error('NIT must be at least 5 characters long');
    }

    if (props.nit.trim().length > 20) {
      throw new Error('NIT cannot exceed 20 characters');
    }

    const sanitizedName = props.name.trim().replace(/\s+/g, ' '); // Replace multiple spaces with single space
    const sanitizedNit = props.nit.trim().replace(/\s/g, ''); // Remove all spaces from NIT

    return new CompanyInfo(sanitizedName, sanitizedNit);
  }

  get name(): string {
    return this._name;
  }

  get nit(): string {
    return this._nit;
  }

  public getDisplayName(): string {
    return this._name;
  }

  public getFormattedNit(): string {
    // You can implement specific NIT formatting logic here
    return this._nit;
  }

  public equals(other: CompanyInfo): boolean {
    return this._name === other._name && this._nit === other._nit;
  }

  public isSameCompany(otherNit: string): boolean {
    return this._nit === otherNit.trim().replace(/\s/g, '');
  }
}
