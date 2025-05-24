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
    },
  ): Promise<TenantCreationResultDto> {
    const dto = new CreateTenantDto({
      tenantId: body.tenantId,
      name: body.name,
      nit: body.nit,
      canSendEmail: body.canSendEmail,
    });

    return await this.createTenantUseCase.execute(dto);
  }

  @Get(':tenantId')
  async getTenantById(
    @Param('tenantId') tenantId: string,
  ): Promise<TenantResponseDto> {
    return await this.getTenantByIdUseCase.execute(tenantId);
  }
}
