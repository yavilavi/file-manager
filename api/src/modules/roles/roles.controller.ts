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
import { Role, UserRole } from './interfaces/role.interface';
import { RequiredPermission } from '@modules/auth';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequiredPermission('role:create')
  create(
    @Body() createRoleDto: CreateRoleDto,
    @Req() request: Request,
  ): Promise<Role> {
    const tenantId = request['tenantId'];
    return this.rolesService.create(createRoleDto, tenantId);
  }

  @Get()
  @RequiredPermission('role:read')
  findAll(@Req() request: Request): Promise<Role[]> {
    const tenantId = request['tenantId'];
    return this.rolesService.findAll(tenantId);
  }

  @Get(':id')
  @RequiredPermission('role:read')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<Role> {
    const tenantId = request['tenantId'];
    return this.rolesService.findOne(id, tenantId);
  }

  @Get(':id/users')
  @RequiredPermission('role:read')
  getRoleUsers(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<any[]> {
    const tenantId = request['tenantId'];
    return this.rolesService.getRoleUsers(id, tenantId);
  }

  @Patch(':id')
  @RequiredPermission('role:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
    @Req() request: Request,
  ): Promise<Role> {
    const tenantId = request['tenantId'];
    return this.rolesService.update(id, updateRoleDto, tenantId);
  }

  @Delete(':id')
  @RequiredPermission('role:delete')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<Role> {
    const tenantId = request['tenantId'];
    return this.rolesService.remove(id, tenantId);
  }

  @Post('users/:userId/roles/:roleId')
  @RequiredPermission('role:assign')
  assignRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
    @Req() request: Request,
  ): Promise<UserRole> {
    const tenantId = request['tenantId'];
    return this.rolesService.assignRoleToUser(userId, roleId, tenantId);
  }

  @Delete('users/:userId/roles/:roleId')
  @RequiredPermission('role:assign')
  removeRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
    @Req() request: Request,
  ): Promise<UserRole> {
    const tenantId = request['tenantId'];
    return this.rolesService.removeRoleFromUser(userId, roleId, tenantId);
  }

  @Get('users/:userId/roles')
  @RequiredPermission('role:read')
  getUserRoles(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() request: Request,
  ): Promise<Role[]> {
    const tenantId = request['tenantId'];
    return this.rolesService.getUserRoles(userId, tenantId);
  }
}
