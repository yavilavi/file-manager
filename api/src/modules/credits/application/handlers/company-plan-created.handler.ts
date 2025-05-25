/**
 * File Manager - Company Plan Created Event Handler
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CreditsService } from '../services/credits.service';
import { CompanyPlanCreatedEvent } from '@modules/plan/domain/events/company-plan-created.event';

/**
 * Event handler for CompanyPlanCreatedEvent
 * Following Single Responsibility Principle (SRP) - only handles plan creation events
 * Following Open/Closed Principle (OCP) - extends functionality without modifying existing code
 */
@Injectable()
export class CompanyPlanCreatedHandler {
  constructor(private readonly creditsService: CreditsService) {}

  /**
   * Handle company plan created event
   * Grant included credits when a new plan is created
   * @param event - Company plan created event
   */
  @OnEvent(CompanyPlanCreatedEvent.EVENT_NAME)
  async handleCompanyPlanCreated(
    event: CompanyPlanCreatedEvent,
  ): Promise<void> {
    try {
      // Only grant credits if the plan includes credits
      if (event.creditsIncluded > 0) {
        await this.creditsService.purchaseCredits(event.tenantId, {
          amount: event.creditsIncluded,
          description: `Créditos incluidos con el plan ${event.planName}`,
        });

        console.log(
          `Granted ${event.creditsIncluded} credits to tenant ${event.tenantId} for plan ${event.planName}`,
        );
      }
    } catch (error) {
      // Log error but don't throw - plan creation should not fail due to credits
      console.error('Failed to grant included credits:', error);
      // In a production environment, you might want to:
      // 1. Log to a proper logging service
      // 2. Send to an error tracking service
      // 3. Emit a compensation event to retry later
    }
  }
}
