/**
 * File Manager - JWT Application Service
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JWT Application Service
 * Following Single Responsibility Principle (SRP) - handles JWT token operations
 * Following Dependency Inversion Principle (DIP) - abstracts JWT implementation
 */
@Injectable()
export class JwtApplicationService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generate access token for user
   * @param payload - JWT payload
   * @param expiresIn - Token expiration time
   * @returns Access token
   */
  generateAccessToken(
    payload: { aud: string; sub: number; iss: string },
    expiresIn: string = '8h',
  ): string {
    return this.jwtService.sign(payload, { expiresIn });
  }

  /**
   * Generate refresh token for user
   * @param payload - JWT payload
   * @param expiresIn - Token expiration time
   * @returns Refresh token
   */
  generateRefreshToken(
    payload: { aud: string; sub: number; iss: string },
    expiresIn: string = '7d',
  ): string {
    return this.jwtService.sign(payload, { expiresIn });
  }

  /**
   * Verify and decode token
   * @param token - JWT token to verify
   * @returns Decoded payload
   */
  verifyToken(token: string): any {
    return this.jwtService.verify(token);
  }

  /**
   * Get JWT configuration
   * @returns JWT configuration
   */
  getJwtConfig(): { aud: string; iss: string } {
    return {
      aud: this.configService.getOrThrow<string>('jwt.aud'),
      iss: this.configService.getOrThrow<string>('jwt.iss'),
    };
  }
} 