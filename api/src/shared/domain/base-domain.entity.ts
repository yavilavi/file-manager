/**
 * File Manager - Base Domain Entity
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { IDomainEvent } from './events/base-domain-event';

/**
 * Base Domain Entity
 * Following Single Responsibility Principle (SRP) - provides common domain entity functionality
 * Following Domain-Driven Design patterns
 */
export abstract class DomainEntity {
  private _domainEvents: IDomainEvent[] = [];

  /**
   * Get all domain events for this entity
   * @returns Array of domain events
   */
  get domainEvents(): readonly IDomainEvent[] {
    return [...this._domainEvents];
  }

  /**
   * Add a domain event to this entity
   * @param event - Domain event to add
   */
  protected addDomainEvent(event: IDomainEvent): void {
    this._domainEvents.push(event);
  }

  /**
   * Clear all domain events from this entity
   * Usually called after events have been published
   */
  public clearDomainEvents(): void {
    this._domainEvents = [];
  }

  /**
   * Mark events as committed (alias for clearDomainEvents)
   * Following explicit naming conventions
   */
  public markEventsAsCommitted(): void {
    this.clearDomainEvents();
  }

  /**
   * Check if entity has unpublished domain events
   * @returns Boolean indicating if there are pending events
   */
  public hasDomainEvents(): boolean {
    return this._domainEvents.length > 0;
  }
} 