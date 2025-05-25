/**
 * File Manager - Get Tenant By Id.Use Case
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TenantIdentifier } from '../../domain/value-objects/tenant-identifier.vo';
import {
  TENANT_REPOSITORY,
  ITenantRepository,
} from '../../domain/repositories/tenant.repository.interface';
import { TenantResponseDto } from '../dtos/check-subdomain.dto';

@Injectable()
export class GetTenantByIdUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async execute(tenantId: string): Promise<TenantResponseDto> {
    // Validate tenant ID format
    const validatedTenantId = TenantIdentifier.create(tenantId);

    // Find tenant
    const tenant = await this.tenantRepository.findById(
      validatedTenantId.value,
    );
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Map to response DTO
    return new TenantResponseDto({
      id: tenant.id,
      name: tenant.name,
      nit: tenant.nit,
      canSendEmail: tenant.canSendEmail,
      isActive: tenant.isActive(),
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
    });
  }
}
