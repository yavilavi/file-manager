/**
 * File Manager - Permission Guard (Presentation Layer)
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRED_PERMISSION_KEY } from '../decorators/require-permission.decorator';
import { PermissionsService } from '@modules/permissions/permissions.service';
import { Request } from 'express';

/**
 * Permission Guard
 * Following Single Responsibility Principle (SRP) - only handles permissions
 * Part of presentation layer (interface adapters)
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<string>(
      REQUIRED_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission) {
      return true; // No permission required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user?.data;
    const tenantId = request.tenantId;

    if (!user || !tenantId) {
      return false;
    }

    return await this.permissionsService.hasPermission(
      user.id,
      requiredPermission,
      tenantId,
    );
  }
} 
