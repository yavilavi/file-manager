/**
 * File Manager - company-credits.dto DTO
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
export class CompanyCreditsDto {
  id: number;
  tenantId: string;
  totalPurchased: number;
  currentBalance: number;
  lastPurchaseAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
