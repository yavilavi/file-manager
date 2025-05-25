/**
 * File Manager - credit-transaction.repository Repository
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { CreditTransactionEntity } from '../entities/credit-transaction.entity';
import { TransactionType } from '../value-objects/transaction-type.enum';

export interface CreditTransactionRepository {
  create(
    transaction: CreditTransactionEntity,
  ): Promise<CreditTransactionEntity>;
  findByTenantId(tenantId: string): Promise<CreditTransactionEntity[]>;
  findByTenantIdAndType(
    tenantId: string,
    type: TransactionType,
  ): Promise<CreditTransactionEntity[]>;
}
