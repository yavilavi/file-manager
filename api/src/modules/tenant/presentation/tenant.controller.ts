/**
 * File Manager - tenant.controller Controller
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { IsPublic } from '@shared/decorators/is-public.decorator';
import { RequirePermission } from '@modules/auth/decorators/require-permission.decorator';

// Use Cases
import { CheckSubdomainAvailabilityUseCase } from '../application/use-cases/check-subdomain-availability.use-case';
import { CreateTenantUseCase } from '../application/use-cases/create-tenant.use-case';
import { GetTenantByIdUseCase } from '../application/use-cases/get-tenant-by-id.use-case';

// DTOs
import {
  CheckSubdomainDto,
  SubdomainAvailabilityResultDto,
} from '../application/dtos/check-subdomain.dto';
import {
  CreateTenantDto,
  TenantCreationResultDto,
  TenantResponseDto,
} from '../application/dtos/create-tenant.dto';

@Controller('tenant')
export class TenantController {
  constructor(
    private readonly checkSubdomainAvailabilityUseCase: CheckSubdomainAvailabilityUseCase,
    private readonly createTenantUseCase: CreateTenantUseCase,
    private readonly getTenantByIdUseCase: GetTenantByIdUseCase,
  ) {}

  @IsPublic()
  @Get('check-subdomain')
  async checkSubdomain(
    @Query('subdomain') subdomain: string,
  ): Promise<SubdomainAvailabilityResultDto> {
    if (!subdomain) {
      throw new BadRequestException('Subdomain is required');
    }

    const dto = new CheckSubdomainDto(subdomain);
    return await this.checkSubdomainAvailabilityUseCase.execute(dto);
  }

  @IsPublic()
  @Post()
  async createTenant(
    @Body()
    body: {
      tenantId: string;
      name: string;
      nit: string;
      canSendEmail?: boolean;
      initialUser?: {
        name: string;
        email: string;
        password: string;
      };
    },
  ): Promise<TenantCreationResultDto> {
    // Basic validation for initial user if provided
    if (body.initialUser) {
      if (!body.initialUser.name || body.initialUser.name.trim().length === 0) {
        throw new BadRequestException('Initial user name is required');
      }
      if (!body.initialUser.email || body.initialUser.email.trim().length === 0) {
        throw new BadRequestException('Initial user email is required');
      }
      if (!body.initialUser.password || body.initialUser.password.length < 6) {
        throw new BadRequestException('Initial user password must be at least 6 characters long');
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.initialUser.email)) {
        throw new BadRequestException('Invalid email format');
      }
    }

    const dto = new CreateTenantDto({
      tenantId: body.tenantId,
      name: body.name,
      nit: body.nit,
      canSendEmail: body.canSendEmail,
      initialUser: body.initialUser,
    });

    return await this.createTenantUseCase.execute(dto);
  }

  @Get(':tenantId')
  @RequirePermission('tenant:read')
  async getTenantById(
    @Param('tenantId') tenantId: string,
  ): Promise<TenantResponseDto> {
    return await this.getTenantByIdUseCase.execute(tenantId);
  }
}
