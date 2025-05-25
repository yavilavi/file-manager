/**
 * File Manager - Create Tenant.Use Case
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Inject, Injectable, ConflictException } from '@nestjs/common';
import * as argon2 from 'argon2';
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
  InitialUserResponseDto,
} from '../dtos/create-tenant.dto';
import { RoleInitializationService } from '../services/role-initialization.service';
import { PrismaService } from '@libs/database/prisma/prisma.service';

@Injectable()
export class CreateTenantUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
    @Inject(TENANT_VALIDATION_SERVICE)
    private readonly validationService: ITenantValidationService,
    private readonly roleInitializationService: RoleInitializationService,
    private readonly prisma: PrismaService,
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

    // Validate initial user email if provided
    if (dto.initialUser) {
      const existingUser = await this.prisma.client.user.findFirst({
        where: { email: dto.initialUser.email },
      });
      if (existingUser) {
        throw new ConflictException('A user with this email already exists');
      }
    }

    // Use transaction to ensure all operations succeed or fail together
    return await this.prisma.client.$transaction(async (tx) => {
      // Create tenant directly in the transaction
      const createdCompany = await tx.company.create({
        data: {
          tenantId: tenantId.value,
          name: companyInfo.name,
          nit: companyInfo.nit,
          canSendEmail: dto.canSendEmail || false,
        },
      });

      let initialUser: InitialUserResponseDto | undefined;
      let superAdminRole: any;

      // Create initial user if provided
      if (dto.initialUser) {
        const hashedPassword = await argon2.hash(dto.initialUser.password);

        const createdUser = await tx.user.create({
          data: {
            name: dto.initialUser.name,
            email: dto.initialUser.email,
            password: hashedPassword,
            tenantId: createdCompany.tenantId,
            isActive: true,
          },
        });

        // Initialize super admin role for the new company and assign it to the user
        await this.roleInitializationService.initializeSuperAdminRole({
          tenantId: createdCompany.tenantId,
          userId: createdUser.id,
          tx,
        });

        initialUser = new InitialUserResponseDto({
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
          isActive: createdUser.isActive,
          createdAt: createdUser.createdAt,
        });

        // Get the created super admin role for response
        superAdminRole = await tx.role.findFirst({
          where: {
            tenantId: createdCompany.tenantId,
            isAdmin: true,
          },
        });
      }

      // Map to response DTO
      const responseDto = new TenantResponseDto({
        id: createdCompany.tenantId,
        name: createdCompany.name,
        nit: createdCompany.nit,
        canSendEmail: createdCompany.canSendEmail,
        isActive: true,
        createdAt: createdCompany.createdAt,
        updatedAt: createdCompany.updatedAt,
      });

      return new TenantCreationResultDto(
        responseDto,
        'Tenant created successfully with super admin role',
        initialUser,
        superAdminRole
          ? {
              id: superAdminRole.id,
              name: superAdminRole.name,
              description: superAdminRole.description,
              isAdmin: superAdminRole.isAdmin,
            }
          : undefined,
      );
    });
  }
}
