import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/database/prisma/prisma.service';
import { CreditTransactionRepository } from '../../domain/repositories/credit-transaction.repository';
import { CreditTransactionEntity } from '../../domain/entities/credit-transaction.entity';
import { TransactionType } from '../../domain/value-objects/transaction-type.enum';

@Injectable()
export class CreditTransactionRepositoryImpl
  implements CreditTransactionRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    transaction: CreditTransactionEntity,
  ): Promise<CreditTransactionEntity> {
    const created = await this.prisma.client.creditTransaction.create({
      data: {
        transactionType: transaction.getTransactionType(),
        amount: transaction.getAmount(),
        description: transaction.getDescription(),
        tenantId: transaction.getTenantId(),
        referenceId: transaction.getReferenceId(),
        createdAt: transaction.getCreatedAt(),
      },
    });

    return new CreditTransactionEntity(
      created.id,
      created.transactionType as TransactionType,
      created.amount,
      created.description,
      created.tenantId,
      created.referenceId,
      created.createdAt,
    );
  }

  async findByTenantId(tenantId: string): Promise<CreditTransactionEntity[]> {
    const transactions = await this.prisma.client.creditTransaction.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return transactions.map(
      (tx) =>
        new CreditTransactionEntity(
          tx.id,
          tx.transactionType as TransactionType,
          tx.amount,
          tx.description,
          tx.tenantId,
          tx.referenceId,
          tx.createdAt,
        ),
    );
  }

  async findByTenantIdAndType(
    tenantId: string,
    type: TransactionType,
  ): Promise<CreditTransactionEntity[]> {
    const transactions = await this.prisma.client.creditTransaction.findMany({
      where: {
        tenantId,
        transactionType: type,
      },
      orderBy: { createdAt: 'desc' },
    });

    return transactions.map(
      (tx) =>
        new CreditTransactionEntity(
          tx.id,
          tx.transactionType as TransactionType,
          tx.amount,
          tx.description,
          tx.tenantId,
          tx.referenceId,
          tx.createdAt,
        ),
    );
  }
}
