/**
 * File Manager - plan.controller Controller
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
import { PlanService } from '../../application/services/plan.service';
import { CreatePlanDto } from '../../application/dtos/create-plan.dto';
import { UpdatePlanDto } from '../../application/dtos/update-plan.dto';
import { serializeBigInt } from '@utils/serializers';
import { IsPublic } from '@shared/decorators/is-public.decorator';
import { RequiredPermission } from '@modules/auth';


@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  @RequiredPermission('plan:read')
  async findAll(): Promise<any> {
    const plans = await this.planService.findAll();
    return serializeBigInt(plans);
  }

  @Get('active')
  @IsPublic()
  async findActive(): Promise<any> {
    const plans = await this.planService.findActive();
    return serializeBigInt(plans);
  }

  @Get(':id')
  @RequiredPermission('plan:read')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const plan = await this.planService.findById(id);
    return serializeBigInt(plan);
  }

  @Post()
  @RequiredPermission('plan:create')
  async create(@Body() createPlanDto: CreatePlanDto): Promise<any> {
    const plan = await this.planService.create(createPlanDto);
    return serializeBigInt(plan);
  }

  @Put(':id')
  @RequiredPermission('plan:update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlanDto: UpdatePlanDto,
  ): Promise<any> {
    const plan = await this.planService.update(id, updatePlanDto);
    return serializeBigInt(plan);
  }

  @Delete(':id')
  @RequiredPermission('plan:delete')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.planService.delete(id);
  }
}
