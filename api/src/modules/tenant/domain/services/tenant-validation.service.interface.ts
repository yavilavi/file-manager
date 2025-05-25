/**
 * File Manager - tenant-validation.service.interface Interface
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
export const TENANT_VALIDATION_SERVICE = 'TENANT_VALIDATION_SERVICE';

export interface ITenantValidationService {
  validateTenantIdentifier(tenantId: string): Promise<{
    isValid: boolean;
    errors: string[];
  }>;

  validateSubdomainAvailability(subdomain: string): Promise<{
    isAvailable: boolean;
    reason?: string;
  }>;

  validateCompanyInfo(
    name: string,
    nit: string,
  ): Promise<{
    isValid: boolean;
    errors: string[];
  }>;

  isReservedKeyword(identifier: string): boolean;
}
