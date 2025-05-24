import { CompanyCreditsEntity } from '../entities/company-credits.entity';

export interface CompanyCreditsRepository {
  findByTenantId(tenantId: string): Promise<CompanyCreditsEntity | null>;
  save(companyCredits: CompanyCreditsEntity): Promise<CompanyCreditsEntity>;
  create(companyCredits: CompanyCreditsEntity): Promise<CompanyCreditsEntity>;
}
