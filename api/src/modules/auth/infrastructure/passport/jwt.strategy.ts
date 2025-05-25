/**
 * File Manager - JWT Strategy (Infrastructure Layer)
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@shared/interfaces';
import { Request } from 'express';

interface JwtPayload {
  sub: number;
  aud: string;
  iss: string;
  tenantId?: string;
}

/**
 * JWT Authentication Strategy
 * Following Single Responsibility Principle (SRP) - only handles JWT auth strategy
 * Part of infrastructure layer (frameworks & drivers)
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const user = await this.userRepository.findUserById(
      payload.sub,
      req.tenantId || payload.tenantId,
    );

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      data: user,
    };
  }
}
