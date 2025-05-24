import { TenantResponseDto } from './check-subdomain.dto';

export class CreateTenantDto {
  readonly tenantId: string;
  readonly name: string;
  readonly nit: string;
  readonly canSendEmail?: boolean;

  constructor(props: {
    tenantId: string;
    name: string;
    nit: string;
    canSendEmail?: boolean;
  }) {
    this.tenantId = props.tenantId;
    this.name = props.name;
    this.nit = props.nit;
    this.canSendEmail = props.canSendEmail;
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

export class TenantCreationResultDto {
  readonly tenant: TenantResponseDto;
  readonly message: string;

  constructor(
    tenant: TenantResponseDto,
    message: string = 'Tenant created successfully',
  ) {
    this.tenant = tenant;
    this.message = message;
  }
}

// Re-export TenantResponseDto for convenience
export { TenantResponseDto };
