/**
 * File Manager - department.controller Controller
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as Req } from 'express';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth/jwt-auth.guard';
import { RequirePermission } from '@modules/auth/decorators/require-permission.decorator';
import { CreateDepartmentDto } from '../../application/dtos/create-department.dto';
import { UpdateDepartmentDto } from '../../application/dtos/update-department.dto';
import { DepartmentResponseDto } from '../../application/dtos/department-response.dto';
import { CreateDepartmentUseCase } from '../../application/use-cases/create-department.use-case';
import { GetAllDepartmentsUseCase } from '../../application/use-cases/get-all-departments.use-case';
import { UpdateDepartmentUseCase } from '../../application/use-cases/update-department.use-case';
import { DeleteDepartmentUseCase } from '../../application/use-cases/delete-department.use-case';

@Controller('departments')
@UseGuards(JwtAuthGuard)
export class DepartmentController {
  constructor(
    private readonly createDepartmentUseCase: CreateDepartmentUseCase,
    private readonly getAllDepartmentsUseCase: GetAllDepartmentsUseCase,
    private readonly updateDepartmentUseCase: UpdateDepartmentUseCase,
    private readonly deleteDepartmentUseCase: DeleteDepartmentUseCase,
  ) {}

  @Get()
  @RequirePermission('department:read')
  async getAllDepartments(
    @Request() req: Req,
  ): Promise<DepartmentResponseDto[]> {
    const departments = await this.getAllDepartmentsUseCase.execute({
      tenantId: req.tenantId,
    });

    return departments.map((dept) => DepartmentResponseDto.fromDomain(dept));
  }

  @Post()
  @RequirePermission('department:create')
  @HttpCode(HttpStatus.CREATED)
  async createDepartment(
    @Body() dto: CreateDepartmentDto,
    @Request() req: Req,
  ): Promise<DepartmentResponseDto> {
    try {
      const result = await this.createDepartmentUseCase.execute({
        name: dto.name,
        tenantId: req.tenantId,
      });

      return DepartmentResponseDto.fromDomain(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage === 'Ya hay un departamento con ese nombre') {
        throw new Error('CONFLICT: ' + errorMessage);
      }
      throw error;
    }
  }

  @Patch(':id')
  @RequirePermission('department:update')
  async updateDepartment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDepartmentDto,
    @Request() req: Req,
  ): Promise<DepartmentResponseDto> {
    try {
      const result = await this.updateDepartmentUseCase.execute({
        id,
        name: dto.name,
        tenantId: req.tenantId,
      });

      return DepartmentResponseDto.fromDomain(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage === 'No existe el departamento seleccionado') {
        throw new NotFoundException(errorMessage);
      }
      if (errorMessage === 'Ya hay un departamento con ese nombre') {
        throw new ConflictException(errorMessage);
      }
      throw error;
    }
  }

  @Delete(':id')
  @RequirePermission('department:delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDepartment(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: Req,
  ): Promise<void> {
    try {
      await this.deleteDepartmentUseCase.execute({
        id,
        tenantId: req.tenantId,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage === 'No existe el departamento seleccionado') {
        throw new Error('NOT_FOUND: ' + errorMessage);
      }
      throw error;
    }
  }
}
