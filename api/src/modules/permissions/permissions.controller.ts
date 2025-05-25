/**
 * File Manager - permissions.controller Controller
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permission } from './interfaces/permission.interface';
import { RequiredPermission } from '@modules/auth';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @RequiredPermission('permission:create')
  create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @RequiredPermission('permission:read')
  findAll(): Promise<Permission[]> {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @RequiredPermission('permission:read')
  findOne(@Param('id') id: string): Promise<Permission | null> {
    return this.permissionsService.findById(id);
  }

  @Delete(':id')
  @RequiredPermission('permission:delete')
  remove(@Param('id') id: string): Promise<Permission> {
    return this.permissionsService.remove(id);
  }
}
