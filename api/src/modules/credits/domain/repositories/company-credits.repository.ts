/**
 * File Manager - company-credits.repository Repository
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { CompanyCreditsEntity } from '../entities/company-credits.entity';

export interface CompanyCreditsRepository {
  findByTenantId(tenantId: string): Promise<CompanyCreditsEntity | null>;
  save(companyCredits: CompanyCreditsEntity): Promise<CompanyCreditsEntity>;
  create(companyCredits: CompanyCreditsEntity): Promise<CompanyCreditsEntity>;
}
