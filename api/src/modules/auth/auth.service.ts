/**
 * File Manager - auth.service Service
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Injectable } from '@nestjs/common';
import { SignupDto } from '@modules/auth/dtos/signup.dto';
import {
  AuthenticationUseCase,
  ValidateUserCommand,
  LoginCommand,
} from './application/use-cases/authentication.use-case';
import {
  CompanyOnboardingUseCase,
  OnboardCompanyCommand,
} from './application/use-cases/company-onboarding.use-case';
import { JwtPayloadInterface } from '@shared/interfaces/jwt-payload.interface';

/**
 * Refactored AuthService following Clean Architecture principles
 * Following Single Responsibility Principle (SRP) - delegates to specific use cases
 * Following Dependency Inversion Principle (DIP) - depends on use case abstractions
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly authenticationUseCase: AuthenticationUseCase,
    private readonly companyOnboardingUseCase: CompanyOnboardingUseCase,
  ) {}

  /**
   * Validate user credentials
   * @param username - User email
   * @param pass - User password
   * @param tenantId - Optional tenant ID
   * @returns JWT payload or false if invalid
   */
  async validateUser(
    username: string,
    pass: string,
    tenantId?: string,
  ): Promise<false | JwtPayloadInterface> {
    const command: ValidateUserCommand = {
      email: username,
      password: pass,
      tenantId,
    };

    return await this.authenticationUseCase.validateUser(command);
  }

  /**
   * Generate login token for authenticated user
   * @param tenantId - Tenant ID
   * @param jwtPayload - JWT payload from validation
   * @returns Access token
   */
  async login(tenantId: string, jwtPayload?: JwtPayloadInterface) {
    const command: LoginCommand = {
      tenantId,
      jwtPayload: jwtPayload!,
    };

    return await this.authenticationUseCase.login(command);
  }

  /**
   * Complete company signup process
   * @param signupDto - Company and user signup data
   * @returns Redirect URL for the new tenant
   */
  async signup(signupDto: SignupDto) {
    const command: OnboardCompanyCommand = {
      company: {
        name: signupDto.company.name,
        nit: signupDto.company.nit,
        tenantId: signupDto.company.tenantId,
        departments: signupDto.company.departments,
        planId: signupDto.company.planId,
      },
      user: {
        name: signupDto.user.name,
        email: signupDto.user.email,
        password: signupDto.user.password,
        departmentId: signupDto.user.departmentId,
      },
    };

    return await this.companyOnboardingUseCase.execute(command);
  }
}
