/**
 * File Manager - Authentication Use Case
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  IPasswordHashingService,
  PASSWORD_HASHING_SERVICE,
} from '@shared/interfaces/password-hashing.interface';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '@shared/interfaces/user-repository.interface';
import { JwtPayloadInterface } from '@shared/interfaces/jwt-payload.interface';

export interface LoginCommand {
  tenantId: string;
  jwtPayload: JwtPayloadInterface;
}

export interface LoginResult {
  access_token: string;
}

export interface ValidateUserCommand {
  email: string;
  password: string;
  tenantId?: string;
}

/**
 * Authentication Use Case
 * Following Single Responsibility Principle (SRP) - only handles authentication logic
 * Following Dependency Inversion Principle (DIP) - depends on abstractions
 */
@Injectable()
export class AuthenticationUseCase {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHING_SERVICE)
    private readonly passwordHashingService: IPasswordHashingService,
  ) {}

  /**
   * Validate user credentials
   * @param command - Contains email, password and optional tenantId
   * @returns JWT payload or false if invalid
   */
  async validateUser(
    command: ValidateUserCommand,
  ): Promise<false | JwtPayloadInterface> {
    const { email, password, tenantId } = command;

    const user = await this.userRepository.findByEmail(
      email.toLowerCase(),
      tenantId,
      true, // includePassword
    );

    if (!user || !user.isActive) {
      return false;
    }

    const passwordIsValid = await this.passwordHashingService.verify(
      user.password!,
      password,
    );

    if (user.isActive && passwordIsValid) {
      return {
        aud: this.configService.getOrThrow<string>('jwt.aud'),
        sub: user.id,
        iss: this.configService.getOrThrow<string>('jwt.iss'),
      };
    }

    return false;
  }

  /**
   * Generate login token for authenticated user
   * @param command - Contains tenantId and jwtPayload
   * @returns Access token
   */
  async login(command: LoginCommand): Promise<LoginResult> {
    const { tenantId, jwtPayload } = command;

    if (!jwtPayload) {
      throw new UnauthorizedException('Usuario o contraseña inválidos');
    }

    const dbUser = await this.userRepository.findUserById(
      jwtPayload.sub,
      tenantId,
    );

    if (!dbUser) {
      throw new UnauthorizedException('Usuario o contraseña inválidos');
    }

    const payload: JwtPayloadInterface = {
      aud: this.configService.getOrThrow<string>('jwt.aud'),
      sub: dbUser.id,
      iss: this.configService.getOrThrow<string>('jwt.iss'),
    };

    return {
      access_token: this.jwtService.sign({ ...payload }, { expiresIn: '8h' }),
    };
  }
}
