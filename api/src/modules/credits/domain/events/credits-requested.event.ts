/**
 * File Manager - Credits Requested Event
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { BaseDomainEvent } from '@shared/domain/events/base-domain-event';

export interface CreditsRequestedEventData {
  tenantId: string;
  requestId: string;
}

/**
 * Domain event emitted when credits information is requested for a tenant
 * Following Open/Closed Principle (OCP) - allows extension without modifying existing code
 */
export class CreditsRequestedEvent extends BaseDomainEvent {
  static readonly EVENT_NAME = 'credits.requested';

  constructor(data: CreditsRequestedEventData) {
    super(
      data.tenantId,
      'CompanyCredits',
      CreditsRequestedEvent.EVENT_NAME,
      data,
    );
  }

  get tenantId(): string {
    return this.eventData.tenantId;
  }

  get requestId(): string {
    return this.eventData.requestId;
  }
}
