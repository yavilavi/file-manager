/**
 * File Manager - Base Domain Event
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

/**
 * Base interface for all domain events
 * Following Open/Closed Principle (OCP) - open for extension
 */
export interface IDomainEvent {
  readonly eventId: string;
  readonly occurredOn: Date;
  readonly eventName: string;
  readonly aggregateId: string | number;
  readonly aggregateType: string;
  readonly eventData: Record<string, any>;
}

/**
 * Base implementation of domain event
 * Following Single Responsibility Principle (SRP)
 */
export abstract class BaseDomainEvent implements IDomainEvent {
  public readonly eventId: string;
  public readonly occurredOn: Date;
  public readonly eventName: string;
  public readonly aggregateId: string | number;
  public readonly aggregateType: string;
  public readonly eventData: Record<string, any>;

  constructor(
    aggregateId: string | number,
    aggregateType: string,
    eventName: string,
    eventData: Record<string, any> = {},
  ) {
    this.eventId = this.generateEventId();
    this.occurredOn = new Date();
    this.aggregateId = aggregateId;
    this.aggregateType = aggregateType;
    this.eventName = eventName;
    this.eventData = eventData;
  }

  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
