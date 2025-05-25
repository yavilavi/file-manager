/**
 * File Manager - credits.service Service
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Injectable, Inject } from '@nestjs/common';
import { CompanyCreditsRepository } from '../../domain/repositories/company-credits.repository';
import { CreditTransactionRepository } from '../../domain/repositories/credit-transaction.repository';
import { CompanyCreditsEntity } from '../../domain/entities/company-credits.entity';
import { CreditTransactionEntity } from '../../domain/entities/credit-transaction.entity';
import { TransactionType } from '../../domain/value-objects/transaction-type.enum';
import { PurchaseCreditsDto } from '../dtos/purchase-credits.dto';
import { UseCreditsDto } from '../dtos/use-credits.dto';
import { CompanyCreditsDto } from '../dtos/company-credits.dto';
import { CreditTransactionDto } from '../dtos/credit-transaction.dto';
import { PlanInfoService } from './plan-info.service';

/**
 * Refactored CreditsService without circular dependency
 * Following Single Responsibility Principle (SRP) - only handles credit operations
 * Following Dependency Inversion Principle (DIP) - depends on abstractions
 * Circular dependency resolved by using PlanInfoService instead of CompanyPlanService
 */
@Injectable()
export class CreditsService {
  constructor(
    @Inject('CompanyCreditsRepository')
    private readonly companyCreditsRepository: CompanyCreditsRepository,
    @Inject('CreditTransactionRepository')
    private readonly creditTransactionRepository: CreditTransactionRepository,
    private readonly planInfoService: PlanInfoService,
  ) {}

  async getCompanyCredits(tenantId: string): Promise<CompanyCreditsDto> {
    let companyCredits =
      await this.companyCreditsRepository.findByTenantId(tenantId);

    if (!companyCredits) {
      // Get the company's plan to determine included credits
      let planIncludedCredits = 0;
      try {
        const planInfo = await this.planInfoService.getActivePlanInfo(tenantId);
        if (planInfo && planInfo.creditsIncluded > 0) {
          planIncludedCredits = planInfo.creditsIncluded;
        }
      } catch {
        // If no plan is found, start with 0 credits
        console.warn(
          `No plan found for tenant ${tenantId}, creating credits record with 0 balance`,
        );
      }

      // Create new company credits record with plan included credits as balance
      companyCredits = new CompanyCreditsEntity(
        0, // ID will be set by database
        tenantId,
        planIncludedCredits, // Total purchased includes plan credits
        planIncludedCredits, // Current balance starts with plan credits
        planIncludedCredits > 0 ? new Date() : null, // Last purchase date if credits were included
        new Date(), // Created at
        new Date(), // Updated at
      );

      companyCredits =
        await this.companyCreditsRepository.create(companyCredits);

      // Create transaction record for plan included credits if any
      if (planIncludedCredits > 0) {
        const transaction = new CreditTransactionEntity(
          0, // ID will be set by database
          TransactionType.PURCHASE,
          planIncludedCredits,
          `Créditos incluidos con el plan`,
          tenantId,
          null, // No reference ID for plan credits
          new Date(),
        );

        await this.creditTransactionRepository.create(transaction);
      }
    }

    return this.mapToCompanyCreditsDto(companyCredits);
  }

  async purchaseCredits(
    tenantId: string,
    purchaseDto: PurchaseCreditsDto,
  ): Promise<CompanyCreditsDto> {
    // Find or create company credits record
    let companyCredits =
      await this.companyCreditsRepository.findByTenantId(tenantId);

    if (!companyCredits) {
      // Create new company credits record if it doesn't exist
      companyCredits = new CompanyCreditsEntity(
        0, // ID will be set by database
        tenantId,
        0, // Total purchased
        0, // Current balance
        null, // Last purchase date
        new Date(), // Created at
        new Date(), // Updated at
      );
      companyCredits =
        await this.companyCreditsRepository.create(companyCredits);
    }

    // Add credits to company
    companyCredits.addCredits(purchaseDto.amount);

    // Save updated company credits
    const updatedCompanyCredits =
      await this.companyCreditsRepository.save(companyCredits);

    // Create transaction record
    const transaction = new CreditTransactionEntity(
      0, // ID will be set by database
      TransactionType.PURCHASE,
      purchaseDto.amount,
      purchaseDto.description ||
        `Credit purchase of ${purchaseDto.amount} credits`,
      tenantId,
      null, // No reference ID for purchases
      new Date(),
    );

    await this.creditTransactionRepository.create(transaction);

    return this.mapToCompanyCreditsDto(updatedCompanyCredits);
  }

  async useCredits(
    tenantId: string,
    useDto: UseCreditsDto,
  ): Promise<CompanyCreditsDto> {
    // Find company credits record
    const companyCredits =
      await this.companyCreditsRepository.findByTenantId(tenantId);

    if (!companyCredits) {
      throw new Error(`No credits record found for tenant ${tenantId}`);
    }

    // Use credits from company balance
    companyCredits.useCredits(useDto.amount);

    // Save updated company credits
    const updatedCompanyCredits =
      await this.companyCreditsRepository.save(companyCredits);

    // Create transaction record
    const transaction = new CreditTransactionEntity(
      0, // ID will be set by database
      TransactionType.USAGE,
      useDto.amount,
      useDto.description || `Credit usage of ${useDto.amount} credits`,
      tenantId,
      useDto.referenceId || null,
      new Date(),
    );

    await this.creditTransactionRepository.create(transaction);

    return this.mapToCompanyCreditsDto(updatedCompanyCredits);
  }

  async getCreditTransactions(
    tenantId: string,
  ): Promise<CreditTransactionDto[]> {
    const transactions =
      await this.creditTransactionRepository.findByTenantId(tenantId);

    return transactions.map((transaction) => ({
      id: transaction.getId(),
      transactionType: transaction.getTransactionType(),
      amount: transaction.getAmount(),
      description: transaction.getDescription(),
      tenantId: transaction.getTenantId(),
      referenceId: transaction.getReferenceId(),
      createdAt: transaction.getCreatedAt(),
    }));
  }

  private mapToCompanyCreditsDto(
    entity: CompanyCreditsEntity,
  ): CompanyCreditsDto {
    return {
      id: entity.getId(),
      tenantId: entity.getTenantId(),
      totalPurchased: entity.getTotalPurchased(),
      currentBalance: entity.getCurrentBalance(),
      lastPurchaseAt: entity.getLastPurchaseAt(),
      createdAt: entity.getCreatedAt(),
      updatedAt: entity.getUpdatedAt(),
    };
  }
}
