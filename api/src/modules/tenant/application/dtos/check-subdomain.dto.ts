/**
 * File Manager - check-subdomain.dto DTO
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
export class CheckSubdomainDto {
  readonly subdomain: string;

  constructor(subdomain: string) {
    this.subdomain = subdomain;
  }
}

export class SubdomainAvailabilityResultDto {
  readonly available: boolean;
  readonly reason?: string;
  readonly suggestions?: string[];

  constructor(props: {
    available: boolean;
    reason?: string;
    suggestions?: string[];
  }) {
    this.available = props.available;
    this.reason = props.reason;
    this.suggestions = props.suggestions;
  }
}

export class TenantResponseDto {
  readonly id: string;
  readonly name: string;
  readonly nit: string;
  readonly canSendEmail: boolean;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    name: string;
    nit: string;
    canSendEmail: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    Object.assign(this, props);
  }
}
