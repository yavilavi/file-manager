/**
 * File Manager - Local Strategy (Infrastructure Layer)
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthApplicationService } from '../../presentation/services/auth-application.service';
import { Request } from 'express';

/**
 * Local Authentication Strategy
 * Following Single Responsibility Principle (SRP) - only handles local auth strategy
 * Part of infrastructure layer (frameworks & drivers)
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authApplicationService: AuthApplicationService) {
    super({
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    username: string,
    password: string,
  ): Promise<any> {
    const result = await this.authApplicationService.validateUser(
      username,
      password,
      req.tenantId,
    );
    if (!result.isValid || !result.jwtPayload) {
      throw new UnauthorizedException('Usuario o contraseña inválidos');
    }
    return result.jwtPayload;
  }
} 