/**
 * File Manager - company-plan.service Service
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
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
import { CreditsService } from '../../../credits/application/services/credits.service';

@Injectable()
export class CompanyPlanService {
  constructor(
    @Inject(COMPANY_PLAN_REPOSITORY)
    private readonly companyPlanRepository: ICompanyPlanRepository,

    @Inject(PLAN_REPOSITORY)
    private readonly planRepository: IPlanRepository,

    @Inject(forwardRef(() => CreditsService))
    private readonly creditsService: CreditsService,
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

    // Grant included credits if the plan has any
    if (plan.creditsIncluded > 0) {
      try {
        await this.creditsService.purchaseCredits(
          createCompanyPlanDto.tenantId,
          {
            amount: plan.creditsIncluded,
            description: `CrÃ©ditos incluidos con el plan ${plan.name}`,
          },
        );
      } catch (error) {
        // Log error but don't fail the plan creation
        console.error('Failed to grant included credits:', error);
      }
    }

    return createdCompanyPlan;
  }

  async update(
    id: number,
    updateCompanyPlanDto: UpdateCompanyPlanDto,
  ): Promise<CompanyPlan> {
    // Check if company plan exists
    await this.findById(id);

    // Check if plan exists if planId is provided
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

    // Create update data object with the correct types
    const updateData: Partial<CompanyPlan> = {};

    if (updateCompanyPlanDto.planId)
      updateData.planId = updateCompanyPlanDto.planId;
    if (updateCompanyPlanDto.startDate)
      updateData.startDate = new Date(updateCompanyPlanDto.startDate);
    if (updateCompanyPlanDto.endDate)
      updateData.endDate = new Date(updateCompanyPlanDto.endDate);
    if (updateCompanyPlanDto.isActive !== undefined)
      updateData.isActive = updateCompanyPlanDto.isActive;

    return this.companyPlanRepository.update(id, updateData);
  }

  async updateStorageUsed(
    tenantId: string,
    storageUsed: bigint,
  ): Promise<CompanyPlan> {
    return this.companyPlanRepository.updateStorageUsed(tenantId, storageUsed);
  }

  async deactivate(id: number): Promise<void> {
    // Check if company plan exists
    await this.findById(id);

    return this.companyPlanRepository.deactivate(id);
  }

  async findActive(): Promise<CompanyPlan[]> {
    return this.companyPlanRepository.findActive();
  }
}
