/**
 * File Manager - permission.guard Guard
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRED_PERMISSION_KEY } from '../../decorators/require-permission.decorator';
import { IS_PUBLIC_KEY } from '@shared/decorators/is-public.decorator';
import { PermissionsService } from '../../../permissions/permissions.service';
import { Request } from 'express';

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

    // If no permission is required or it's a public route, allow access
    if (!requiredPermission || this.isPublic(context)) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    // Extract the user ID safely using type assertion
    const userId =
      request.user && typeof request.user === 'object'
        ? request.user.data.id
        : undefined;
    const tenantId = request['tenantId'];

    if (!userId || !tenantId) {
      throw new UnauthorizedException('User not authenticated properly');
    }

    const hasPermission = await this.permissionsService.hasPermission(
      userId,
      requiredPermission,
      tenantId,
    );

    if (!hasPermission) {
      throw new UnauthorizedException(
        `Missing required permission: ${requiredPermission}`,
      );
    }

    return true;
  }

  private isPublic(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
