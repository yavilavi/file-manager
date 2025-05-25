/**
 * File Manager - Check Subdomain Availability.Use Case
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { TenantIdentifier } from '../../domain/value-objects/tenant-identifier.vo';
import {
  TENANT_REPOSITORY,
  ITenantRepository,
} from '../../domain/repositories/tenant.repository.interface';
import {
  TENANT_VALIDATION_SERVICE,
  ITenantValidationService,
} from '../../domain/services/tenant-validation.service.interface';
import {
  CheckSubdomainDto,
  SubdomainAvailabilityResultDto,
} from '../dtos/check-subdomain.dto';

@Injectable()
export class CheckSubdomainAvailabilityUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
    @Inject(TENANT_VALIDATION_SERVICE)
    private readonly validationService: ITenantValidationService,
  ) {}

  async execute(
    dto: CheckSubdomainDto,
  ): Promise<SubdomainAvailabilityResultDto> {
    if (!dto.subdomain) {
      throw new BadRequestException('Subdomain is required');
    }

    try {
      // Validate subdomain format using value object
      const tenantId = TenantIdentifier.create(dto.subdomain);

      // Check if it's a reserved keyword
      if (this.validationService.isReservedKeyword(tenantId.value)) {
        return new SubdomainAvailabilityResultDto({
          available: false,
          reason: 'This subdomain is reserved and cannot be used',
          suggestions: this.generateAlternativeSuggestions(tenantId.value),
        });
      }

      // Check if subdomain is already taken
      const existingTenant = await this.tenantRepository.findById(
        tenantId.value,
      );
      if (existingTenant && existingTenant.isActive()) {
        return new SubdomainAvailabilityResultDto({
          available: false,
          reason: 'This subdomain is already taken',
          suggestions: this.generateAlternativeSuggestions(tenantId.value),
        });
      }

      // Additional validation through domain service
      const validationResult =
        await this.validationService.validateSubdomainAvailability(
          tenantId.value,
        );
      if (!validationResult.isAvailable) {
        return new SubdomainAvailabilityResultDto({
          available: false,
          reason: validationResult.reason || 'Subdomain is not available',
          suggestions: this.generateAlternativeSuggestions(tenantId.value),
        });
      }

      return new SubdomainAvailabilityResultDto({
        available: true,
      });
    } catch (error) {
      // If value object creation fails, it means invalid format
      return new SubdomainAvailabilityResultDto({
        available: false,
        reason:
          error instanceof Error ? error.message : 'Invalid subdomain format',
        suggestions: this.generateAlternativeSuggestions(dto.subdomain),
      });
    }
  }

  private generateAlternativeSuggestions(subdomain: string): string[] {
    const baseSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9]/g, '');
    const suggestions: string[] = [];

    // Add numeric suffixes
    for (let i = 1; i <= 3; i++) {
      suggestions.push(`${baseSubdomain}${i}`);
    }

    // Add common suffixes
    const suffixes = ['inc', 'corp', 'co', 'org'];
    suffixes.forEach((suffix) => {
      if (baseSubdomain.length + suffix.length <= 15) {
        suggestions.push(`${baseSubdomain}${suffix}`);
      }
    });

    return suggestions.slice(0, 5); // Return max 5 suggestions
  }
}
