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
import { CompanyPlan } from '../../domain/entities/company-plan.entity';
import { serializeBigInt } from '../../../../utils/serializers';

@Controller('company-plans')
export class CompanyPlanController {
  constructor(private readonly companyPlanService: CompanyPlanService) {}

  @Get()
  async findAll(): Promise<any> {
    const companyPlans = await this.companyPlanService.findAll();
    return serializeBigInt(companyPlans);
  }

  @Get('active')
  async findActive(): Promise<any> {
    const companyPlans = await this.companyPlanService.findActive();
    return serializeBigInt(companyPlans);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const companyPlan = await this.companyPlanService.findById(id);
    return serializeBigInt(companyPlan);
  }

  @Get(':id/with-plan')
  async findWithPlan(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    const companyPlan = await this.companyPlanService.findWithPlan(id);
    return serializeBigInt(companyPlan);
  }

  @Get('tenant/:tenantId')
  async findByTenantId(
    @Param('tenantId') tenantId: string,
  ): Promise<any> {
    const companyPlan = await this.companyPlanService.findByTenantId(tenantId);
    return serializeBigInt(companyPlan);
  }

  @Post()
  async create(
    @Body() createCompanyPlanDto: CreateCompanyPlanDto,
  ): Promise<any> {
    const companyPlan = await this.companyPlanService.create(createCompanyPlanDto);
    return serializeBigInt(companyPlan);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyPlanDto: UpdateCompanyPlanDto,
  ): Promise<any> {
    const companyPlan = await this.companyPlanService.update(id, updateCompanyPlanDto);
    return serializeBigInt(companyPlan);
  }

  @Delete(':id')
  async deactivate(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.companyPlanService.deactivate(id);
  }
}
