/**
 * File Manager - Company Plan Created Event
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { BaseDomainEvent } from '@shared/domain/events/base-domain-event';

export interface CompanyPlanCreatedEventData {
  companyPlanId: number;
  tenantId: string;
  planId: number;
  planName: string;
  creditsIncluded: number;
  startDate: Date;
  endDate: Date | null;
}

/**
 * Domain event emitted when a company plan is created
 * Following Open/Closed Principle (OCP) - allows extension without modifying existing code
 */
export class CompanyPlanCreatedEvent extends BaseDomainEvent {
  static readonly EVENT_NAME = 'company.plan.created';

  constructor(data: CompanyPlanCreatedEventData) {
    super(
      data.companyPlanId,
      'CompanyPlan',
      CompanyPlanCreatedEvent.EVENT_NAME,
      data,
    );
  }

  get companyPlanId(): number {
    return this.eventData.companyPlanId;
  }

  get tenantId(): string {
    return this.eventData.tenantId;
  }

  get planId(): number {
    return this.eventData.planId;
  }

  get planName(): string {
    return this.eventData.planName;
  }

  get creditsIncluded(): number {
    return this.eventData.creditsIncluded;
  }

  get startDate(): Date {
    return this.eventData.startDate;
  }

  get endDate(): Date | null {
    return this.eventData.endDate;
  }
}
