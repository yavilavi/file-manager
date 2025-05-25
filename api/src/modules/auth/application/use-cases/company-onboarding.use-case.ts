/**
 * File Manager - Company Onboarding Use Case
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import {
  CompanyCreationUseCase,
  CreateCompanyCommand,
} from './company-creation.use-case';
import {
  UserRegistrationUseCase,
  RegisterUserCommand,
} from './user-registration.use-case';
import { RoleInitializationService } from '@modules/tenant/application/services/role-initialization.service';

export interface OnboardCompanyCommand {
  company: {
    name: string;
    nit: string;
    tenantId: string;
    departments: Array<{ name: string }>;
    planId?: number;
  };
  user: {
    name: string;
    email: string;
    password: string;
    departmentId: number; // Index in departments array
  };
}

export interface OnboardingResult {
  redirectUrl: string;
}

/**
 * Company Onboarding Use Case
 * Following Single Responsibility Principle (SRP) - orchestrates company signup process
 * Following Open/Closed Principle (OCP) - open for extension via events
 */
@Injectable()
export class CompanyOnboardingUseCase {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly roleInitializationService: RoleInitializationService,
    private readonly companyCreationUseCase: CompanyCreationUseCase,
    private readonly userRegistrationUseCase: UserRegistrationUseCase,
  ) {}

  /**
   * Execute complete company onboarding process
   * @param command - Company and user data
   * @returns Promise with redirect URL
   */
  async execute(command: OnboardCompanyCommand): Promise<OnboardingResult> {
    return await this.prisma.client.$transaction(async (tx) => {
      const { company, user } = command;

      // 1. Create company with departments (excluding user department initially)
      const otherDepartments = company.departments.filter(
        (_, index) => index !== user.departmentId,
      );

      const companyCommand: CreateCompanyCommand = {
        name: company.name,
        nit: company.nit,
        tenantId: company.tenantId,
        departments: otherDepartments,
      };

      const companyResult =
        await this.companyCreationUseCase.execute(companyCommand);

      // 2. Create user department via direct transaction
      const userDepartment = company.departments[user.departmentId];
      const createdUserDepartment = await tx.department.create({
        data: {
          name: userDepartment.name,
          company: {
            connect: {
              id: companyResult.company.id,
              tenantId: company.tenantId,
            },
          },
        },
      });

      // 3. Register admin user
      const userCommand: RegisterUserCommand = {
        name: user.name,
        email: user.email,
        password: user.password,
        tenantId: company.tenantId,
        departmentId: createdUserDepartment.id,
        isActive: true,
      };

      const createdUser =
        await this.userRegistrationUseCase.execute(userCommand);

      // 4. Create company plan if provided
      if (company.planId) {
        await tx.companyPlan.create({
          data: {
            tenantId: company.tenantId,
            planId: company.planId,
            startDate: new Date(),
            isActive: true,
            storageUsed: BigInt(0),
          },
        });
      }

      // 5. Initialize super admin role and assign to user
      await this.roleInitializationService.initializeSuperAdminRole({
        tenantId: company.tenantId,
        userId: createdUser.id,
        tx,
      });

      // 6. Emit events for side effects
      this.eventEmitter.emit('company.created', {
        company: command.company,
        user: command.user,
      });

      this.eventEmitter.emit('user.created', {
        user: {
          name: user.name,
          email: user.email,
          password: user.password,
        },
        company: {
          name: company.name,
          tenantId: company.tenantId,
        },
      });

      // 7. Generate redirect URL
      const protocol = this.configService.get('protocol') ?? 'http';
      const baseUrl = this.configService.getOrThrow('baseAppUrl');
      const redirectUrl = `${protocol}://${company.tenantId}.${baseUrl}`;

      return { redirectUrl };
    });
  }
}
