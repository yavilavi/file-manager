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
import {
  IPasswordHashingService,
  PASSWORD_HASHING_SERVICE,
} from '@shared/interfaces/password-hashing.interface';
import { 
  IUserCredentialsRepository, 
  USER_CREDENTIALS_REPOSITORY 
} from '../../domain/repositories/user-credentials.repository.interface';
import { AuthenticationDomainService } from '../../domain/services/authentication.domain-service';
import { JwtApplicationService } from '../services/jwt.service';
import { Email } from '@shared/domain/value-objects/email.value-object';
import { 
  ValidateUserCommand, 
  LoginCommand, 
  LoginResult, 
  ValidateUserResult 
} from '../dtos/authentication.dto';

/**
 * Authentication Use Case
 * Following Single Responsibility Principle (SRP) - only handles authentication logic
 * Following Dependency Inversion Principle (DIP) - depends on abstractions
 * Following Clean Architecture - orchestrates domain services and repositories
 */
@Injectable()
export class AuthenticationUseCase {
  constructor(
    private readonly jwtApplicationService: JwtApplicationService,
    @Inject(USER_CREDENTIALS_REPOSITORY)
    private readonly userCredentialsRepository: IUserCredentialsRepository,
    @Inject(PASSWORD_HASHING_SERVICE)
    private readonly passwordHashingService: IPasswordHashingService,
    private readonly authenticationDomainService: AuthenticationDomainService,
  ) {}

  /**
   * Validate user credentials
   * @param command - Contains email, password and optional tenantId
   * @returns Validation result with JWT payload if valid
   */
  async validateUser(command: ValidateUserCommand): Promise<ValidateUserResult> {
    const { email, password, tenantId } = command;

    // Create email value object
    const emailVO = Email.create(email);

    // Find user credentials
    const credentials = await this.userCredentialsRepository.findByEmail(
      emailVO,
      tenantId,
    );

    // Validate credentials using domain service
    const isValid = await this.authenticationDomainService.validateCredentials(
      credentials,
      password,
      this.passwordHashingService,
    );

    if (!isValid || !credentials) {
      return { isValid: false };
    }

    // Create JWT payload using domain service
    const jwtConfig = this.jwtApplicationService.getJwtConfig();

    const jwtPayload = this.authenticationDomainService.createAuthPayload(
      credentials,
      jwtConfig,
    );

    return {
      isValid: true,
      jwtPayload,
    };
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

    // Verify user still exists and is active
    const credentials = await this.userCredentialsRepository.findById(
      jwtPayload.sub,
      tenantId,
    );

    if (
      !credentials ||
      !this.authenticationDomainService.canUserAuthenticate(credentials)
    ) {
      throw new UnauthorizedException('Usuario o contraseña inválidos');
    }

    return {
      access_token: this.jwtApplicationService.generateAccessToken(jwtPayload),
    };
  }
}
