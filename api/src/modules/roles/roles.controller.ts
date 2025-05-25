/**
 * File Manager - roles.controller Controller
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
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Request } from 'express';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { Role, UserRole } from './interfaces/role.interface';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequirePermission('role:create')
  create(
    @Body() createRoleDto: CreateRoleDto,
    @Req() request: Request,
  ): Promise<Role> {
    const tenantId = request['tenantId'];
    return this.rolesService.create(createRoleDto, tenantId);
  }

  @Get()
  @RequirePermission('role:read')
  findAll(@Req() request: Request): Promise<Role[]> {
    const tenantId = request['tenantId'];
    return this.rolesService.findAll(tenantId);
  }

  @Get(':id')
  @RequirePermission('role:read')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<Role> {
    const tenantId = request['tenantId'];
    return this.rolesService.findOne(id, tenantId);
  }

  @Get(':id/users')
  @RequirePermission('role:read')
  getRoleUsers(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<any[]> {
    const tenantId = request['tenantId'];
    return this.rolesService.getRoleUsers(id, tenantId);
  }

  @Patch(':id')
  @RequirePermission('role:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
    @Req() request: Request,
  ): Promise<Role> {
    const tenantId = request['tenantId'];
    return this.rolesService.update(id, updateRoleDto, tenantId);
  }

  @Delete(':id')
  @RequirePermission('role:delete')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<Role> {
    const tenantId = request['tenantId'];
    return this.rolesService.remove(id, tenantId);
  }

  @Post('users/:userId/roles/:roleId')
  @RequirePermission('role:assign')
  assignRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
    @Req() request: Request,
  ): Promise<UserRole> {
    const tenantId = request['tenantId'];
    return this.rolesService.assignRoleToUser(userId, roleId, tenantId);
  }

  @Delete('users/:userId/roles/:roleId')
  @RequirePermission('role:assign')
  removeRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
    @Req() request: Request,
  ): Promise<UserRole> {
    const tenantId = request['tenantId'];
    return this.rolesService.removeRoleFromUser(userId, roleId, tenantId);
  }

  @Get('users/:userId/roles')
  @RequirePermission('role:read')
  getUserRoles(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() request: Request,
  ): Promise<Role[]> {
    const tenantId = request['tenantId'];
    return this.rolesService.getUserRoles(userId, tenantId);
  }
}
