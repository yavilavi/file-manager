/**
 * File Manager - RequirePermission Decorator (Presentation Layer)
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key for required permissions
 */
export const REQUIRED_PERMISSION_KEY = 'require_permission';

/**
 * Decorator to specify required permission for an endpoint
 * Part of presentation layer (interface adapters)
 *
 * @param permission - Permission string in format "resource:action"
 * @returns Method decorator
 *
 * @example
 * ```typescript
 * @Get('users')
 * @RequiredPermission('user:read')
 * async getUsers() {
 *   // This endpoint requires 'user:read' permission
 * }
 * ```
 */
export const RequiredPermission = (permission: string) =>
  SetMetadata(REQUIRED_PERMISSION_KEY, permission);
