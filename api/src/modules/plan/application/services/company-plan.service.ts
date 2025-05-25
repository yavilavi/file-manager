/**
 * File Manager - company-plan.service Service
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ICompanyPlanRepository,
  COMPANY_PLAN_REPOSITORY,
} from '../../domain/repositories/company-plan-repository.interface';
import { CompanyPlan } from '../../domain/entities/company-plan.entity';
import { CreateCompanyPlanDto } from '../dtos/create-company-plan.dto';
import { UpdateCompanyPlanDto } from '../dtos/update-company-plan.dto';
import {
  IPlanRepository,
  PLAN_REPOSITORY,
} from '../../domain/repositories/plan-repository.interface';
import { CompanyPlanCreatedEvent } from '../../domain/events/company-plan-created.event';

/**
 * Refactored CompanyPlanService without circular dependency
 * Following Single Responsibility Principle (SRP) - only handles company plan operations
 * Following Open/Closed Principle (OCP) - uses events for extension
 * Circular dependency resolved by emitting domain events instead of direct service calls
 */
@Injectable()
export class CompanyPlanService {
  constructor(
    @Inject(COMPANY_PLAN_REPOSITORY)
    private readonly companyPlanRepository: ICompanyPlanRepository,

    @Inject(PLAN_REPOSITORY)
    private readonly planRepository: IPlanRepository,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(): Promise<CompanyPlan[]> {
    return this.companyPlanRepository.findAll();
  }

  async findById(id: number): Promise<CompanyPlan> {
    const companyPlan = await this.companyPlanRepository.findById(id);
    if (!companyPlan) {
      throw new NotFoundException(`Company plan with ID ${id} not found`);
    }
    return companyPlan;
  }

  async findByTenantId(tenantId: string): Promise<CompanyPlan> {
    const companyPlan =
      await this.companyPlanRepository.findByTenantId(tenantId);
    if (!companyPlan) {
      throw new NotFoundException(
        `Company plan for tenant ${tenantId} not found`,
      );
    }
    return companyPlan;
  }

  async findWithPlan(id: number): Promise<CompanyPlan> {
    const companyPlan = await this.companyPlanRepository.findWithPlan(id);
    if (!companyPlan) {
      throw new NotFoundException(`Company plan with ID ${id} not found`);
    }
    return companyPlan;
  }

  async create(
    createCompanyPlanDto: CreateCompanyPlanDto,
  ): Promise<CompanyPlan> {
    // Check if plan exists
    const plan = await this.planRepository.findById(
      createCompanyPlanDto.planId,
    );
    if (!plan) {
      throw new NotFoundException(
        `Plan with ID ${createCompanyPlanDto.planId} not found`,
      );
    }

    // Check if tenant already has a plan
    const existingPlan = await this.companyPlanRepository.findByTenantId(
      createCompanyPlanDto.tenantId,
    );
    if (existingPlan) {
      // Deactivate existing plan
      await this.companyPlanRepository.deactivate(existingPlan.id);
    }

    const companyPlan = new CompanyPlan({
      tenantId: createCompanyPlanDto.tenantId,
      planId: createCompanyPlanDto.planId,
      startDate: createCompanyPlanDto.startDate
        ? new Date(createCompanyPlanDto.startDate)
        : undefined,
      endDate: createCompanyPlanDto.endDate
        ? new Date(createCompanyPlanDto.endDate)
        : null,
      isActive: true,
      storageUsed: BigInt(0),
    });

    const createdCompanyPlan =
      await this.companyPlanRepository.create(companyPlan);

    // Emit domain event for credits granting (replaces direct service call)
    if (plan.creditsIncluded > 0) {
      try {
        const event = new CompanyPlanCreatedEvent({
          companyPlanId: createdCompanyPlan.id,
          tenantId: createdCompanyPlan.tenantId,
          planId: plan.id,
          planName: plan.name,
          creditsIncluded: plan.creditsIncluded,
          startDate: createdCompanyPlan.startDate,
          endDate: createdCompanyPlan.endDate,
        });

        this.eventEmitter.emit(CompanyPlanCreatedEvent.EVENT_NAME, event);

        console.log(
          `Emitted CompanyPlanCreatedEvent for tenant ${createdCompanyPlan.tenantId} with ${plan.creditsIncluded} credits`,
        );
      } catch (error) {
        // Log error but don't fail the plan creation
        console.error('Failed to emit CompanyPlanCreatedEvent:', error);
      }
    }

    return createdCompanyPlan;
  }

  async update(
    id: number,
    updateCompanyPlanDto: UpdateCompanyPlanDto,
  ): Promise<CompanyPlan> {
    const existingCompanyPlan = await this.findById(id);

    // If changing plan, validate new plan exists
    if (updateCompanyPlanDto.planId) {
      const plan = await this.planRepository.findById(
        updateCompanyPlanDto.planId,
      );
      if (!plan) {
        throw new NotFoundException(
          `Plan with ID ${updateCompanyPlanDto.planId} not found`,
        );
      }
    }

    const updateData: Partial<CompanyPlan> = {};

    if (updateCompanyPlanDto.planId !== undefined) {
      updateData.planId = updateCompanyPlanDto.planId;
    }
    if (updateCompanyPlanDto.startDate !== undefined) {
      updateData.startDate = new Date(updateCompanyPlanDto.startDate);
    }
    if (updateCompanyPlanDto.endDate !== undefined) {
      updateData.endDate = new Date(updateCompanyPlanDto.endDate);
    }
    if (updateCompanyPlanDto.isActive !== undefined) {
      updateData.isActive = updateCompanyPlanDto.isActive;
    }

    return this.companyPlanRepository.update(id, updateData);
  }

  async deactivate(id: number): Promise<void> {
    const companyPlan = await this.findById(id);
    await this.companyPlanRepository.deactivate(id);
  }

  async updateStorageUsed(
    tenantId: string,
    storageUsed: bigint,
  ): Promise<CompanyPlan> {
    return this.companyPlanRepository.updateStorageUsed(tenantId, storageUsed);
  }
}
