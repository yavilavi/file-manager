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
