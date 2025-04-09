import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { CreateDepartmentDto } from '@modules/department/dtos/create-department.dto';
import { DepartmentService } from '@modules/department/department.service';
import { Request as Req } from 'express';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  async getAllDepartments(@Request() req: Req) {
    return this.departmentService.getAllDepartments(req.tenantId);
  }

  @Post()
  async createDepartment(
    @Body() dto: CreateDepartmentDto,
    @Request() req: Req,
  ) {
    return this.departmentService.createDepartment(dto, req.tenantId);
  }
}
