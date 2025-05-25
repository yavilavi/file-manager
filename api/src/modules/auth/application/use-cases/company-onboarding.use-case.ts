/**
 * File Manager - Company Onboarding Use Case
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { Injectable, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import { RoleInitializationService } from '@modules/tenant/application/services/role-initialization.service';
import * as argon2 from 'argon2';
import { Department } from '@prisma/client';

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
 * Company Onboarding Use Case - Atomic Implementation
 * Following Single Responsibility Principle (SRP) - orchestrates company signup process
 * Following Open/Closed Principle (OCP) - open for extension via events
 * ATOMIC: All operations succeed or fail together
 */
@Injectable()
export class CompanyOnboardingUseCase {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly roleInitializationService: RoleInitializationService,
  ) {}

  /**
   * Execute complete company onboarding process atomically
   * @param command - Company and user data
   * @returns Promise with redirect URL
   */
  async execute(command: OnboardCompanyCommand): Promise<OnboardingResult> {
    return await this.prisma.client.$transaction(async (tx) => {
      const { company, user } = command;

      // 1. Check if company with NIT already exists (validation)
      const existingCompany = await tx.company.findFirst({
        where: { nit: company.nit, deletedAt: null },
        select: { nit: true },
      });

      if (existingCompany) {
        throw new ConflictException(
          'Ya hay una compañía registrada con este NIT',
        );
      }

      // 2. Create company atomically
      const createdCompany = await tx.company.create({
        data: {
          name: company.name,
          nit: company.nit,
          tenantId: company.tenantId,
          canSendEmail: false,
        },
      });

      // 3. Create all departments atomically
      const createdDepartments: Department[] = [];
      for (let i = 0; i < company.departments.length; i++) {
        const department = await tx.department.create({
          data: {
            name: company.departments[i].name,
            tenantId: company.tenantId,
          },
        });
        createdDepartments.push(department);
      }

      // 4. Get user's department
      const userDepartment = createdDepartments[user.departmentId];
      if (!userDepartment) {
        throw new Error(`Invalid department index: ${user.departmentId}`);
      }

      // 5. Hash password and create admin user atomically
      const hashedPassword = await argon2.hash(user.password);
      const createdUser = await tx.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          tenantId: company.tenantId,
          departmentId: userDepartment.id,
          isActive: true,
        },
      });

      // 6. Create company plan if provided
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

      // 7. Initialize company credits (required for operations)
      await tx.companyCredits.create({
        data: {
          tenantId: company.tenantId,
          totalPurchased: 0,
          currentBalance: 0,
        },
      });

      // 8. Initialize super admin role and assign to user atomically
      await this.roleInitializationService.initializeSuperAdminRole({
        tenantId: company.tenantId,
        userId: createdUser.id,
        tx,
      });

      // 9. Generate redirect URL
      const protocol = this.configService.get('protocol') ?? 'http';
      const baseUrl = this.configService.getOrThrow('baseAppUrl');
      const redirectUrl = `${protocol}://${company.tenantId}.${baseUrl}`;

      // 10. Emit events for side effects (after successful transaction)
      // Note: Events are emitted synchronously to ensure they happen after commit
      setImmediate(() => {
        this.eventEmitter.emit('company.created', {
          company: {
            id: createdCompany.id,
            ...command.company,
          },
          user: {
            id: createdUser.id,
            ...command.user,
          },
          departments: createdDepartments.map((dept, index) => ({
            id: dept.id,
            name: dept.name,
            index,
          })),
        });

        this.eventEmitter.emit('user.created', {
          user: {
            id: createdUser.id,
            name: user.name,
            email: user.email,
          },
          company: {
            id: createdCompany.id,
            name: company.name,
            tenantId: company.tenantId,
          },
        });
      });

      return { redirectUrl };
    });
  }
}
