/**
 * File Manager - Authentication DTOs
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

/**
 * Command for validating user credentials
 * Following Command Query Responsibility Segregation (CQRS)
 */
export class ValidateUserCommand {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  tenantId?: string;
}

/**
 * Command for user login
 * Following CQRS pattern
 */
export class LoginCommand {
  @IsString()
  tenantId: string;

  jwtPayload: {
    aud: string;
    sub: number;
    iss: string;
  };
}

/**
 * Result of login operation
 * Following CQRS pattern
 */
export class LoginResult {
  access_token: string;
}

/**
 * Result of user validation
 * Following CQRS pattern
 */
export class ValidateUserResult {
  isValid: boolean;
  jwtPayload?: {
    aud: string;
    sub: number;
    iss: string;
  };
} 