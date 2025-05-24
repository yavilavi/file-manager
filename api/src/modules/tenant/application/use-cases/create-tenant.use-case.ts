import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { TenantEntity } from '../../domain/entities/tenant.entity';
import { TenantIdentifier } from '../../domain/value-objects/tenant-identifier.vo';
import { CompanyInfo } from '../../domain/value-objects/company-info.vo';
import {
  TENANT_REPOSITORY,
  ITenantRepository,
} from '../../domain/repositories/tenant.repository.interface';
import {
  TENANT_VALIDATION_SERVICE,
  ITenantValidationService,
} from '../../domain/services/tenant-validation.service.interface';
import {
  CreateTenantDto,
  TenantCreationResultDto,
  TenantResponseDto,
} from '../dtos/create-tenant.dto';

@Injectable()
export class CreateTenantUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
    @Inject(TENANT_VALIDATION_SERVICE)
    private readonly validationService: ITenantValidationService,
  ) {}

  async execute(dto: CreateTenantDto): Promise<TenantCreationResultDto> {
    // Create and validate value objects
    const tenantId = TenantIdentifier.create(dto.tenantId);
    const companyInfo = CompanyInfo.create({
      name: dto.name,
      nit: dto.nit,
    });

    // Check if tenant ID is already taken
    const existingTenantById = await this.tenantRepository.existsByTenantId(
      tenantId.value,
    );
    if (existingTenantById) {
      throw new ConflictException(
        'A tenant with this identifier already exists',
      );
    }

    // Check if company with same NIT already exists
    const existingTenantByNit = await this.tenantRepository.existsByNit(
      companyInfo.nit,
    );
    if (existingTenantByNit) {
      throw new ConflictException('A company with this NIT already exists');
    }

    // Validate tenant identifier through domain service
    const identifierValidation =
      await this.validationService.validateTenantIdentifier(tenantId.value);
    if (!identifierValidation.isValid) {
      throw new ConflictException(
        `Invalid tenant identifier: ${identifierValidation.errors.join(', ')}`,
      );
    }

    // Validate company info through domain service
    const companyValidation = await this.validationService.validateCompanyInfo(
      companyInfo.name,
      companyInfo.nit,
    );
    if (!companyValidation.isValid) {
      throw new ConflictException(
        `Invalid company information: ${companyValidation.errors.join(', ')}`,
      );
    }

    // Create tenant entity
    const tenant = TenantEntity.create({
      id: tenantId.value,
      name: companyInfo.name,
      nit: companyInfo.nit,
      canSendEmail: dto.canSendEmail || false,
    });

    // Save tenant
    const savedTenant = await this.tenantRepository.save(tenant);

    // Map to response DTO
    const responseDto = new TenantResponseDto({
      id: savedTenant.id,
      name: savedTenant.name,
      nit: savedTenant.nit,
      canSendEmail: savedTenant.canSendEmail,
      isActive: savedTenant.isActive(),
      createdAt: savedTenant.createdAt,
      updatedAt: savedTenant.updatedAt,
    });

    return new TenantCreationResultDto(responseDto);
  }
}
