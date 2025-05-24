import { TransactionType } from '../value-objects/transaction-type.enum';

export class CreditTransactionEntity {
  constructor(
    private readonly id: number,
    private readonly transactionType: TransactionType,
    private readonly amount: number,
    private readonly description: string | null,
    private readonly tenantId: string,
    private readonly referenceId: number | null,
    private readonly createdAt: Date,
  ) {}

  getId(): number {
    return this.id;
  }

  getTransactionType(): TransactionType {
    return this.transactionType;
  }

  getAmount(): number {
    return this.amount;
  }

  getDescription(): string | null {
    return this.description;
  }

  getTenantId(): string {
    return this.tenantId;
  }

  getReferenceId(): number | null {
    return this.referenceId;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  isPurchase(): boolean {
    return this.transactionType === TransactionType.PURCHASE;
  }

  isUsage(): boolean {
    return this.transactionType === TransactionType.USAGE;
  }
}
