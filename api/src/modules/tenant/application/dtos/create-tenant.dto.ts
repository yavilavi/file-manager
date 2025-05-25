/**
 * File Manager - create-tenant.dto DTO
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { TenantResponseDto } from './check-subdomain.dto';

export class CreateTenantDto {
  readonly tenantId: string;
  readonly name: string;
  readonly nit: string;
  readonly canSendEmail?: boolean;
  readonly initialUser?: {
    name: string;
    email: string;
    password: string;
  };

  constructor(props: {
    tenantId: string;
    name: string;
    nit: string;
    canSendEmail?: boolean;
    initialUser?: {
      name: string;
      email: string;
      password: string;
    };
  }) {
    this.tenantId = props.tenantId;
    this.name = props.name;
    this.nit = props.nit;
    this.canSendEmail = props.canSendEmail;
    this.initialUser = props.initialUser;
  }
}

export class UpdateTenantDto {
  readonly name?: string;
  readonly nit?: string;
  readonly canSendEmail?: boolean;

  constructor(props: { name?: string; nit?: string; canSendEmail?: boolean }) {
    this.name = props.name;
    this.nit = props.nit;
    this.canSendEmail = props.canSendEmail;
  }
}

export class InitialUserResponseDto {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly isActive: boolean;
  readonly createdAt: Date;

  constructor(props: {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
  }
}

export class TenantCreationResultDto {
  readonly tenant: TenantResponseDto;
  readonly initialUser?: InitialUserResponseDto;
  readonly superAdminRole?: {
    id: number;
    name: string;
    description: string;
    isAdmin: boolean;
  };
  readonly message: string;

  constructor(
    tenant: TenantResponseDto,
    message: string = 'Tenant created successfully',
    initialUser?: InitialUserResponseDto,
    superAdminRole?: {
      id: number;
      name: string;
      description: string;
      isAdmin: boolean;
    },
  ) {
    this.tenant = tenant;
    this.message = message;
    this.initialUser = initialUser;
    this.superAdminRole = superAdminRole;
  }
}

// Re-export TenantResponseDto for convenience
export { TenantResponseDto };
