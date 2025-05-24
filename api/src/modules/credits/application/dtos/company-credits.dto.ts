export class CompanyCreditsDto {
  id: number;
  tenantId: string;
  totalPurchased: number;
  currentBalance: number;
  lastPurchaseAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
