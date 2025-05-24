import { TransactionType } from '../../domain/value-objects/transaction-type.enum';

export class CreditTransactionDto {
  id: number;
  transactionType: TransactionType;
  amount: number;
  description: string | null;
  tenantId: string;
  referenceId: number | null;
  createdAt: Date;
}
