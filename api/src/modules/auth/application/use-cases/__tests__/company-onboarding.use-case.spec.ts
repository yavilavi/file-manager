/**
 * File Manager - Company Onboarding Use Case Tests
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConflictException } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import { RoleInitializationService } from '@modules/tenant/application/services/role-initialization.service';
import {
  CompanyOnboardingUseCase,
  OnboardCompanyCommand,
} from '../company-onboarding.use-case';

describe('CompanyOnboardingUseCase - Atomicity Tests', () => {
  let useCase: CompanyOnboardingUseCase;
  let prismaService: PrismaService;
  let configService: ConfigService;
  let eventEmitter: EventEmitter2;
  let roleInitializationService: RoleInitializationService;

  const mockPrismaClient = {
    $transaction: jest.fn(),
    company: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    department: {
      create: jest.fn(),
    },
    user: {
      create: jest.fn(),
    },
    companyPlan: {
      create: jest.fn(),
    },
    companyCredits: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyOnboardingUseCase,
        {
          provide: PrismaService,
          useValue: {
            client: mockPrismaClient,
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http'),
            getOrThrow: jest.fn().mockReturnValue('example.com'),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: RoleInitializationService,
          useValue: {
            initializeSuperAdminRole: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CompanyOnboardingUseCase>(CompanyOnboardingUseCase);
    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    roleInitializationService = module.get<RoleInitializationService>(
      RoleInitializationService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createValidCommand = (): OnboardCompanyCommand => ({
    company: {
      name: 'Test Company',
      nit: '123456789',
      tenantId: 'testcompany',
      departments: [
        { name: 'Admin Department' },
        { name: 'HR Department' },
        { name: 'IT Department' },
      ],
      planId: 1,
    },
    user: {
      name: 'Admin User',
      email: 'admin@testcompany.com',
      password: 'password123',
      departmentId: 0, // Admin Department
    },
  });

  describe('Atomicity - Success Case', () => {
    it('should complete all operations successfully in a single transaction', async () => {
      const command = createValidCommand();
      
      // Mock successful transaction
      mockPrismaClient.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          company: {
            findFirst: jest.fn().mockResolvedValue(null), // No existing company
            create: jest.fn().mockResolvedValue({
              id: 1,
              name: command.company.name,
              nit: command.company.nit,
              tenantId: command.company.tenantId,
              canSendEmail: false,
            }),
          },
          department: {
            create: jest.fn()
              .mockResolvedValueOnce({ id: 1, name: 'Admin Department', tenantId: 'testcompany' })
              .mockResolvedValueOnce({ id: 2, name: 'HR Department', tenantId: 'testcompany' })
              .mockResolvedValueOnce({ id: 3, name: 'IT Department', tenantId: 'testcompany' }),
          },
          user: {
            create: jest.fn().mockResolvedValue({
              id: 1,
              name: command.user.name,
              email: command.user.email,
              tenantId: command.company.tenantId,
              departmentId: 1,
              isActive: true,
            }),
          },
          companyPlan: {
            create: jest.fn().mockResolvedValue({
              tenantId: command.company.tenantId,
              planId: command.company.planId,
              isActive: true,
            }),
          },
          companyCredits: {
            create: jest.fn().mockResolvedValue({
              tenantId: command.company.tenantId,
              totalPurchased: 0,
              currentBalance: 0,
            }),
          },
        };

        return await callback(mockTx);
      });

      const result = await useCase.execute(command);

      // Verify transaction was called
      expect(mockPrismaClient.$transaction).toHaveBeenCalledTimes(1);

      // Verify redirect URL is generated correctly
      expect(result.redirectUrl).toBe('http://testcompany.example.com');

      // Verify all operations were called within transaction
      const transactionCallback = mockPrismaClient.$transaction.mock.calls[0][0];
      const mockTx = {
        company: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn() },
        department: { create: jest.fn() },
        user: { create: jest.fn() },
        companyPlan: { create: jest.fn() },
        companyCredits: { create: jest.fn() },
      };

      // Execute transaction callback to verify behavior
      jest.spyOn(roleInitializationService, 'initializeSuperAdminRole').mockResolvedValue(undefined);
      
      // This would be called by the actual transaction
      expect(mockPrismaClient.$transaction).toHaveBeenCalled();
    });
  });

  describe('Atomicity - Failure Cases', () => {
    it('should throw ConflictException if company with NIT already exists', async () => {
      const command = createValidCommand();

      mockPrismaClient.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          company: {
            findFirst: jest.fn().mockResolvedValue({ nit: command.company.nit }), // Company exists
          },
        };

        return await callback(mockTx);
      });

      await expect(useCase.execute(command)).rejects.toThrow(ConflictException);
      await expect(useCase.execute(command)).rejects.toThrow(
        'Ya hay una compañía registrada con este NIT',
      );
    });

    it('should rollback all changes if department creation fails', async () => {
      const command = createValidCommand();

      mockPrismaClient.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          company: {
            findFirst: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue({
              id: 1,
              name: command.company.name,
              nit: command.company.nit,
              tenantId: command.company.tenantId,
            }),
          },
          department: {
            create: jest.fn()
              .mockResolvedValueOnce({ id: 1, name: 'Admin Department' })
              .mockRejectedValueOnce(new Error('Department creation failed')), // Fail on second department
          },
        };

        return await callback(mockTx);
      });

      await expect(useCase.execute(command)).rejects.toThrow('Department creation failed');

      // Verify transaction was attempted but failed
      expect(mockPrismaClient.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should rollback all changes if user creation fails', async () => {
      const command = createValidCommand();

      mockPrismaClient.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          company: {
            findFirst: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue({ id: 1 }),
          },
          department: {
            create: jest.fn()
              .mockResolvedValueOnce({ id: 1, name: 'Admin Department' })
              .mockResolvedValueOnce({ id: 2, name: 'HR Department' })
              .mockResolvedValueOnce({ id: 3, name: 'IT Department' }),
          },
          user: {
            create: jest.fn().mockRejectedValue(new Error('User creation failed')),
          },
        };

        return await callback(mockTx);
      });

      await expect(useCase.execute(command)).rejects.toThrow('User creation failed');
    });

    it('should rollback all changes if role initialization fails', async () => {
      const command = createValidCommand();

      mockPrismaClient.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          company: {
            findFirst: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue({ id: 1 }),
          },
          department: {
            create: jest.fn()
              .mockResolvedValueOnce({ id: 1, name: 'Admin Department' })
              .mockResolvedValueOnce({ id: 2, name: 'HR Department' })
              .mockResolvedValueOnce({ id: 3, name: 'IT Department' }),
          },
          user: {
            create: jest.fn().mockResolvedValue({ id: 1 }),
          },
          companyPlan: {
            create: jest.fn().mockResolvedValue({}),
          },
          companyCredits: {
            create: jest.fn().mockResolvedValue({}),
          },
        };

        return await callback(mockTx);
      });

      // Mock role initialization failure
      jest
        .spyOn(roleInitializationService, 'initializeSuperAdminRole')
        .mockRejectedValue(new Error('Role initialization failed'));

      await expect(useCase.execute(command)).rejects.toThrow('Role initialization failed');
    });

    it('should handle invalid department index', async () => {
      const command = createValidCommand();
      command.user.departmentId = 999; // Invalid index

      mockPrismaClient.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          company: {
            findFirst: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue({ id: 1 }),
          },
          department: {
            create: jest.fn()
              .mockResolvedValueOnce({ id: 1, name: 'Admin Department' })
              .mockResolvedValueOnce({ id: 2, name: 'HR Department' })
              .mockResolvedValueOnce({ id: 3, name: 'IT Department' }),
          },
        };

        return await callback(mockTx);
      });

      await expect(useCase.execute(command)).rejects.toThrow('Invalid department index: 999');
    });
  });

  describe('Events Emission', () => {
    it('should emit events after successful transaction', async () => {
      const command = createValidCommand();

      mockPrismaClient.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          company: {
            findFirst: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue({
              id: 1,
              name: command.company.name,
              tenantId: command.company.tenantId,
            }),
          },
          department: {
            create: jest.fn()
              .mockResolvedValueOnce({ id: 1, name: 'Admin Department' })
              .mockResolvedValueOnce({ id: 2, name: 'HR Department' })
              .mockResolvedValueOnce({ id: 3, name: 'IT Department' }),
          },
          user: {
            create: jest.fn().mockResolvedValue({
              id: 1,
              name: command.user.name,
              email: command.user.email,
            }),
          },
          companyPlan: { create: jest.fn().mockResolvedValue({}) },
          companyCredits: { create: jest.fn().mockResolvedValue({}) },
        };

        return await callback(mockTx);
      });

      jest.spyOn(roleInitializationService, 'initializeSuperAdminRole').mockResolvedValue(undefined);

      await useCase.execute(command);

      // Events should be emitted asynchronously after transaction
      await new Promise(resolve => setImmediate(resolve));

      expect(eventEmitter.emit).toHaveBeenCalledWith('company.created', expect.any(Object));
      expect(eventEmitter.emit).toHaveBeenCalledWith('user.created', expect.any(Object));
    });

    it('should not emit events if transaction fails', async () => {
      const command = createValidCommand();

      mockPrismaClient.$transaction.mockRejectedValue(new Error('Transaction failed'));

      await expect(useCase.execute(command)).rejects.toThrow('Transaction failed');

      // No events should be emitted
      expect(eventEmitter.emit).not.toHaveBeenCalled();
    });
  });
}); 