/**
 * File Manager - Plan Info Service
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma/prisma.service';

export interface PlanInfo {
  planId: number;
  planName: string;
  creditsIncluded: number;
}

/**
 * Plan Info Service for Credits Module
 * Following Single Responsibility Principle (SRP) - only provides plan information
 * Following Dependency Inversion Principle (DIP) - depends on Prisma abstraction
 * This service eliminates the circular dependency by directly querying plan data
 */
@Injectable()
export class PlanInfoService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get plan information for a tenant's active company plan
   * @param tenantId - Tenant identifier
   * @returns Promise with plan info or null if no active plan
   */
  async getActivePlanInfo(tenantId: string): Promise<PlanInfo | null> {
    const companyPlan = await this.prisma.client.companyPlan.findFirst({
      where: {
        tenantId,
        isActive: true,
      },
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            creditsIncluded: true,
          },
        },
      },
    });

    if (!companyPlan || !companyPlan.plan) {
      return null;
    }

    return {
      planId: companyPlan.plan.id,
      planName: companyPlan.plan.name,
      creditsIncluded: companyPlan.plan.creditsIncluded,
    };
  }

  /**
   * Check if a tenant has an active plan
   * @param tenantId - Tenant identifier
   * @returns Promise with boolean indicating if tenant has active plan
   */
  async hasActivePlan(tenantId: string): Promise<boolean> {
    const count = await this.prisma.client.companyPlan.count({
      where: {
        tenantId,
        isActive: true,
      },
    });

    return count > 0;
  }
}
