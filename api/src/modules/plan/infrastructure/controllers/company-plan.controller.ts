/**
 * File Manager - company-plan.controller Controller
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CompanyPlanService } from '../../application/services/company-plan.service';
import { CreateCompanyPlanDto } from '../../application/dtos/create-company-plan.dto';
import { UpdateCompanyPlanDto } from '../../application/dtos/update-company-plan.dto';
import { serializeBigInt } from '@utils/serializers';
import { RequiredPermission } from '@modules/auth';


@Controller('company-plans')
export class CompanyPlanController {
  constructor(private readonly companyPlanService: CompanyPlanService) {}

  @Get()
  @RequiredPermission('company-plan:read')
  async findAll(): Promise<any> {
    const companyPlans = await this.companyPlanService.findAll();
    return serializeBigInt(companyPlans);
  }

  @Get(':id')
  @RequiredPermission('company-plan:read')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const companyPlan = await this.companyPlanService.findById(id);
    return serializeBigInt(companyPlan);
  }

  @Get(':id/with-plan')
  @RequiredPermission('company-plan:read')
  async findWithPlan(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const companyPlan = await this.companyPlanService.findWithPlan(id);
    return serializeBigInt(companyPlan);
  }

  @Get('tenant/:tenantId')
  @RequiredPermission('company-plan:read')
  async findByTenantId(@Param('tenantId') tenantId: string): Promise<any> {
    const companyPlan = await this.companyPlanService.findByTenantId(tenantId);
    return serializeBigInt(companyPlan);
  }

  @Post()
  @RequiredPermission('company-plan:create')
  async create(
    @Body() createCompanyPlanDto: CreateCompanyPlanDto,
  ): Promise<any> {
    const companyPlan =
      await this.companyPlanService.create(createCompanyPlanDto);
    return serializeBigInt(companyPlan);
  }

  @Put(':id')
  @RequiredPermission('company-plan:update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyPlanDto: UpdateCompanyPlanDto,
  ): Promise<any> {
    const companyPlan = await this.companyPlanService.update(
      id,
      updateCompanyPlanDto,
    );
    return serializeBigInt(companyPlan);
  }

  @Delete(':id')
  @RequiredPermission('company-plan:delete')
  async deactivate(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.companyPlanService.deactivate(id);
  }
}
