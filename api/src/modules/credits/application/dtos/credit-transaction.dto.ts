/**
 * File Manager - credit-transaction.dto DTO
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
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
