/**
 * File Manager - tenant-validation.service Service
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Injectable } from '@nestjs/common';
import { ITenantValidationService } from '../../domain/services/tenant-validation.service.interface';
import { TenantIdentifier } from '../../domain/value-objects/tenant-identifier.vo';
import { CompanyInfo } from '../../domain/value-objects/company-info.vo';

@Injectable()
export class TenantValidationService implements ITenantValidationService {
  private readonly reservedKeywords = [
    'api',
    'www',
    'admin',
    'root',
    'system',
    'public',
    'private',
    'mail',
    'email',
    'ftp',
    'http',
    'https',
    'ssl',
    'tls',
    'tenant',
    'tenants',
    'company',
    'companies',
    'app',
    'application',
    'web',
    'mobile',
    'dashboard',
    'portal',
    'support',
    'help',
    'docs',
    'documentation',
    'blog',
    'news',
    'status',
    'health',
    'ping',
    'test',
    'testing',
    'dev',
    'development',
    'staging',
    'prod',
    'production',
    'demo',
    'sample',
    'example',
  ];

  validateTenantIdentifier(tenantId: string): Promise<{
    isValid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    try {
      // Use value object for basic validation
      TenantIdentifier.create(tenantId);
    } catch (error) {
      if (error instanceof Error) {
        errors.push(error.message);
      }
    }

    // Additional business rule validations
    if (this.isReservedKeyword(tenantId)) {
      errors.push('This identifier is reserved and cannot be used');
    }

    // Check for common problematic patterns
    if (tenantId.includes('admin')) {
      errors.push('Identifier cannot contain "admin"');
    }

    if (tenantId.startsWith('test') || tenantId.startsWith('demo')) {
      errors.push('Identifier cannot start with "test" or "demo"');
    }

    return Promise.resolve({
      isValid: errors.length === 0,
      errors,
    });
  }

  validateSubdomainAvailability(subdomain: string): Promise<{
    isAvailable: boolean;
    reason?: string;
  }> {
    // Additional subdomain-specific validation
    try {
      const tenantId = TenantIdentifier.create(subdomain);

      // Check if it's valid for subdomain use
      if (!tenantId.isValidForSubdomain()) {
        return Promise.resolve({
          isAvailable: false,
          reason: 'Subdomain format is not valid for web use',
        });
      }

      // Check for consecutive special characters
      if (subdomain.includes('--') || subdomain.includes('__')) {
        return Promise.resolve({
          isAvailable: false,
          reason: 'Subdomain cannot contain consecutive hyphens or underscores',
        });
      }

      return Promise.resolve({
        isAvailable: true,
      });
    } catch (error) {
      return Promise.resolve({
        isAvailable: false,
        reason:
          error instanceof Error ? error.message : 'Invalid subdomain format',
      });
    }
  }

  validateCompanyInfo(
    name: string,
    nit: string,
  ): Promise<{
    isValid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    try {
      // Use value object for validation
      CompanyInfo.create({ name, nit });
    } catch (error) {
      if (error instanceof Error) {
        errors.push(error.message);
      }
    }

    // Additional business rule validations
    if (
      name.toLowerCase().includes('test') ||
      name.toLowerCase().includes('demo')
    ) {
      errors.push('Company name cannot contain "test" or "demo"');
    }

    // Check for suspicious patterns in company name
    const suspiciousPatterns = ['fake', 'dummy', 'sample', 'example'];
    const nameWords = name.toLowerCase().split(' ');

    for (const pattern of suspiciousPatterns) {
      if (nameWords.some((word) => word.includes(pattern))) {
        errors.push(`Company name cannot contain "${pattern}"`);
        break;
      }
    }

    return Promise.resolve({
      isValid: errors.length === 0,
      errors,
    });
  }

  isReservedKeyword(identifier: string): boolean {
    return this.reservedKeywords.includes(identifier.toLowerCase());
  }
}
