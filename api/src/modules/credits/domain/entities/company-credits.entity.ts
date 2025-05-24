export class CompanyCreditsEntity {
  constructor(
    private readonly id: number,
    private readonly tenantId: string,
    private totalPurchased: number,
    private currentBalance: number,
    private lastPurchaseAt: Date | null,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  getId(): number {
    return this.id;
  }

  getTenantId(): string {
    return this.tenantId;
  }

  getTotalPurchased(): number {
    return this.totalPurchased;
  }

  getCurrentBalance(): number {
    return this.currentBalance;
  }

  getLastPurchaseAt(): Date | null {
    return this.lastPurchaseAt;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  addCredits(amount: number): void {
    if (amount <= 0) {
      throw new Error('Credit amount must be positive');
    }

    this.totalPurchased += amount;
    this.currentBalance += amount;
    this.lastPurchaseAt = new Date();
    this.updatedAt = new Date();
  }

  useCredits(amount: number): void {
    if (amount <= 0) {
      throw new Error('Credit usage amount must be positive');
    }

    if (this.currentBalance < amount) {
      throw new Error('Insufficient credits');
    }

    this.currentBalance -= amount;
    this.updatedAt = new Date();
  }
}
