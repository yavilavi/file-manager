import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { Permission } from './interfaces/permission.interface';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @RequirePermission('permission:create')
  create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @RequirePermission('permission:read')
  findAll(): Promise<Permission[]> {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @RequirePermission('permission:read')
  findOne(@Param('id') id: string): Promise<Permission | null> {
    return this.permissionsService.findById(id);
  }

  @Delete(':id')
  @RequirePermission('permission:delete')
  remove(@Param('id') id: string): Promise<Permission> {
    return this.permissionsService.remove(id);
  }
}
